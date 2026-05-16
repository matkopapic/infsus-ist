import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trainingsApi } from '../api/trainings.api';
import type { Training } from '../api/types';
import TrainerSelect from '../components/forms/TrainerSelect';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import type { Column } from '../components/ui/DataTable';
import Input from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import Pagination from '../components/ui/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import styles from './TrainingsListPage.module.css';

const PAGE_SIZE = 10;

function TrainingsListPage() {
  const navigate = useNavigate();

  const [trainings, setTrainings] = useState<Training[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await trainingsApi.list({
        search: debouncedSearch || undefined,
        trainerId: trainerId || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setTrainings(result.data);
      setTotal(result.total);
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? 'Greška pri dohvaćanju';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, trainerId, fromDate, toDate, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Resetiraj na prvu stranicu kad korisnik mijenja filtre
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, trainerId, fromDate, toDate]);

  const handleResetFilters = () => {
    setSearch('');
    setTrainerId('');
    setFromDate('');
    setToDate('');
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString('hr-HR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns: Column<Training>[] = [
    {
      key: 'name',
      header: 'Naziv',
      render: (row) => row.name,
    },
    {
      key: 'time',
      header: 'Vrijeme',
      render: (row) => formatDateTime(row.trainingTime),
      width: '180px',
    },
    {
      key: 'duration',
      header: 'Trajanje',
      render: (row) => `${row.durationInMinutes} min`,
      width: '100px',
    },
    {
      key: 'capacity',
      header: 'Popunjenost',
      width: '160px',
      render: (row) => {
        const taken = row.capacity - row.availableSlots;
        const isFull = row.availableSlots === 0;
        return (
          <span className={isFull ? styles.full : ''}>
            <span className={styles.capacityValue}>
              {taken} / {row.capacity}
            </span>
            {isFull && <span className={styles.fullBadge}>POPUNJENO</span>}
          </span>
        );
      },
    },
    {
      key: 'trainer',
      header: 'Trener',
      render: (row) => row.trainer.name,
      width: '180px',
    },
  ];

  const hasFilters = Boolean(search || trainerId || fromDate || toDate);

  return (
    <div>
      <PageHeader
        title="Treninzi"
        subtitle="Pregled i upravljanje treninzima"
        actions={
          <Button onClick={() => navigate('/trainings/new')}>
            Novi trening
          </Button>
        }
      />

      <div className={styles.filters}>
        <div className={styles.filterRow}>
          <Input
            label="Pretraga"
            placeholder="Pretraži po nazivu..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <TrainerSelect
            label="Trener"
            value={trainerId}
            onChange={setTrainerId}
            includeEmptyOption
            emptyOptionLabel="Svi treneri"
          />
          <Input
            label="Od datuma"
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
          <Input
            label="Do datuma"
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
          />
        </div>
        {hasFilters && (
          <div className={styles.resetWrapper}>
            <Button variant="secondary" onClick={handleResetFilters}>
              Resetiraj filtre
            </Button>
          </div>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <DataTable
        columns={columns}
        data={trainings}
        rowKey={(row) => row.trainingId}
        isLoading={isLoading}
        emptyMessage="Nema treninga za prikaz"
        onRowClick={(row) => navigate(`/trainings/${row.trainingId}`)}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export default TrainingsListPage;
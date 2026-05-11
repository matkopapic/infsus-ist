import { useEffect, useState } from 'react';
import { membershipsApi } from '../api/memberships.api';
import type { Membership } from '../api/types';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import type { Column } from '../components/ui/DataTable';
import Input from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import Pagination from '../components/ui/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import styles from './MembershipsPage.module.css';

const PAGE_SIZE = 10;

function MembershipsPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  // Dohvati listu pri promjeni stranice ili pretrage
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await membershipsApi.list({
          search: debouncedSearch || undefined,
          page,
          limit: PAGE_SIZE,
        });
        if (!cancelled) {
          setMemberships(result.data);
          setTotal(result.total);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : (err as { message?: string })?.message ?? 'Greška pri dohvaćanju';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch]);

  // Resetiraj na prvu stranicu kad korisnik pretražuje
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const columns: Column<Membership>[] = [
    {
      key: 'name',
      header: 'Naziv',
      render: (row) => row.name,
    },
    {
      key: 'duration',
      header: 'Trajanje',
      render: (row) => `${row.durationInDays} dana`,
      width: '150px',
    },
    {
      key: 'price',
      header: 'Cijena',
      render: (row) => `${row.price.toFixed(2)} €`,
      width: '120px',
      align: 'right',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Članstva"
        subtitle="Šifrarnik tipova članstva"
        actions={
          <Button onClick={() => alert('tbd')}>
            Novo članstvo
          </Button>
        }
      />

      <div className={styles.filters}>
        <Input
          placeholder="Pretraži po nazivu..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <DataTable
        columns={columns}
        data={memberships}
        rowKey={(row) => row.membershipId}
        isLoading={isLoading}
        emptyMessage="Nema članstava za prikaz"
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export default MembershipsPage;
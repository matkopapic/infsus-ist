import { useCallback, useEffect, useState } from 'react';
import { membershipsApi } from '../api/memberships.api';
import type { Membership } from '../api/types';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import type { Column } from '../components/ui/DataTable';
import Input from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import Pagination from '../components/ui/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import MembershipFormModal from './MembershipFormModal';
import styles from './MembershipsPage.module.css';

const PAGE_SIZE = 10;

function MembershipsPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState<Membership | undefined>(undefined);

  const debouncedSearch = useDebounce(search, 300);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await membershipsApi.list({
        search: debouncedSearch || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setMemberships(result.data);
      setTotal(result.total);
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? 'Greška pri dohvaćanju';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) await loadData();
    })();
    return () => {
      cancelled = true;
    };
  }, [loadData]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleCreate = () => {
    setEditingMembership(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (membership: Membership) => {
    setEditingMembership(membership);
    setIsModalOpen(true);
  };

  const handleDelete = async (membership: Membership) => {
    const confirmed = window.confirm(
      `Jeste li sigurni da želite obrisati članstvo "${membership.name}"?`
    );
    if (!confirmed) return;

    try {
      await membershipsApi.remove(membership.membershipId);
      alert('Članstvo je obrisano');
      loadData();
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? 'Greška pri brisanju';
      alert(`Greška: ${message}`);
    }
  };

  const handleSaved = () => {
    alert('Spremljeno');
    loadData();
  };

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
    {
      key: 'actions',
      header: '',
      width: '200px',
      align: 'right',
      render: (row) => (
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-2)',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="secondary" onClick={() => handleEdit(row)}>
            Uredi
          </Button>
          <Button variant="danger" onClick={() => handleDelete(row)}>
            Obriši
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Članstva"
        subtitle="Šifrarnik tipova članstva"
        actions={<Button onClick={handleCreate}>Novo članstvo</Button>}
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

      <MembershipFormModal
        isOpen={isModalOpen}
        membership={editingMembership}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleSaved}
      />
    </div>
  );
}

export default MembershipsPage;
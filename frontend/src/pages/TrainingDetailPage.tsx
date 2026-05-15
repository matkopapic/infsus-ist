import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { reservationsApi } from '../api/reservations.api';
import { trainingsApi } from '../api/trainings.api';
import type { Reservation, Training } from '../api/types';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import type { Column } from '../components/ui/DataTable';
import PageHeader from '../components/ui/PageHeader';
import styles from './TrainingDetailPage.module.css';

function TrainingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [training, setTraining] = useState<Training | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoadingTraining, setIsLoadingTraining] = useState(true);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTraining = useCallback(async () => {
    if (!id) return;
    setIsLoadingTraining(true);
    try {
      const data = await trainingsApi.getById(id);
      setTraining(data);
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? 'Greška pri dohvaćanju';
      setError(message);
    } finally {
      setIsLoadingTraining(false);
    }
  }, [id]);

  const loadReservations = useCallback(async () => {
    if (!id) return;
    setIsLoadingReservations(true);
    try {
      const result = await reservationsApi.listByTraining(id);
      setReservations(result.data);
    } catch {
      // Rezervacije nisu kritične, ne ruše stranicu
      setReservations([]);
    } finally {
      setIsLoadingReservations(false);
    }
  }, [id]);

  useEffect(() => {
    loadTraining();
    loadReservations();
  }, [loadTraining, loadReservations]);

  if (isLoadingTraining) {
    return (
      <div>
        <PageHeader title="Detalji treninga" />
        <p style={{ color: 'var(--color-text-muted)' }}>Učitavanje...</p>
      </div>
    );
  }

  if (error || !training) {
    return (
      <div>
        <PageHeader title="Detalji treninga" />
        <div className={styles.errorBanner}>
          {error ?? 'Trening nije pronađen'}
        </div>
        <Link to="/trainings" className={styles.backLink}>
          ← Natrag na listu
        </Link>
      </div>
    );
  }

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString('hr-HR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const taken = training.capacity - training.availableSlots;
  const fillPercentage = (taken / training.capacity) * 100;
  const isFull = training.availableSlots === 0;
  const isPast = new Date(training.trainingTime).getTime() < Date.now();

  const reservationColumns: Column<Reservation>[] = [
    {
      key: 'name',
      header: 'Član',
      render: (row) => row.member.name,
    },
  ];

  return (
    <div>
      <Link to="/trainings" className={styles.backLink}>
        ← Natrag na listu
      </Link>

      <PageHeader
        title={training.name}
        subtitle={`Trening • ${formatDateTime(training.trainingTime)}`}
      />

      <div className={styles.card}>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Vrijeme početka</span>
            <span className={styles.infoValue}>
              {formatDateTime(training.trainingTime)}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Trajanje</span>
            <span className={styles.infoValue}>
              {training.durationInMinutes} minuta
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Trener</span>
            <span className={styles.infoValue}>{training.trainer.name}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Status</span>
            <span className={styles.infoValue}>
              {isPast ? (
                <span className={styles.statusPast}>Završen</span>
              ) : isFull ? (
                <span className={styles.statusFull}>Popunjen</span>
              ) : (
                <span className={styles.statusOpen}>Otvoren za rezervacije</span>
              )}
            </span>
          </div>
        </div>

        <div className={styles.capacitySection}>
          <div className={styles.capacityHeader}>
            <span className={styles.infoLabel}>Popunjenost</span>
            <span className={styles.capacityNumbers}>
              {taken} / {training.capacity}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() => navigate(`/trainings/${training.trainingId}/edit`)}
          >
            Uredi
          </Button>
          <Button variant="danger" disabled>
            Obriši
          </Button>
        </div>
      </div>

      <section className={styles.reservationsSection}>
        <div className={styles.reservationsHeader}>
          <h2 className={styles.sectionTitle}>
            Rezervacije ({reservations.length} / {training.capacity})
          </h2>
          <Button disabled>Nova rezervacija</Button>
        </div>

        <DataTable
          columns={reservationColumns}
          data={reservations}
          rowKey={(row) => row.reservationId}
          isLoading={isLoadingReservations}
          emptyMessage="Nema rezervacija za ovaj trening"
        />
      </section>
    </div>
  );
}

export default TrainingDetailPage;
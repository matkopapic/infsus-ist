import { useEffect, useState } from 'react';
import { reservationsApi } from '../api/reservations.api';
import MemberSelect from '../components/forms/MemberSelect';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

interface ReservationFormModalProps {
  isOpen: boolean;
  trainingId: string;
  trainingName: string;
  onClose: () => void;
  onSaved: () => void;
}

function ReservationFormModal({
  isOpen,
  trainingId,
  trainingName,
  onClose,
  onSaved,
}: ReservationFormModalProps) {
  const [memberId, setMemberId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMemberId('');
      setError(null);
      setGeneralError(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!memberId) {
      setError('Član je obavezan');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setGeneralError(null);

    try {
      await reservationsApi.create(trainingId, { memberId });
      onSaved();
      onClose();
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? 'Greška pri spremanju';
      setGeneralError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova rezervacija"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Odustani
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Spremam...' : 'Rezerviraj'}
          </Button>
        </>
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-sm)' }}>
          Rezervirate trening: <strong style={{ color: 'var(--color-text)' }}>{trainingName}</strong>
        </p>

        {generalError && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'var(--color-danger-soft)',
              border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-danger)',
              fontSize: 'var(--font-sm)',
            }}
          >
            {generalError}
          </div>
        )}

        <MemberSelect
          label="Član"
          value={memberId}
          onChange={setMemberId}
          error={error ?? undefined}
          disabled={isSubmitting}
        />
      </div>
    </Modal>
  );
}

export default ReservationFormModal;
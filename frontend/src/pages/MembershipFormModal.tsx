import { useEffect, useState } from 'react';
import { membershipsApi } from '../api/memberships.api';
import type { Membership } from '../api/types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

interface MembershipFormModalProps {
  isOpen: boolean;
  membership?: Membership;
  onClose: () => void;
  onSaved: () => void;
}

interface FormValues {
  name: string;
  durationInDays: string;
  price: string;
}

interface FormErrors {
  name?: string;
  durationInDays?: string;
  price?: string;
  general?: string;
}

const EMPTY_VALUES: FormValues = {
  name: '',
  durationInDays: '',
  price: '',
};

function MembershipFormModal({
  isOpen,
  membership,
  onClose,
  onSaved,
}: MembershipFormModalProps) {
  const isEdit = Boolean(membership);

  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (membership) {
      setValues({
        name: membership.name,
        durationInDays: String(membership.durationInDays),
        price: String(membership.price),
      });
    } else {
      setValues(EMPTY_VALUES);
    }
    setErrors({});
  }, [isOpen, membership]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!values.name.trim()) {
      newErrors.name = 'Naziv je obavezan';
    } else if (values.name.length > 255) {
      newErrors.name = 'Naziv smije imati najviše 255 znakova';
    }

    const duration = Number(values.durationInDays);
    if (!values.durationInDays.trim()) {
      newErrors.durationInDays = 'Trajanje je obavezno';
    } else if (!Number.isInteger(duration) || duration < 1) {
      newErrors.durationInDays = 'Trajanje mora biti cijeli broj veći od 0';
    }

    const price = Number(values.price);
    if (!values.price.trim()) {
      newErrors.price = 'Cijena je obavezna';
    } else if (Number.isNaN(price) || price <= 0) {
      newErrors.price = 'Cijena mora biti veća od 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    const payload = {
      name: values.name.trim(),
      durationInDays: Number(values.durationInDays),
      price: Number(values.price),
    };

    try {
      if (membership) {
        await membershipsApi.update(membership.membershipId, payload);
      } else {
        await membershipsApi.create(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? 'Greška pri spremanju';
      setErrors({ general: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Uredi članstvo' : 'Novo članstvo'}
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
            {isSubmitting ? 'Spremam...' : 'Spremi'}
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
        {errors.general && (
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
            {errors.general}
          </div>
        )}

        <Input
          label="Naziv"
          name="name"
          value={values.name}
          onChange={(event) => updateField('name', event.target.value)}
          error={errors.name}
          placeholder="npr. Mjesečno"
          disabled={isSubmitting}
        />

        <Input
          label="Trajanje (dana)"
          name="durationInDays"
          type="number"
          min={1}
          value={values.durationInDays}
          onChange={(event) =>
            updateField('durationInDays', event.target.value)
          }
          error={errors.durationInDays}
          placeholder="30"
          disabled={isSubmitting}
        />

        <Input
          label="Cijena (€)"
          name="price"
          type="number"
          step="0.01"
          min={0.01}
          value={values.price}
          onChange={(event) => updateField('price', event.target.value)}
          error={errors.price}
          placeholder="35.00"
          disabled={isSubmitting}
        />
      </div>
    </Modal>
  );
}

export default MembershipFormModal;
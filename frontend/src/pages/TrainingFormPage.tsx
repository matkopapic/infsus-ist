import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trainingsApi } from '../api/trainings.api';
import TrainerSelect from '../components/forms/TrainerSelect';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import styles from './TrainingFormPage.module.css';

interface FormValues {
  name: string;
  trainingTime: string; // datetime-local format: YYYY-MM-DDTHH:mm
  durationInMinutes: string;
  capacity: string;
  trainerId: string;
}

interface FormErrors {
  name?: string;
  trainingTime?: string;
  durationInMinutes?: string;
  capacity?: string;
  trainerId?: string;
  general?: string;
}

const EMPTY_VALUES: FormValues = {
  name: '',
  trainingTime: '',
  durationInMinutes: '',
  capacity: '',
  trainerId: '',
};

function TrainingFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!values.name.trim()) {
      newErrors.name = 'Naziv je obavezan';
    } else if (values.name.length > 255) {
      newErrors.name = 'Naziv smije imati najviše 255 znakova';
    }

    if (!values.trainingTime) {
      newErrors.trainingTime = 'Vrijeme je obavezno';
    } else {
      const trainingDate = new Date(values.trainingTime);
      if (Number.isNaN(trainingDate.getTime())) {
        newErrors.trainingTime = 'Neispravan format datuma';
      } else if (trainingDate.getTime() <= Date.now()) {
        newErrors.trainingTime = 'Vrijeme mora biti u budućnosti';
      }
    }

    const duration = Number(values.durationInMinutes);
    if (!values.durationInMinutes.trim()) {
      newErrors.durationInMinutes = 'Trajanje je obavezno';
    } else if (!Number.isInteger(duration) || duration < 1) {
      newErrors.durationInMinutes =
        'Trajanje mora biti cijeli broj veći od 0';
    }

    const capacity = Number(values.capacity);
    if (!values.capacity.trim()) {
      newErrors.capacity = 'Kapacitet je obavezan';
    } else if (!Number.isInteger(capacity) || capacity < 1) {
      newErrors.capacity = 'Kapacitet mora biti cijeli broj veći od 0';
    }

    if (!values.trainerId) {
      newErrors.trainerId = 'Trener je obavezan';
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
      trainingTime: new Date(values.trainingTime).toISOString(),
      durationInMinutes: Number(values.durationInMinutes),
      capacity: Number(values.capacity),
      trainerId: values.trainerId,
    };

    try {
      const training = await trainingsApi.create(payload);
      alert('Trening je stvoren');
      navigate(`/trainings/${training.trainingId}`);
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? 'Greška pri spremanju';
      setErrors({ general: message });
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Uređivanje treninga' : 'Novi trening'}
        subtitle={
          isEdit
            ? 'Uredite podatke o treningu'
            : 'Unesite podatke za novi trening'
        }
      />

      <div className={styles.formCard}>
        {errors.general && (
          <div className={styles.errorBanner}>{errors.general}</div>
        )}

        <div className={styles.formGrid}>
          <Input
            label="Naziv"
            name="name"
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            error={errors.name}
            placeholder="npr. Group cardio workout"
            disabled={isSubmitting}
          />

          <Input
            label="Vrijeme"
            name="trainingTime"
            type="datetime-local"
            value={values.trainingTime}
            onChange={(event) => updateField('trainingTime', event.target.value)}
            error={errors.trainingTime}
            disabled={isSubmitting}
          />

          <Input
            label="Trajanje (minute)"
            name="durationInMinutes"
            type="number"
            min={1}
            value={values.durationInMinutes}
            onChange={(event) =>
              updateField('durationInMinutes', event.target.value)
            }
            error={errors.durationInMinutes}
            placeholder="60"
            disabled={isSubmitting}
          />

          <Input
            label="Kapacitet"
            name="capacity"
            type="number"
            min={1}
            value={values.capacity}
            onChange={(event) => updateField('capacity', event.target.value)}
            error={errors.capacity}
            placeholder="15"
            disabled={isSubmitting}
          />

          <div className={styles.fullWidth}>
            <TrainerSelect
              label="Trener"
              value={values.trainerId}
              onChange={(id) => updateField('trainerId', id)}
              error={errors.trainerId}
              disabled={isSubmitting}
              includeEmptyOption
              emptyOptionLabel="-- Odaberi trenera --"
            />
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() => navigate('/trainings')}
            disabled={isSubmitting}
          >
            Odustani
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Spremam...' : 'Spremi'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TrainingFormPage;
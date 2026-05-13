import { useEffect, useState } from 'react';
import { trainersApi } from '../../api/trainers.api';
import type { TrainerOption } from '../../api/types';
import Select from '../ui/Select';

interface TrainerSelectProps {
  value: string;
  onChange: (trainerId: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  includeEmptyOption?: boolean;
  emptyOptionLabel?: string;
}

function TrainerSelect({
  value,
  onChange,
  label,
  error,
  disabled,
  includeEmptyOption = false,
  emptyOptionLabel = 'Svi treneri',
}: TrainerSelectProps) {
  const [trainers, setTrainers] = useState<TrainerOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    trainersApi
      .list()
      .then((data) => {
        if (!cancelled) {
          setTrainers(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTrainers([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Select
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      error={error}
      disabled={disabled || isLoading}
    >
      {includeEmptyOption && <option value="">{emptyOptionLabel}</option>}
      {trainers.map((trainer) => (
        <option key={trainer.trainerId} value={trainer.trainerId}>
          {trainer.name}
        </option>
      ))}
    </Select>
  );
}

export default TrainerSelect;
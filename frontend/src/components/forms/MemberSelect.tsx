import { useEffect, useState } from 'react';
import { membersApi } from '../../api/members.api';
import type { MemberOption } from '../../api/types';
import Select from '../ui/Select';

interface MemberSelectProps {
  value: string;
  onChange: (memberId: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  emptyOptionLabel?: string;
}

function MemberSelect({
  value,
  onChange,
  label,
  error,
  disabled,
  emptyOptionLabel = '-- Odaberi člana --',
}: MemberSelectProps) {
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    membersApi
      .list()
      .then((data) => {
        if (!cancelled) {
          setMembers(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMembers([]);
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
      <option value="">{emptyOptionLabel}</option>
      {members.map((member) => (
        <option key={member.memberId} value={member.memberId}>
          {member.name} ({member.email})
        </option>
      ))}
    </Select>
  );
}

export default MemberSelect;
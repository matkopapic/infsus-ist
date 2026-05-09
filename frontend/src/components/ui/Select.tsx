import type { SelectHTMLAttributes, ReactNode } from 'react';
import styles from './Select.module.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

function Select({
  label,
  error,
  id,
  className,
  children,
  ...rest
}: SelectProps) {
  const selectId = id ?? rest.name;
  const selectClass = [
    styles.select,
    error ? styles.selectError : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <select id={selectId} className={selectClass} {...rest}>
        {children}
      </select>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default Select;
import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

function Input({ label, error, id, className, ...rest }: InputProps) {
  const inputId = id ?? rest.name;
  const inputClass = [
    styles.input,
    error ? styles.inputError : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input id={inputId} className={inputClass} {...rest} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default Input;
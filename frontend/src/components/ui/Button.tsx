import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
}

function Button({
  variant = 'primary',
  children,
  className,
  ...rest
}: ButtonProps) {
  const variantClass = styles[variant];
  const combined = [styles.button, variantClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={combined} {...rest}>
      {children}
    </button>
  );
}

export default Button;
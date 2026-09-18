import { FC, ButtonHTMLAttributes, ReactNode, memo } from 'react';
import { SpinnerIcon } from '../Icons/Icons';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly loading?: boolean;
  readonly icon?: ReactNode;
  readonly children: ReactNode;
}

export const Button: FC<ButtonProps> = memo(({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const variantClass = {
    primary: styles.variantPrimary,
    secondary: styles.variantSecondary,
    accent: styles.variantAccent,
    outline: styles.variantOutline,
    ghost: styles.variantGhost,
  }[variant];

  const sizeClass = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  }[size];

  return (
    <button
      className={`${styles.button} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <SpinnerIcon className={styles.spinner} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon}
          <span>{children}</span>
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

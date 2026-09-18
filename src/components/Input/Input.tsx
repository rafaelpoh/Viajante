import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label: string;
  readonly error?: string;
  readonly required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  required,
  id,
  className = '',
  ...props
}, ref) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={styles.fieldContainer}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {required && <span className={styles.requiredStar} aria-hidden="true">*</span>}
      </label>
      <input
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={Boolean(error)}
        className={`${styles.input} ${error ? styles.inputError : ''} ${className}`}
        {...props}
      />
      {error && <span role="alert" className={styles.errorMessage}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  readonly label: string;
  readonly error?: string;
  readonly required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  required,
  id,
  className = '',
  ...props
}, ref) => {
  const textareaId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={styles.fieldContainer}>
      <label htmlFor={textareaId} className={styles.label}>
        {label}
        {required && <span className={styles.requiredStar} aria-hidden="true">*</span>}
      </label>
      <textarea
        ref={ref}
        id={textareaId}
        required={required}
        aria-invalid={Boolean(error)}
        className={`${styles.textarea} ${error ? styles.textareaError : ''} ${className}`}
        {...props}
      />
      {error && <span role="alert" className={styles.errorMessage}>{error}</span>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

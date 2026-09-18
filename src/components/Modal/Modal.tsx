import { FC, ReactNode, useEffect, useRef, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../Icons/Icons';
import styles from './Modal.module.css';

export interface ModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly children: ReactNode;
  readonly wide?: boolean;
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  wide = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Impede rolagem do corpo da página com modal aberto
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={styles.overlay}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading-title"
    >
      <div
        ref={modalRef}
        className={`${styles.modal} ${wide ? styles.modalWide : ''}`}
      >
        <div className={styles.header}>
          <h2 id="modal-heading-title" className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar janela modal"
          >
            <CloseIcon className={styles.closeIcon} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

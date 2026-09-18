import { FC, memo } from 'react';
import { Modal } from '../../../../components/Modal/Modal';
import { SpinnerIcon } from '../../../../components/Icons/Icons';
import { formatDate } from '../../../../utils/formatters';
import type { TravelPlan } from '../../../../types/travelPlan';
import styles from './SavedPlansModal.module.css';

export interface SavedPlansModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly plans: ReadonlyArray<TravelPlan>;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly onSelectPlan: (plan: TravelPlan) => void;
}

export const SavedPlansModal: FC<SavedPlansModalProps> = memo(({
  isOpen,
  onClose,
  plans,
  isLoading,
  error,
  onSelectPlan,
}) => {
  const handleSelect = (plan: TravelPlan): void => {
    onSelectPlan(plan);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Meus Planos de Viagem">
      {isLoading && (
        <div className={styles.loadingMessage}>
          <SpinnerIcon style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite' }} />
          <span>Carregando seu histórico...</span>
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}

      {!isLoading && !error && plans.length === 0 && (
        <div className={styles.emptyState}>
          <p>Você ainda não possui planos de viagem salvos.</p>
          <p>Gere seu primeiro itinerário utilizando o formulário da página!</p>
        </div>
      )}

      {!isLoading && plans.length > 0 && (
        <div className={styles.listContainer}>
          {plans.map((plan) => (
            <button
              key={plan.id || `${plan.destino}-${plan.periodo}`}
              type="button"
              className={styles.planCard}
              onClick={() => handleSelect(plan)}
            >
              <span className={styles.planTitle}>{plan.destino}</span>
              <div className={styles.planMeta}>
                <span>{plan.periodo}</span>
                <span className="tabular-nums">{formatDate(plan.createdAt)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
});

SavedPlansModal.displayName = 'SavedPlansModal';

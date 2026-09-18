import { FC, useState, FormEvent, memo } from 'react';
import { Input, Textarea } from '../../../../components/Input/Input';
import { Button } from '../../../../components/Button/Button';
import { SparklesIcon, SpinnerIcon } from '../../../../components/Icons/Icons';
import { TravelPlanInputSchema, type TravelPlanInput } from '../../../../types/travelPlan';
import styles from './PlanForm.module.css';

export interface PlanFormProps {
  readonly isAuthenticated: boolean;
  readonly isGenerating: boolean;
  readonly errorMessage: string | null;
  readonly onRequireAuth: () => void;
  readonly onSubmitPlan: (data: TravelPlanInput) => Promise<void>;
}

export const PlanForm: FC<PlanFormProps> = memo(({
  isAuthenticated,
  isGenerating,
  errorMessage,
  onRequireAuth,
  onSubmitPlan,
}) => {
  const [destino, setDestino] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [motivo, setMotivo] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    setFieldErrors({});

    const formData: TravelPlanInput = {
      destino,
      periodo_viagem: periodo,
      motivo_viagem: motivo,
    };

    const validation = TravelPlanInputSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[String(issue.path[0])] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    await onSubmitPlan(validation.data);
  };

  return (
    <section id="create-plan" className={styles.section}>
      <div className="container">
        <div className={styles.card}>
          <h2 className={styles.heading}>Crie Seu Plano de Viagem Personalizado</h2>
          <p className={styles.description}>
            Indique seu destino, a duração e o estilo desejado. Nossa IA vai estruturar um itinerário completo com dados climáticos e financeiros.
          </p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.gridTwoCols}>
              <Input
                label="Destino"
                placeholder="Ex: Paris, Tóquio, Bonito"
                required
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                error={fieldErrors['destino']}
                disabled={isGenerating}
              />

              <Input
                label="Período da Viagem"
                placeholder="Ex: 7 dias em Julho, Fim de semana"
                required
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                error={fieldErrors['periodo_viagem']}
                disabled={isGenerating}
              />
            </div>

            <Textarea
              label="Motivo e Estilo da Viagem"
              placeholder="Ex: Lua de mel romântica, aventura com trilhas, férias em família com crianças..."
              required
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              error={fieldErrors['motivo_viagem']}
              disabled={isGenerating}
            />

            {errorMessage && (
              <div role="alert" className={`${styles.alert} ${styles.alertError}`}>
                {errorMessage}
              </div>
            )}

            {isGenerating && (
              <div role="status" className={`${styles.alert} ${styles.alertLoading}`}>
                <SpinnerIcon className={styles.spinner} />
                <span>
                  Consultando clima, dados geográficos e gerando itinerário inteligente com IA...
                </span>
              </div>
            )}

            <div className={styles.submitWrapper}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isGenerating}
                icon={!isGenerating ? <SparklesIcon /> : undefined}
                className={styles.submitBtn}
              >
                {isAuthenticated ? 'Gerar Meu Plano Agora' : 'Faça login para gerar seu plano'}
              </Button>
              {!isAuthenticated && (
                <span className={styles.loginHint}>
                  Você precisa estar logado para salvar seu roteiro com segurança no Firestore.
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
});

PlanForm.displayName = 'PlanForm';

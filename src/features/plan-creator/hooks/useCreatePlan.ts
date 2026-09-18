import { useState, useCallback } from 'react';
import { createPlan } from '../services/planApi';
import type { TravelPlan, TravelPlanInput } from '../../../types/travelPlan';

export function useCreatePlan() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successPlan, setSuccessPlan] = useState<TravelPlan | null>(null);

  const generatePlan = useCallback(
    async (input: TravelPlanInput, idToken: string): Promise<TravelPlan> => {
      setIsGenerating(true);
      setError(null);

      try {
        const plan = await createPlan(input, idToken);
        setSuccessPlan(plan);
        return plan;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro ao gerar o plano.';
        setError(message);
        throw err;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isGenerating,
    error,
    successPlan,
    generatePlan,
    clearError,
  };
}

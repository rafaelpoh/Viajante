import { useState, useCallback } from 'react';
import { getSavedPlans } from '../services/savedPlansApi';
import type { TravelPlan } from '../../../types/travelPlan';

export function useSavedPlans() {
  const [plans, setPlans] = useState<ReadonlyArray<TravelPlan>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async (idToken: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSavedPlans(idToken);
      setPlans(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao recuperar planos.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    plans,
    isLoading,
    error,
    fetchPlans,
  };
}

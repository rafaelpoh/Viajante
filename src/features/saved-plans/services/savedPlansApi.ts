import { z } from 'zod';
import { TravelPlan, TravelPlanSchema } from '../../../types/travelPlan';

const SavedPlansArraySchema = z.array(TravelPlanSchema);

/**
 * Consulta a lista de planos de viagem salvos no Firestore para o usuário autenticado.
 */
export async function getSavedPlans(idToken: string): Promise<ReadonlyArray<TravelPlan>> {
  const response = await fetch('/api/get-plans', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    let errorMsg = 'Falha ao recuperar histórico de viagens.';
    try {
      const data = await response.json();
      if (data?.message) errorMsg = data.message;
    } catch {
      // Ignora erro de parse
    }
    throw new Error(errorMsg);
  }

  const raw = await response.json();
  const parsed = SavedPlansArraySchema.safeParse(raw);

  if (!parsed.success) {
    console.error('Falha de validação Zod no histórico de planos:', parsed.error);
    throw new Error('Formato inesperado ao carregar seus planos salvos.');
  }

  return parsed.data;
}

import { TravelPlanInput, TravelPlan, TravelPlanSchema } from '../../../types/travelPlan';

/**
 * Envia os parâmetros do plano para a Serverless Function /api/create-plan
 * e valida a resposta em tempo de execução via Zod.
 */
export async function createPlan(input: TravelPlanInput, idToken: string): Promise<TravelPlan> {
  const response = await fetch('/api/create-plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    let errorMsg = 'Falha ao gerar plano de viagem com IA.';
    try {
      const errorData = await response.json();
      if (errorData?.message) errorMsg = errorData.message;
    } catch {
      // Falha silenciosa no parse do erro
    }
    throw new Error(errorMsg);
  }

  const rawData = await response.json();

  // Validação em runtime na fronteira de I/O
  const parsedPlan = TravelPlanSchema.safeParse(rawData);
  if (!parsedPlan.success) {
    console.error('Falha de validação Zod na resposta do servidor:', parsedPlan.error);
    throw new Error('A resposta do planejador não está no formato esperado. Tente novamente.');
  }

  return parsedPlan.data;
}

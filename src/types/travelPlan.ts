import { z } from 'zod';

/**
 * Esquema de validação do formulário de entrada para criação do plano.
 */
export const TravelPlanInputSchema = z.object({
  destino: z.string().trim().min(2, 'Informe o destino desejado (ao menos 2 caracteres).'),
  periodo_viagem: z.string().trim().min(2, 'Informe a duração ou período da viagem.'),
  motivo_viagem: z.string().trim().min(3, 'Descreva o estilo, motivo ou companhias da viagem.'),
});

export type TravelPlanInput = Readonly<z.infer<typeof TravelPlanInputSchema>>;

/**
 * Esquema de atividades de um dia específico do roteiro.
 */
export const DayActivitySchema = z.object({
  dia: z.number(),
  titulo: z.string(),
  atividades: z.array(z.string()),
});

export type DayActivity = Readonly<z.infer<typeof DayActivitySchema>>;

/**
 * Esquema dos dados climáticos enriquecidos.
 */
export const WeatherDataSchema = z.object({
  temperatura_media: z.string().optional(),
  recomendacoes_roupa: z.string().optional(),
});

export type WeatherData = Readonly<z.infer<typeof WeatherDataSchema>>;

/**
 * Esquema dos dados financeiros e de câmbio.
 */
export const FinancialDataSchema = z.object({
  moeda_local: z.string().optional(),
  planejamento_custo: z.string().optional(),
  moeda_levar: z.string().optional(),
});

export type FinancialData = Readonly<z.infer<typeof FinancialDataSchema>>;

/**
 * Esquema completo e estrito de um plano de viagem (retorno da IA / Firestore).
 */
export const TravelPlanSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  userEmail: z.string().optional(),
  destino: z.string(),
  periodo: z.string(),
  motivo: z.string(),
  resumo: z.string().default(''),
  dicas_gerais: z.array(z.string()).default([]),
  dados_clima: WeatherDataSchema.nullable().optional(),
  dados_financeiros: FinancialDataSchema.nullable().optional(),
  itinerario: z.array(DayActivitySchema).default([]),
  lat: z.number().nullable().optional(),
  lon: z.number().nullable().optional(),
  createdAt: z.union([
    z.string(),
    z.number(),
    z.object({ _seconds: z.number(), _nanoseconds: z.number().optional() }),
    z.date(),
  ]).optional(),
});

export type TravelPlan = Readonly<z.infer<typeof TravelPlanSchema>>;

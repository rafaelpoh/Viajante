import { FC, memo } from 'react';
import { Button } from '../../../../components/Button/Button';
import { DayCard } from '../DayCard/DayCard';
import { MapPinIcon, WeatherIcon, DollarIcon, CompassIcon } from '../../../../components/Icons/Icons';
import type { TravelPlan } from '../../../../types/travelPlan';
import styles from './ItineraryView.module.css';

export interface ItineraryViewProps {
  readonly plan: TravelPlan;
  readonly onOpenMap?: (lat: number, lon: number, destination: string) => void;
}

export const ItineraryView: FC<ItineraryViewProps> = memo(({ plan, onOpenMap }) => {
  const hasCoordinates = typeof plan.lat === 'number' && typeof plan.lon === 'number';

  const handleOpenMapClick = (): void => {
    if (hasCoordinates && onOpenMap && plan.lat && plan.lon) {
      onOpenMap(plan.lat, plan.lon, plan.destino);
    }
  };

  return (
    <section id="itinerary-result" className={styles.section} aria-label="Roteiro de Viagem">
      <div className="container">
        <div className={styles.containerCard}>
          <div className={styles.headerRow}>
            <div>
              <h3 className={styles.title}>Roteiro: {plan.destino}</h3>
              <span className={styles.periodBadge}>Período: {plan.periodo}</span>
            </div>
            {hasCoordinates && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={<MapPinIcon />}
                onClick={handleOpenMapClick}
              >
                Ver Destino no Mapa
              </Button>
            )}
          </div>

          {plan.resumo && <p className={styles.resumoText}>{plan.resumo}</p>}

          {/* Widgets de Clima e Finanças */}
          <div className={styles.insightsGrid}>
            {/* Clima */}
            <div className={styles.widgetCard}>
              <h4 className={styles.widgetTitle}>
                <WeatherIcon className={styles.widgetIcon} />
                Previsão do Tempo & Vestuário
              </h4>
              <p className={styles.widgetHighlight}>
                Temperatura Média:{' '}
                {plan.dados_clima?.temperatura_media || 'Informação sob consulta'}
              </p>
              <p className={styles.widgetDetail}>
                {plan.dados_clima?.recomendacoes_roupa ||
                  'Consulte a previsão climática próxima ao embarque.'}
              </p>
            </div>

            {/* Finanças e Moeda */}
            <div className={styles.widgetCard}>
              <h4 className={styles.widgetTitle}>
                <DollarIcon className={styles.widgetIcon} />
                Planejamento Financeiro & Moeda
              </h4>
              <p className={styles.widgetHighlight}>
                Moeda Local: {plan.dados_financeiros?.moeda_local || 'Moeda corrente local'}
              </p>
              <p className={styles.widgetDetail}>
                {plan.dados_financeiros?.planejamento_custo ||
                  'Planeje um orçamento diário balanceado para refeições e passeios.'}
              </p>
              {plan.dados_financeiros?.moeda_levar && (
                <p className={styles.widgetDetail}>
                  <strong>Recomendação de Câmbio:</strong> {plan.dados_financeiros.moeda_levar}
                </p>
              )}
            </div>
          </div>

          {/* Dicas Gerais */}
          {plan.dicas_gerais && plan.dicas_gerais.length > 0 && (
            <div className={styles.tipsSection}>
              <h4 className={styles.sectionHeading}>Dicas Gerais de Viagem</h4>
              <ul className={styles.tipsList}>
                {plan.dicas_gerais.map((dica, idx) => (
                  <li key={`dica-${idx}`} className={styles.tipItem}>
                    <CompassIcon className={styles.tipBullet} />
                    <span>{dica}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Programação Diária */}
          {plan.itinerario && plan.itinerario.length > 0 && (
            <div>
              <h4 className={styles.sectionHeading}>Programação Diária</h4>
              <div className={styles.daysGrid}>
                {plan.itinerario.map((day) => (
                  <DayCard key={`day-${day.dia}`} day={day} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

ItineraryView.displayName = 'ItineraryView';

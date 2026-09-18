import { FC, memo } from 'react';
import type { DayActivity } from '../../../../types/travelPlan';
import styles from './DayCard.module.css';

export interface DayCardProps {
  readonly day: DayActivity;
}

export const DayCard: FC<DayCardProps> = memo(({ day }) => (
  <div className={styles.dayCard}>
    <div className={styles.dayHeader}>
      <span className={styles.dayBadge}>Dia {day.dia}</span>
      <h4 className={styles.dayTitle}>{day.titulo}</h4>
    </div>
    <ul className={styles.activityList}>
      {day.atividades.map((atividade, idx) => (
        <li key={`${day.dia}-${idx}`} className={styles.activityItem}>
          <span className={styles.bullet} aria-hidden="true" />
          <span>{atividade}</span>
        </li>
      ))}
    </ul>
  </div>
));

DayCard.displayName = 'DayCard';

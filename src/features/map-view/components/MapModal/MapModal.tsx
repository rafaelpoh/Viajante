import { FC, memo } from 'react';
import { Modal } from '../../../../components/Modal/Modal';
import { LeafletMap } from '../LeafletMap/LeafletMap';
import type { MapCoordinates, MapPointOfInterest } from '../../../../types/map';
import styles from './MapModal.module.css';

export interface MapModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly coordinates: MapCoordinates | null;
  readonly pointsOfInterest?: ReadonlyArray<MapPointOfInterest>;
  readonly message?: string;
  readonly status?: 'idle' | 'loading' | 'success' | 'error';
}

export const MapModal: FC<MapModalProps> = memo(({
  isOpen,
  onClose,
  title = 'Localização & Atrações',
  coordinates,
  pointsOfInterest = [],
  message,
  status = 'idle',
}) => {
  const bannerClass = {
    idle: styles.bannerInfo,
    loading: styles.bannerInfo,
    success: styles.bannerSuccess,
    error: styles.bannerError,
  }[status];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} wide>
      {message && <div className={`${styles.banner} ${bannerClass}`}>{message}</div>}

      {coordinates ? (
        <LeafletMap
          lat={coordinates.lat}
          lon={coordinates.lon}
          label={coordinates.label}
          pointsOfInterest={pointsOfInterest}
        />
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Carregando mapa...
        </div>
      )}
    </Modal>
  );
});

MapModal.displayName = 'MapModal';

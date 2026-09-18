import { FC, useEffect, useRef, memo } from 'react';
import L from 'leaflet';
import type { MapPointOfInterest } from '../../../../types/map';
import styles from './LeafletMap.module.css';

// Configuração confiável de ícones do Leaflet para compatibilidade com Vite
const defaultIcon = L.icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface LeafletMapProps {
  readonly lat: number;
  readonly lon: number;
  readonly label: string;
  readonly pointsOfInterest?: ReadonlyArray<MapPointOfInterest>;
}

export const LeafletMap: FC<LeafletMapProps> = memo(({
  lat,
  lon,
  label,
  pointsOfInterest = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Destrói instância anterior se houver
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Inicializa o mapa com as coordenadas
    const map = L.map(containerRef.current).setView([lat, lon], 13);
    mapInstanceRef.current = map;

    // Adiciona camada do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Adiciona marcador principal
    L.marker([lat, lon], { icon: defaultIcon })
      .addTo(map)
      .bindPopup(`<strong>${label}</strong>`)
      .openPopup();

    // Adiciona pontos de interesse turísticos e gastronômicos
    if (pointsOfInterest.length > 0) {
      pointsOfInterest.forEach((poi) => {
        L.marker([poi.lat, poi.lon], { icon: defaultIcon })
          .addTo(map)
          .bindPopup(`<strong>${poi.name}</strong><br><small>${poi.type}</small>`);
      });
    }

    // Invalida tamanho após transição do modal para renderizar azulejos sem cortes
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lon, label, pointsOfInterest]);

  return <div ref={containerRef} className={styles.mapContainer} />;
});

LeafletMap.displayName = 'LeafletMap';

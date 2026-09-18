import { useState, useCallback } from 'react';
import type { MapCoordinates, MapPointOfInterest } from '../../../types/map';

export function useGeolocation() {
  const [coords, setCoords] = useState<MapCoordinates | null>(null);
  const [poiList, setPoiList] = useState<ReadonlyArray<MapPointOfInterest>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const requestUserLocation = useCallback((): void => {
    if (!navigator.geolocation) {
      setStatus('error');
      setMessage('Seu navegador não suporta geolocalização.');
      return;
    }

    setIsLoading(true);
    setStatus('loading');
    setMessage('Solicitando permissão de geolocalização do navegador...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setCoords({ lat, lon, label: 'Você está aqui!' });
        setMessage('Buscando atrações turísticas e restaurantes próximos...');

        try {
          // Consulta endpoint seguro /api/poi sem bloqueios de CORS
          const res = await fetch(`/api/poi?lat=${lat}&lon=${lon}`);

          if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.elements)) {
              const pois: MapPointOfInterest[] = [];
              data.elements.forEach((el: { id: number; lat: number; lon: number; tags?: Record<string, string> }) => {
                if (el.lat && el.lon) {
                  const name =
                    el.tags?.name || el.tags?.tourism || el.tags?.amenity || 'Local de Interesse';
                  const type = el.tags?.tourism ? `Atração: ${el.tags.tourism}` : 'Restaurante';
                  pois.push({
                    id: String(el.id),
                    name,
                    type,
                    lat: el.lat,
                    lon: el.lon,
                  });
                }
              });

              setPoiList(pois);
              setStatus('success');
              setMessage(
                pois.length > 0
                  ? `Encontramos ${pois.length} atrações e restaurantes em um raio de 1.5km!`
                  : 'Sua localização foi encontrada com sucesso.'
              );
            } else {
              setStatus('success');
              setMessage('Localização encontrada com sucesso.');
            }
          } else {
            setStatus('success');
            setMessage('Localização encontrada (não foi possível obter pontos de interesse).');
          }
        } catch {
          setStatus('success');
          setMessage('Localização encontrada.');
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
        setStatus('error');
        console.error('Erro ao obter geolocalização:', err);
        setMessage('Permissão de geolocalização negada ou sinal indisponível.');
      }
    );
  }, []);

  return {
    coords,
    poiList,
    isLoading,
    message,
    status,
    requestUserLocation,
    setCustomLocation: (c: MapCoordinates) => {
      setCoords(c);
      setPoiList([]);
      setStatus('success');
      setMessage(`Exibindo localização de ${c.label}`);
    },
  };
}

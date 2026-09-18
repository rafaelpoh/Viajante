export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido. Utilize GET.' });
  }

  const { lat, lon } = req.query;
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: 'Parâmetros lat e lon são obrigatórios e devem ser numéricos.' });
  }

  const query = `[out:json][timeout:10];(node["tourism"](around:1500,${latitude},${longitude});node["amenity"="restaurant"](around:1500,${latitude},${longitude}););out 30;`;
  const mirrors = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter',
  ];

  for (const baseUrl of mirrors) {
    try {
      const url = `${baseUrl}?data=${encodeURIComponent(query)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'ViajanteApp/2.0 (Travel Planner)',
        },
      });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json(data);
      }
    } catch (err) {
      console.warn(`Tentativa em ${baseUrl} falhou:`, err.message);
    }
  }

  // Se todos os espelhos falharem ou derem timeout, retorna vazio com sucesso para não quebrar o cliente
  return res.status(200).json({ elements: [] });
}

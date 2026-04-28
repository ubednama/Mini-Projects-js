// Vercel serverless function: proxies OpenWeatherMap so the API key stays server-side.
// Set OPENWEATHER_API_KEY in Vercel project env vars (and locally via `vercel env pull`).

export default async function handler(req, res) {
  const city = (req.query.city || '').trim();
  const lat = (req.query.lat || '').trim();
  const lon = (req.query.lon || '').trim();

  if (!city && !(lat && lon)) {
    return res.status(400).json({ error: 'city or lat+lon query parameter is required' });
  }

  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'weather service not configured' });
  }

  const params = new URLSearchParams({ appid: key, units: 'metric' });
  if (city) {
    params.set('q', city);
  } else {
    if (Number.isNaN(parseFloat(lat)) || Number.isNaN(parseFloat(lon))) {
      return res.status(400).json({ error: 'lat and lon must be numbers' });
    }
    params.set('lat', lat);
    params.set('lon', lon);
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?${params.toString()}`;

  try {
    const upstream = await fetch(url);
    const data = await upstream.json();

    if (!upstream.ok) {
      return res
        .status(upstream.status)
        .json({ error: data.message || 'upstream error' });
    }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'failed to reach weather service' });
  }
}

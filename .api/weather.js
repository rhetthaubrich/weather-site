export default async function handler(req, res) {
  const { loc, date } = req.query;

  if (!loc || !date) {
    return res.status(400).json({ error: "Missing loc or date" });
  }

  // 1. Convert location → coordinates using Open-Meteo geocoding
  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      loc
    )}&count=1`
  );
  const geo = await geoResponse.json();

  if (!geo.results || geo.results.length === 0) {
    return res.status(404).json({ error: "Location not found" });
  }

  const place = geo.results[0];
  const { latitude, longitude } = place;

  // 2. Fetch historical weather for that date
  const weatherResponse = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${date}&end_date=${date}&hourly=temperature_2m,relativehumidity_2m,weathercode`
  );
  const weather = await weatherResponse.json();

  if (!weather.hourly || !weather.hourly.temperature_2m) {
    return res.status(500).json({ error: "No weather data available for that date." });
  }

  const temps = weather.hourly.temperature_2m;
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  res.status(200).json({
    location: place.name,
    date,
    minTemp,
    maxTemp,
    raw: weather
  });
}
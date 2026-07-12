const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

export const getCurrentWeather = async (lat, lng) => {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    current: "temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m",
    timezone: "auto",
  });
  if (process.env.OPEN_METEO_API_KEY) {
    params.set("apikey", process.env.OPEN_METEO_API_KEY);
  }

  const response = await fetch(`${OPEN_METEO_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Open-Meteo request failed with status ${response.status}`);
  }

  const data = await response.json();
  const current = data.current ?? {};

  return {
    temperature: current.temperature_2m ?? 0,
    humidity: current.relative_humidity_2m ?? 0,
    precipitation: current.precipitation ?? 0,
    rainfall: current.rain ?? current.precipitation ?? 0,
    windSpeed: current.wind_speed_10m ?? 0,
    timezone: data.timezone,
    units: data.current_units,
  };
};

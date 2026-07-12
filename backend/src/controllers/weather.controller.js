import { calculateRiskScore } from "../services/aiRisk.service.js";
import { getCurrentWeather } from "../services/weather.service.js";

export const getWeatherRisk = async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ message: "lat and lng are required" });
  }

  const weather = await getCurrentWeather(lat, lng);
  const risk = calculateRiskScore({
    lat,
    lng,
    rainfall: weather.rainfall,
    windSpeed: weather.windSpeed,
  });

  return res.json({ location: { lat, lng }, weather, risk });
};

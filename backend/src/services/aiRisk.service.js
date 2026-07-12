const floodProneZones = [
  { name: "River Basin", lat: 13.0827, lng: 80.2707, radiusKm: 35 },
  { name: "Coastal Delta", lat: 22.5726, lng: 88.3639, radiusKm: 40 },
  { name: "Lowland District", lat: 19.076, lng: 72.8777, radiusKm: 30 },
];

const toRadians = (degrees) => (degrees * Math.PI) / 180;

const distanceKm = (from, to) => {
  const earthRadius = 6371;
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(deltaLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const calculateRiskScore = ({ lat, lng, rainfall, windSpeed }) => {
  const rainfallScore = Math.min(45, Math.max(0, rainfall) * 2.25);
  const windScore = Math.min(35, Math.max(0, windSpeed) * 0.7);
  const floodZone = floodProneZones.find(
    (zone) => distanceKm({ lat, lng }, zone) <= zone.radiusKm,
  );
  const floodZoneScore = floodZone ? 20 : 0;

  return {
    score: Math.round(Math.min(100, rainfallScore + windScore + floodZoneScore)),
    floodProneZone: floodZone?.name ?? null,
    factors: {
      rainfall: Math.round(rainfallScore),
      wind: Math.round(windScore),
      floodZone: floodZoneScore,
    },
  };
};

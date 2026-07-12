import Shelter from "../models/Shelter.js";

const toRadians = (degrees) => (degrees * Math.PI) / 180;

const getDistanceKm = (lat, lng, shelter) => {
  const earthRadius = 6371;
  const deltaLat = toRadians(shelter.location.lat - lat);
  const deltaLng = toRadians(shelter.location.lng - lng);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat)) *
      Math.cos(toRadians(shelter.location.lat)) *
      Math.sin(deltaLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const withSafety = (shelter, distance = null) => {
  const available = Math.max(0, shelter.capacity - shelter.currentOccupancy);
  const occupancyRatio = shelter.capacity
    ? shelter.currentOccupancy / shelter.capacity
    : 1;

  return {
    ...shelter.toObject(),
    availableCapacity: available,
    safetyScore: Math.round(Math.max(0, 100 - occupancyRatio * 70)),
    ...(distance === null ? {} : { distanceKm: Number(distance.toFixed(2)) }),
  };
};

export const listShelters = async (_req, res) => {
  const shelters = await Shelter.find().sort({ name: 1 });
  return res.json({ shelters: shelters.map((shelter) => withSafety(shelter)) });
};

export const listNearbyShelters = async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ message: "lat and lng are required" });
  }

  const shelters = await Shelter.find();
  const ranked = shelters
    .map((shelter) => ({
      shelter,
      distance: getDistanceKm(lat, lng, shelter),
    }))
    .sort((a, b) => a.distance - b.distance)
    .map(({ shelter, distance }) => withSafety(shelter, distance));

  return res.json({ shelters: ranked });
};

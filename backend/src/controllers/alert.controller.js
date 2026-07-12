import Alert from "../models/Alert.js";

export const listAlerts = async (_req, res) => {
  const alerts = await Alert.find({ expiresAt: { $gt: new Date() } }).sort({
    createdAt: -1,
  });
  return res.json({ alerts });
};

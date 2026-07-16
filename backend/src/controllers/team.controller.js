import RescueTeam from "../models/RescueTeam.js";

export const listTeams = async (_req, res) => {
  const teams = await RescueTeam.find().populate("activeRequestId");
  return res.json({ teams });
};

export const listAvailableTeams = async (_req, res) => {
  const teams = await RescueTeam.find({ status: "available" }).sort({ name: 1 });

  console.log("Available teams:", teams);

  return res.json({ teams });
};

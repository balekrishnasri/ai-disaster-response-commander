import "dotenv/config";
import { connectDatabase } from "../config/db.js";
import Alert from "./models/Alert.js";
import RescueTeam from "./models/RescueTeam.js";
import Shelter from "./models/Shelter.js";
import User from "./models/User.js";

const shelters = [
  {
    name: "Central Community Hall",
    location: { lat: 13.0827, lng: 80.2707 },
    capacity: 500,
    currentOccupancy: 140,
    resources: ["water", "food", "medical", "charging"],
  },
  {
    name: "North District School",
    location: { lat: 13.1124, lng: 80.2361 },
    capacity: 300,
    currentOccupancy: 80,
    resources: ["water", "food", "beds"],
  },
  {
    name: "Coastal Relief Center",
    location: { lat: 13.034, lng: 80.244 },
    capacity: 650,
    currentOccupancy: 410,
    resources: ["water", "medical", "generator", "pet shelter"],
  },
];

const teams = [
  {
    name: "Alpha Rescue",
    members: ["Arun", "Maya", "Dev"],
    vehicle: "4x4 Ambulance",
    currentLocation: { lat: 13.091, lng: 80.268 },
  },
  {
    name: "Bravo Marine",
    members: ["Isha", "Kiran", "Noor"],
    vehicle: "Rescue Boat",
    currentLocation: { lat: 13.049, lng: 80.282 },
  },
  {
    name: "Charlie Rapid Response",
    members: ["Ravi", "Sara"],
    vehicle: "Emergency Van",
    currentLocation: { lat: 13.125, lng: 80.24 },
  },
];

const alerts = [
  {
    type: "Flood",
    severity: "critical",
    region: "River Basin",
    message: "Rapid water-level rise reported. Move to higher ground immediately.",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    type: "Severe Weather",
    severity: "high",
    region: "Coastal Zone",
    message: "Heavy rain and strong winds expected through the evening.",
    expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000),
  },
  {
    type: "Road Closure",
    severity: "medium",
    region: "North District",
    message: "Bridge access restricted; use the western relief corridor.",
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
  },
];

const run = async () => {
  await connectDatabase();
  await Promise.all([
    Shelter.deleteMany({}),
    Alert.deleteMany({}),
    RescueTeam.deleteMany({}),
  ]);
  await Promise.all([
    Shelter.insertMany(shelters),
    Alert.insertMany(alerts),
    RescueTeam.insertMany(teams),
    User.findOneAndUpdate(
      { phone: "+15550000001" },
      {
        name: "Demo Responder",
        phone: "+15550000001",
        otpVerified: true,
        role: "responder",
      },
      { upsert: true, new: true },
    ),
  ]);
  console.log("Seed data created");
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

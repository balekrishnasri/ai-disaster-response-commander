import L from "leaflet";
import { useEffect } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

const markerIcon = (emoji, color) =>
  L.divIcon({
    className: "",
    html: `<div style="width:34px;height:34px;border-radius:999px;background:${color};border:2px solid white;display:grid;place-items:center;font-size:17px;box-shadow:0 4px 16px rgba(0,0,0,.45)">${emoji}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });

const userIcon = markerIcon("●", "#06b6d4");
const shelterIcon = markerIcon("⌂", "#22c55e");
const alertIcon = markerIcon("!", "#ef4444");

const MapSync = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
};

export const LiveMap = ({ location, shelters, alerts }) => (
  <div className="h-[390px] overflow-hidden">
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapSync center={location} />
      <Marker position={[location.lat, location.lng]} icon={userIcon}>
        <Popup>Your monitored region</Popup>
      </Marker>
      <Circle
        center={[location.lat, location.lng]}
        radius={2500}
        pathOptions={{ color: "#06b6d4", fillOpacity: 0.06 }}
      />
      {shelters.map((shelter) => (
        <Marker
          key={shelter._id}
          position={[shelter.location.lat, shelter.location.lng]}
          icon={shelterIcon}
        >
          <Popup>
            <strong>{shelter.name}</strong>
            <br />
            {shelter.availableCapacity ?? shelter.capacity} spaces available
          </Popup>
        </Marker>
      ))}
      {alerts.map((alert, index) => (
        <Marker
          key={alert._id}
          position={[
            location.lat + 0.012 * (index + 1),
            location.lng - 0.01 * (index + 1),
          ]}
          icon={alertIcon}
        >
          <Popup>
            <strong>{alert.type}</strong>
            <br />
            {alert.message}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  </div>
);

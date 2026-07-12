import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const teamIcon = L.divIcon({
  className: "",
  html: '<div style="width:36px;height:36px;border-radius:10px;background:#f97316;border:2px solid white;display:grid;place-items:center;font-size:19px;box-shadow:0 4px 14px rgba(0,0,0,.45)">🚑</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

export const MiniMap = ({ location, teamName }) => (
  <div className="h-56 overflow-hidden rounded-xl border border-slate-700">
    <MapContainer
      key={`${location.lat}-${location.lng}`}
      center={[location.lat, location.lng]}
      zoom={14}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[location.lat, location.lng]} icon={teamIcon}>
        <Popup>{teamName || "Assigned rescue team"}</Popup>
      </Marker>
    </MapContainer>
  </div>
);

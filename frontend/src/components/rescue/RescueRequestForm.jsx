import { useEffect, useState } from "react";
import { useGeolocation } from "../../hooks/useGeolocation.js";

const urgencies = [
  { value: "low", label: "Low", color: "border-emerald-500/50" },
  { value: "medium", label: "Medium", color: "border-yellow-500/50" },
  { value: "high", label: "High", color: "border-orange-500/50" },
  { value: "critical", label: "Critical", color: "border-red-500/50" },
];

export const RescueRequestForm = ({ onSubmit, busy, error }) => {
  const { location, setLocation, locate, loading, error: locationError } =
    useGeolocation(true);
  const [description, setDescription] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState("high");
  const [coordinates, setCoordinates] = useState({
    lat: String(location.lat),
    lng: String(location.lng),
  });

  useEffect(() => {
    setCoordinates({ lat: String(location.lat), lng: String(location.lng) });
  }, [location]);

  const submit = (event) => {
    event.preventDefault();
    const manualLocation = {
      lat: Number(coordinates.lat),
      lng: Number(coordinates.lng),
    };
    setLocation(manualLocation);
    onSubmit({ location: manualLocation, description, urgencyLevel });
  };

  return (
    <form onSubmit={submit} className="space-y-6 p-5 sm:p-6">
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="label mb-0">Your location</span>
          <button
            type="button"
            onClick={locate}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
          >
            {loading ? "Locating…" : "Refresh GPS"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            aria-label="Latitude"
            className="input"
            type="number"
            step="any"
            value={coordinates.lat}
            onChange={(event) =>
              setCoordinates((current) => ({
                ...current,
                lat: event.target.value,
              }))
            }
            required
          />
          <input
            aria-label="Longitude"
            className="input"
            type="number"
            step="any"
            value={coordinates.lng}
            onChange={(event) =>
              setCoordinates((current) => ({
                ...current,
                lng: event.target.value,
              }))
            }
            required
          />
        </div>
        {locationError && (
          <p className="mt-2 text-xs text-yellow-300">{locationError}</p>
        )}
      </div>

      <label>
        <span className="label">What is happening?</span>
        <textarea
          className="input min-h-36 resize-y"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe injuries, hazards, number of people, and any access issues…"
          maxLength={1000}
          required
        />
        <span className="mt-1 block text-right text-[10px] text-slate-600">
          {description.length}/1000
        </span>
      </label>

      <fieldset>
        <legend className="label">Urgency level</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {urgencies.map((urgency) => (
            <button
              key={urgency.value}
              type="button"
              onClick={() => setUrgencyLevel(urgency.value)}
              className={`rounded-xl border p-3 text-sm font-black uppercase tracking-wider transition ${urgency.color} ${
                urgencyLevel === urgency.value
                  ? "bg-white/10 text-white ring-2 ring-white/15"
                  : "bg-slate-950/50 text-slate-500"
              }`}
            >
              {urgency.label}
            </button>
          ))}
        </div>
      </fieldset>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}
      <button disabled={busy} className="btn-danger w-full py-4 text-base">
        {busy ? "Broadcasting request…" : "Submit Rescue Request"}
      </button>
    </form>
  );
};

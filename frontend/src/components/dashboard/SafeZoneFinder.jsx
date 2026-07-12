import { useEffect, useState } from "react";

export const SafeZoneFinder = ({
  location,
  onSearch,
  onUseMyLocation,
  locating,
}) => {
  const [coordinates, setCoordinates] = useState({
    lat: String(location.lat),
    lng: String(location.lng),
  });

  useEffect(() => {
    setCoordinates({ lat: String(location.lat), lng: String(location.lng) });
  }, [location]);

  const submit = (event) => {
    event.preventDefault();
    onSearch({ lat: Number(coordinates.lat), lng: Number(coordinates.lng) });
  };

  return (
    <div className="space-y-4 p-5">
      <p className="text-sm leading-6 text-slate-400">
        Rank open shelters by proximity, available capacity, and current risk.
      </p>
      <form onSubmit={submit} className="grid grid-cols-2 gap-3">
        <label>
          <span className="label">Latitude</span>
          <input
            className="input py-2.5"
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
        </label>
        <label>
          <span className="label">Longitude</span>
          <input
            className="input py-2.5"
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
        </label>
        <button type="submit" className="btn-primary col-span-2 py-2.5">
          Find Safe Zones
        </button>
      </form>
      <button
        type="button"
        onClick={onUseMyLocation}
        className="w-full rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-bold text-slate-300 hover:border-cyan-400/50"
      >
        {locating ? "Locating…" : "Use my current location"}
      </button>
    </div>
  );
};

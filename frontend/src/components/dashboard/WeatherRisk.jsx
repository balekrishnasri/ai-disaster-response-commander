import { useEffect, useState } from "react";
import { api } from "../../services/api.js";

const riskColor = (score) => {
  if (score >= 75) return "text-red-400";
  if (score >= 50) return "text-orange-400";
  if (score >= 25) return "text-yellow-300";
  return "text-emerald-400";
};

export const WeatherRisk = ({ location, onRiskChange }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setError("");
    api(`/weather/risk?lat=${location.lat}&lng=${location.lng}`)
      .then((response) => {
        if (!active) return;
        setData(response);
        onRiskChange(response.risk.score);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });
    return () => {
      active = false;
    };
  }, [location, onRiskChange]);

  if (error) {
    return <p className="p-5 text-sm text-red-300">{error}</p>;
  }
  if (!data) {
    return <p className="p-5 text-sm text-slate-500">Analyzing local risk…</p>;
  }

  return (
    <div className="p-5">
      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <div>
          <p className="text-3xl font-black text-white">
            {Math.round(data.weather.temperature)}°
          </p>
          <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
            Wind {Math.round(data.weather.windSpeed)} km/h · Rain{" "}
            {data.weather.rainfall} mm
          </p>
        </div>
        <div className="text-right">
          <p className={`text-4xl font-black ${riskColor(data.risk.score)}`}>
            {data.risk.score}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            AI Risk / 100
          </p>
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500"
          style={{ width: `${data.risk.score}%` }}
        />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {Object.entries(data.risk.factors).map(([name, value]) => (
          <div key={name} className="rounded-lg bg-slate-950/60 p-2">
            <p className="font-black text-slate-200">{value}</p>
            <p className="text-[9px] uppercase tracking-wider text-slate-500">
              {name}
            </p>
          </div>
        ))}
      </div>
      {data.risk.floodProneZone && (
        <p className="mt-4 rounded-lg border border-orange-500/30 bg-orange-500/10 p-3 text-xs text-orange-200">
          Flood-prone zone detected: {data.risk.floodProneZone}
        </p>
      )}
    </div>
  );
};

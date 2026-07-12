import { useCallback, useEffect, useState } from "react";
import { AlertsPanel } from "../components/dashboard/AlertsPanel.jsx";
import { EmergencyBanner } from "../components/dashboard/EmergencyBanner.jsx";
import { NearbyShelters } from "../components/dashboard/NearbyShelters.jsx";
import { SafeZoneFinder } from "../components/dashboard/SafeZoneFinder.jsx";
import { WeatherRisk } from "../components/dashboard/WeatherRisk.jsx";
import { AppHeader } from "../components/common/AppHeader.jsx";
import { Panel } from "../components/common/Panel.jsx";
import { LiveMap } from "../components/map/LiveMap.jsx";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { api } from "../services/api.js";

export default function DashboardPage() {
  const { location, setLocation, locate, loading: locating, error: locationError } =
    useGeolocation(true);
  const [shelters, setShelters] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [riskScore, setRiskScore] = useState(0);
  const [sheltersLoading, setSheltersLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadShelters = useCallback(async (target) => {
    setSheltersLoading(true);
    setError("");
    try {
      const data = await api(
        `/shelters/nearby?lat=${target.lat}&lng=${target.lng}`,
      );
      setShelters(data.shelters);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSheltersLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShelters(location);
  }, [loadShelters, location]);

  useEffect(() => {
    api("/alerts")
      .then((data) => setAlerts(data.alerts))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setAlertsLoading(false));
  }, []);

  const searchLocation = (target) => {
    if (!Number.isFinite(target.lat) || !Number.isFinite(target.lng)) {
      setError("Enter valid latitude and longitude values.");
      return;
    }
    setLocation(target);
  };

  return (
    <div className="min-h-screen bg-command-950">
      <AppHeader compact />
      <main className="mx-auto max-w-7xl px-4 py-5 pb-8 sm:px-6">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">
              Public Operations View
            </p>
            <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
              Regional Safety Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Region: {location.lat.toFixed(3)}, {location.lng.toFixed(3)}
          </p>
        </div>
        {(error || locationError) && (
          <p className="mb-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-200">
            {error || locationError}
          </p>
        )}

        <div className="grid gap-5 lg:grid-cols-12">
          <Panel
            title="Live Map"
            eyebrow="Geospatial intelligence"
            className="lg:col-span-8"
            action={
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase text-emerald-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Live
              </span>
            }
          >
            <LiveMap location={location} shelters={shelters} alerts={alerts} />
          </Panel>

          <div className="grid gap-5 lg:col-span-4">
            <Panel title="Safe Zone Finder" eyebrow="Evacuation support">
              <SafeZoneFinder
                location={location}
                onSearch={searchLocation}
                onUseMyLocation={locate}
                locating={locating}
              />
            </Panel>
            <Panel title="Weather & AI Risk" eyebrow="Open-Meteo analysis">
              <WeatherRisk
                location={location}
                onRiskChange={setRiskScore}
              />
            </Panel>
          </div>

          <Panel
            title="Active Alerts"
            eyebrow={`${alerts.length} regional notices`}
            className="lg:col-span-5"
          >
            <AlertsPanel alerts={alerts} loading={alertsLoading} />
          </Panel>
          <Panel
            title="Nearby Shelters"
            eyebrow="Distance + safety ranked"
            className="lg:col-span-7"
          >
            <NearbyShelters
              shelters={shelters}
              riskScore={riskScore}
              loading={sheltersLoading}
            />
          </Panel>
        </div>
      </main>
      <EmergencyBanner />
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "../components/common/AppHeader.jsx";
import { Panel } from "../components/common/Panel.jsx";
import { AssignTeamPanel } from "../components/rescue/AssignTeamPanel.jsx";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { api, patchJson } from "../services/api.js";
import { getSocket } from "../services/socket.js";

const urgencyWeight = { critical: 4, high: 3, medium: 2, low: 1 };
const urgencyStyle = {
  critical: "bg-red-500/15 text-red-300 border-red-500/30",
  high: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  medium: "bg-yellow-500/15 text-yellow-200 border-yellow-500/30",
  low: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

const toRadians = (degrees) => (degrees * Math.PI) / 180;
const distanceKm = (from, to) => {
  const earthRadius = 6371;
  const lat = toRadians(to.lat - from.lat);
  const lng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(lat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(lng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function TeamDashboardPage() {
  const { location } = useGeolocation(true);
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState("urgency");
  const [error, setError] = useState("");

  useEffect(() => {
    api("/rescue")
      .then((data) => setRequests(data.requests))
      .catch((requestError) => setError(requestError.message));
  }, []);

  useEffect(() => {
    const socket = getSocket();
    const addRequest = (incoming) => {
      setRequests((current) => [
        incoming,
        ...current.filter((item) => item._id !== incoming._id),
      ]);
    };
    const updateRequest = (updated) => {
      setRequests((current) =>
        current.map((item) => (item._id === updated._id ? updated : item)),
      );
      setSelected((current) =>
        current?._id === updated._id ? updated : current,
      );
    };
    socket.on("new_rescue_request", addRequest);
    socket.on("status_update", updateRequest);
    return () => {
      socket.off("new_rescue_request", addRequest);
      socket.off("status_update", updateRequest);
    };
  }, []);

  const sortedRequests = useMemo(() => {
    const enriched = requests.map((request) => ({
      ...request,
      distanceKm: distanceKm(location, request.location),
    }));
    return enriched.sort((a, b) =>
      sortBy === "urgency"
        ? urgencyWeight[b.urgencyLevel] - urgencyWeight[a.urgencyLevel] ||
          a.distanceKm - b.distanceKm
        : a.distanceKm - b.distanceKm ||
          urgencyWeight[b.urgencyLevel] - urgencyWeight[a.urgencyLevel],
    );
  }, [location, requests, sortBy]);

  const replaceRequest = (updated) => {
    setRequests((current) =>
      current.map((item) => (item._id === updated._id ? updated : item)),
    );
    setSelected(updated);
  };

  const updateStatus = async (request, status) => {
    try {
      const data = await patchJson(`/rescue/${request._id}/status`, { status });
      replaceRequest(data.request);
      if (status === "in_progress" && data.request.assignedTeamId?._id) {
        getSocket().emit("team_location_update", {
          teamId: data.request.assignedTeamId._id,
          location,
        });
      }
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const pendingCount = requests.filter((item) => item.status === "pending").length;
  const activeCount = requests.filter((item) =>
    ["assigned", "in_progress"].includes(item.status),
  ).length;

  return (
    <div className="min-h-screen bg-command-950">
      <AppHeader compact />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-400">
              Responder Operations
            </p>
            <h1 className="mt-1 text-3xl font-black text-white">
              Rescue Team Dashboard
            </h1>
          </div>
          <div className="flex gap-3">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2">
              <p className="text-xl font-black text-red-300">{pendingCount}</p>
              <p className="text-[9px] uppercase tracking-wider text-red-300/60">
                Pending
              </p>
            </div>
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2">
              <p className="text-xl font-black text-cyan-300">{activeCount}</p>
              <p className="text-[9px] uppercase tracking-wider text-cyan-300/60">
                Active
              </p>
            </div>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className={`grid gap-5 ${selected ? "lg:grid-cols-[1fr_390px]" : ""}`}>
          <Panel
            title="Incoming Rescue Requests"
            eyebrow="Realtime dispatch queue"
            action={
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300"
              >
                <option value="urgency">Sort: Urgency</option>
                <option value="distance">Sort: Distance</option>
              </select>
            }
          >
            <div className="command-scrollbar max-h-[670px] overflow-y-auto">
              {sortedRequests.length === 0 && (
                <p className="p-8 text-center text-sm text-slate-500">
                  No rescue requests in the queue.
                </p>
              )}
              {sortedRequests.map((request) => (
                <article
                  key={request._id}
                  className={`border-b border-slate-800 p-4 transition last:border-0 ${
                    selected?._id === request._id ? "bg-cyan-400/5" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelected(request)}
                    className="w-full text-left"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${urgencyStyle[request.urgencyLevel]}`}
                        >
                          {request.urgencyLevel}
                        </span>
                        <span className="text-xs font-bold uppercase text-slate-500">
                          {request.status.replace("_", " ")}
                        </span>
                      </div>
                      <span className="text-xs font-black text-cyan-300">
                        {request.distanceKm.toFixed(1)} km
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-200">
                      {request.description}
                    </p>
                    <p className="mt-2 text-xs text-slate-600">
                      {request.userId?.name || "Citizen"} ·{" "}
                      {new Date(request.createdAt).toLocaleTimeString()}
                    </p>
                  </button>
                  {request.status !== "pending" && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {request.status === "assigned" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(request, "in_progress")}
                          className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-black text-white"
                        >
                          Start Rescue
                        </button>
                      )}
                      {request.status === "in_progress" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(request, "completed")}
                          className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-black text-white"
                        >
                          Mark Completed
                        </button>
                      )}
                      {request.assignedTeamId && (
                        <span className="self-center text-xs text-slate-500">
                          Team: {request.assignedTeamId.name}
                        </span>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </Panel>

          {selected &&
            (selected.status === "pending" ? (
              <AssignTeamPanel
                request={selected}
                onAssigned={replaceRequest}
                onClose={() => setSelected(null)}
              />
            ) : (
              <aside className="h-fit rounded-2xl border border-slate-800 bg-command-900 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                      Active mission
                    </p>
                    <h2 className="mt-1 text-xl font-black text-white">
                      {selected.assignedTeamId?.name || "Assigned response"}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="text-xs text-slate-500"
                  >
                    Close
                  </button>
                </div>
                <p className="mt-5 rounded-xl bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">
                  {selected.description}
                </p>
                <p className="mt-4 text-sm font-bold uppercase text-orange-300">
                  Status: {selected.status.replace("_", " ")}
                </p>
              </aside>
            ))}
        </div>
      </main>
    </div>
  );
}

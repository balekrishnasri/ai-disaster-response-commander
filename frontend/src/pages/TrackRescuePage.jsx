import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppHeader } from "../components/common/AppHeader.jsx";
import { LoadingScreen } from "../components/common/LoadingScreen.jsx";
import { Panel } from "../components/common/Panel.jsx";
import { MiniMap } from "../components/map/MiniMap.jsx";
import { StatusTimeline } from "../components/rescue/StatusTimeline.jsx";
import { api } from "../services/api.js";
import { getSocket } from "../services/socket.js";

export default function TrackRescuePage() {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [teamLocation, setTeamLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/rescue/${requestId}`)
      .then((data) => {
        setRequest(data.request);
        if (data.request.assignedTeamId?.currentLocation) {
          setTeamLocation(data.request.assignedTeamId.currentLocation);
        }
      })
      .catch((requestError) => setError(requestError.message));
  }, [requestId]);

  useEffect(() => {
    const socket = getSocket();
    const updateRequest = (updated) => {
      if (updated._id !== requestId) return;
      setRequest(updated);
      if (updated.assignedTeamId?.currentLocation) {
        setTeamLocation(updated.assignedTeamId.currentLocation);
      }
    };
    const updateLocation = (update) => {
      if (update.requestId === requestId) setTeamLocation(update.location);
    };

    socket.on("request_assigned", updateRequest);
    socket.on("status_update", updateRequest);
    socket.on("team_location_update", updateLocation);
    return () => {
      socket.off("request_assigned", updateRequest);
      socket.off("status_update", updateRequest);
      socket.off("team_location_update", updateLocation);
    };
  }, [requestId]);

  if (error) {
    return (
      <div className="min-h-screen bg-command-950">
        <AppHeader />
        <p className="mx-auto mt-16 max-w-lg text-center text-red-300">{error}</p>
      </div>
    );
  }
  if (!request) return <LoadingScreen />;

  if (request.status === "completed") {
    return (
      <div className="min-h-screen bg-command-950">
        <AppHeader />
        <main className="mx-auto max-w-2xl px-5 py-16 text-center">
          <span className="mx-auto grid h-24 w-24 place-items-center rounded-full border-4 border-emerald-400 bg-emerald-400/10 text-5xl text-emerald-300">
            ✓
          </span>
          <p className="mt-8 text-xs font-black uppercase tracking-[0.25em] text-emerald-400">
            Mission complete
          </p>
          <h1 className="mt-2 text-4xl font-black text-white">
            Rescue Completed
          </h1>
          <p className="mt-4 text-slate-400">
            {request.assignedTeamId?.name || "Your rescue team"} completed the
            response for your request.
          </p>
          <div className="mt-8 rounded-2xl border border-slate-800 bg-command-900 p-5 text-left">
            <p className="label">Request summary</p>
            <p className="leading-6 text-slate-300">{request.description}</p>
            <p className="mt-4 text-xs text-slate-500">
              Request ID: {request._id}
            </p>
          </div>
          <Link to="/dashboard" className="btn-primary mt-8">
            Return to Safety Dashboard
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-command-950">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-400">
              Live Rescue Tracker
            </p>
            <h1 className="mt-1 text-3xl font-black text-white">
              Help is being coordinated
            </h1>
          </div>
          <span className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Realtime connected
          </span>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Panel title="Current Status" eyebrow={`Request ${request._id.slice(-6)}`}>
            <div className="p-6">
              <StatusTimeline status={request.status} />
            </div>
          </Panel>
          <Panel title="Response Details" eyebrow="Assigned unit">
            <div className="space-y-4 p-5">
              {request.assignedTeamId ? (
                <>
                  <div>
                    <p className="text-xl font-black text-white">
                      {request.assignedTeamId.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {request.assignedTeamId.vehicle} ·{" "}
                      {request.assignedTeamId.members?.join(", ")}
                    </p>
                  </div>
                  {teamLocation && (
                    <MiniMap
                      location={teamLocation}
                      teamName={request.assignedTeamId.name}
                    />
                  )}
                </>
              ) : (
                <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
                  <p className="font-bold text-yellow-200">
                    Awaiting team assignment
                  </p>
                  <p className="mt-1 text-sm text-yellow-100/60">
                    Your request is visible to all connected responders.
                  </p>
                </div>
              )}
              <div className="rounded-xl bg-slate-950/60 p-4">
                <p className="label">Situation</p>
                <p className="text-sm leading-6 text-slate-300">
                  {request.description}
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </main>
    </div>
  );
}

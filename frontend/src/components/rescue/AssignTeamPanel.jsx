import { useEffect, useState } from "react";
import { api, patchJson } from "../../services/api.js";

export const AssignTeamPanel = ({ request, onAssigned, onClose }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/teams/available")
      .then((data) => {
        setTeams(data.teams);
        setSelectedTeam(data.teams[0]?._id || "");
      })
      .catch((requestError) => setError(requestError.message));
  }, [request._id]);

  const assign = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await patchJson(`/rescue/${request._id}/assign`, {
        teamId: selectedTeam,
      });
      onAssigned(data.request);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <aside className="rounded-2xl border border-orange-500/30 bg-command-900 p-5 shadow-2xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
            Assignment Console
          </p>
          <h2 className="mt-1 text-xl font-black text-white">
            Assign Rescue Team
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400"
        >
          Close
        </button>
      </div>

      <div className="mb-5 rounded-xl bg-slate-950/60 p-4">
        <p className="text-xs font-bold uppercase text-red-300">
          {request.urgencyLevel} urgency
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {request.description}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          {request.location.lat.toFixed(5)}, {request.location.lng.toFixed(5)}
        </p>
      </div>

      <form onSubmit={assign} className="space-y-4">
        <label>
          <span className="label">Available team</span>
          <select
            className="input"
            value={selectedTeam}
            onChange={(event) => setSelectedTeam(event.target.value)}
            required
          >
            {teams.length === 0 && <option value="">No teams available</option>}
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name} · {team.vehicle} · {team.members.length} members
              </option>
            ))}
          </select>
        </label>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button
          disabled={busy || !selectedTeam}
          className="btn-primary w-full"
        >
          {busy ? "Assigning…" : "Confirm Assignment"}
        </button>
      </form>
    </aside>
  );
};

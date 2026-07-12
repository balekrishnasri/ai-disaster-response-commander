import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/common/AppHeader.jsx";
import { Panel } from "../components/common/Panel.jsx";
import { RescueRequestForm } from "../components/rescue/RescueRequestForm.jsx";
import { postJson } from "../services/api.js";

export default function RescuePortalPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (payload) => {
    setBusy(true);
    setError("");
    try {
      const data = await postJson("/rescue", payload);
      navigate(`/track/${data.request._id}`, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-command-950">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-red-400">
            Citizen Rescue Portal
          </p>
          <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
            Request immediate assistance
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Your verified identity, precise location, and situation details will
            be broadcast to connected emergency responders.
          </p>
        </div>
        <Panel
          title="Submit Rescue Request"
          eyebrow="Live emergency dispatch"
        >
          <RescueRequestForm onSubmit={submit} busy={busy} error={error} />
        </Panel>
        <p className="mt-4 text-center text-xs text-slate-600">
          If your location is unsafe, move only when local authorities advise it.
        </p>
      </main>
    </div>
  );
}

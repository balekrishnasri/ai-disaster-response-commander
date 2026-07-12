const severityStyles = {
  critical: "border-red-500/50 bg-red-500/10 text-red-300",
  high: "border-orange-500/50 bg-orange-500/10 text-orange-300",
  medium: "border-yellow-500/50 bg-yellow-500/10 text-yellow-200",
  low: "border-cyan-500/50 bg-cyan-500/10 text-cyan-200",
};

export const AlertsPanel = ({ alerts, loading }) => (
  <div className="command-scrollbar max-h-[330px] space-y-3 overflow-y-auto p-4">
    {loading && <p className="p-3 text-sm text-slate-500">Loading alerts…</p>}
    {!loading && alerts.length === 0 && (
      <p className="p-3 text-sm text-emerald-300">No active alerts.</p>
    )}
    {alerts.map((alert) => (
      <article
        key={alert._id}
        className={`rounded-xl border p-4 ${severityStyles[alert.severity]}`}
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="font-black uppercase tracking-wide">{alert.type}</p>
          <span className="rounded-full border border-current/30 px-2 py-0.5 text-[10px] font-black uppercase">
            {alert.severity}
          </span>
        </div>
        <p className="text-xs font-bold uppercase tracking-wider opacity-70">
          {alert.region}
        </p>
        <p className="mt-2 text-sm leading-5 text-slate-200">{alert.message}</p>
      </article>
    ))}
  </div>
);

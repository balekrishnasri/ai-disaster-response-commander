export const NearbyShelters = ({ shelters, riskScore, loading }) => (
  <div className="command-scrollbar max-h-[390px] overflow-y-auto">
    {loading && <p className="p-5 text-sm text-slate-500">Ranking shelters…</p>}
    {!loading && shelters.length === 0 && (
      <p className="p-5 text-sm text-slate-500">No shelters found.</p>
    )}
    {shelters.map((shelter, index) => {
      const adjustedSafety = Math.max(
        0,
        Math.round(shelter.safetyScore - riskScore * 0.2),
      );
      return (
        <article
          key={shelter._id}
          className="flex gap-4 border-b border-slate-800 p-4 last:border-0"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-400/10 font-black text-emerald-400">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-white">{shelter.name}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {shelter.distanceKm ?? "—"} km · {shelter.availableCapacity}{" "}
                  spaces
                </p>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-black text-emerald-300">
                {adjustedSafety}% safe
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {shelter.resources.map((resource) => (
                <span
                  key={resource}
                  className="rounded-md bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400"
                >
                  {resource}
                </span>
              ))}
            </div>
          </div>
        </article>
      );
    })}
  </div>
);

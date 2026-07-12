const steps = ["pending", "assigned", "in_progress", "completed"];
const labels = {
  pending: "Request received",
  assigned: "Team assigned",
  in_progress: "Rescue in progress",
  completed: "Rescue completed",
};

export const StatusTimeline = ({ status }) => {
  const activeIndex = steps.indexOf(status);

  return (
    <ol className="space-y-0">
      {steps.map((step, index) => {
        const reached = index <= activeIndex;
        const current = index === activeIndex;
        return (
          <li key={step} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`grid h-9 w-9 place-items-center rounded-full border-2 text-sm font-black ${
                  reached
                    ? "border-cyan-300 bg-cyan-400 text-slate-950"
                    : "border-slate-700 bg-slate-900 text-slate-600"
                }`}
              >
                {reached ? "✓" : index + 1}
              </span>
              {index < steps.length - 1 && (
                <span
                  className={`h-12 w-0.5 ${
                    index < activeIndex ? "bg-cyan-400" : "bg-slate-800"
                  }`}
                />
              )}
            </div>
            <div className="pt-1">
              <p
                className={`font-bold ${
                  current ? "text-cyan-300" : reached ? "text-white" : "text-slate-600"
                }`}
              >
                {labels[step]}
              </p>
              {current && (
                <p className="mt-1 text-xs text-slate-400">
                  Live updates are enabled for this request.
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

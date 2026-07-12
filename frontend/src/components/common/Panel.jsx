export const Panel = ({ title, eyebrow, action, children, className = "" }) => (
  <section
    className={`overflow-hidden rounded-2xl border border-slate-800 bg-command-900/85 shadow-glow backdrop-blur ${className}`}
  >
    {(title || eyebrow || action) && (
      <header className="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4">
        <div>
          {eyebrow && (
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">
              {eyebrow}
            </p>
          )}
          {title && <h2 className="font-bold text-white">{title}</h2>}
        </div>
        {action}
      </header>
    )}
    {children}
  </section>
);

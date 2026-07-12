import { Link } from "react-router-dom";

const capabilities = [
  ["Live intelligence", "Weather, alerts, AI risk, and shelter capacity in one view."],
  ["Rapid dispatch", "Authenticated rescue requests reach response teams instantly."],
  ["Continuous tracking", "Citizens follow assignment, team progress, and completion live."],
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-command-950">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(34,211,238,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.08)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute left-1/2 top-[-20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-2xl">
              ◉
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.17em] text-white">
                Disaster Commander
              </p>
              <p className="text-[9px] uppercase tracking-[0.24em] text-cyan-400">
                AI Response Network
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Systems online
          </div>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <p className="mb-6 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-red-300">
            Real-time emergency intelligence
          </p>
          <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
            Coordinate faster.
            <span className="block bg-gradient-to-r from-cyan-300 via-cyan-400 to-emerald-300 bg-clip-text text-transparent">
              Rescue smarter.
            </span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            One command center for public safety monitoring, AI-assisted risk
            analysis, shelter discovery, and live rescue coordination.
          </p>
          <div className="mt-10 grid w-full max-w-xl gap-4 sm:grid-cols-2">
            <Link
              to="/dashboard"
              className="rounded-2xl bg-cyan-400 px-6 py-5 text-lg font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              🚀 Start Monitoring
            </Link>
            <Link
              to="/login"
              className="rounded-2xl border border-red-400/50 bg-red-500/10 px-6 py-5 text-lg font-black text-red-200 transition hover:-translate-y-0.5 hover:bg-red-500/20"
            >
              🆘 Emergency Login
            </Link>
          </div>
        </section>

        <section className="grid gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 md:grid-cols-3">
          {capabilities.map(([title, body], index) => (
            <article key={title} className="bg-command-900/90 p-5 text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
                0{index + 1}
              </p>
              <h2 className="mt-2 font-black text-white">{title}</h2>
              <p className="mt-2 text-sm leading-5 text-slate-500">{body}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

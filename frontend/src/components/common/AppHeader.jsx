import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export const AppHeader = ({ compact = false }) => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-800 bg-command-950/90 backdrop-blur">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 ${compact ? "py-3" : "py-4"} sm:px-6`}
      >
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-xl">
            ◉
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-black uppercase tracking-[0.13em] text-white sm:text-base">
              Disaster Commander
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">
              Live Operations Network
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 sm:block">
                {user.name} · {user.role}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 hover:border-slate-500"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300"
            >
              Emergency Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export const LoadingScreen = () => (
  <div className="grid min-h-screen place-items-center bg-command-950">
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
      <p className="mt-4 text-sm text-slate-400">Connecting to command network…</p>
    </div>
  </div>
);

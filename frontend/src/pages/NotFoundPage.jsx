import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-command-950 px-5 text-center">
      <div>
        <p className="text-7xl font-black text-cyan-400">404</p>
        <h1 className="mt-3 text-3xl font-black text-white">Signal not found</h1>
        <p className="mt-3 text-slate-500">
          This command route does not exist.
        </p>
        <Link to="/" className="btn-primary mt-7">
          Return to command center
        </Link>
      </div>
    </main>
  );
}

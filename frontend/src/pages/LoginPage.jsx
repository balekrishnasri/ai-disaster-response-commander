import { Link, useLocation, useNavigate } from "react-router-dom";
import { OtpLoginForm } from "../components/auth/OtpLoginForm.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const authenticated = (user) => {
    if (location.state?.from && user.role === "citizen") {
      navigate(location.state.from, { replace: true });
      return;
    }
    navigate(
      user.role === "responder" || user.role === "admin"
        ? "/team/dashboard"
        : "/rescue-portal",
      { replace: true },
    );
  };

  return (
    <main className="grid min-h-screen bg-command-950 lg:grid-cols-2">
      <section className="hidden border-r border-slate-800 bg-[radial-gradient(circle_at_center,rgba(239,68,68,.16),transparent_58%)] p-12 lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="text-sm font-black uppercase tracking-[0.18em] text-white">
          ◉ Disaster Commander
        </Link>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-400">
            Secure emergency channel
          </p>
          <h1 className="mt-4 max-w-xl text-6xl font-black leading-none text-white">
            Help is one verified signal away.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
            Authenticate with your phone to request rescue assistance or enter
            the responder dispatch console.
          </p>
        </div>
        <p className="text-xs text-slate-600">
          Development mode accepts any six-digit OTP.
        </p>
      </section>
      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-block text-sm font-bold text-slate-500 hover:text-white lg:hidden"
          >
            ← Back to welcome
          </Link>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-red-400">
            Emergency access
          </p>
          <h1 className="mt-2 text-3xl font-black text-white">Phone verification</h1>
          <p className="mb-6 mt-2 text-sm leading-6 text-slate-500">
            Enter your phone number, then use the server-logged OTP.
          </p>
          <OtpLoginForm onAuthenticated={authenticated} />
          <Link
            to="/dashboard"
            className="mt-6 block text-center text-sm font-bold text-cyan-400 hover:text-cyan-300"
          >
            Continue to public dashboard without login
          </Link>
        </div>
      </section>
    </main>
  );
}

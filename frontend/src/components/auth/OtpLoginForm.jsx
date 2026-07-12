import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export const OtpLoginForm = ({ onAuthenticated }) => {
  const { sendOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState("citizen");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const requestCode = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await sendOtp(phone);
      setMessage(result.devHint || result.message);
      setStep("otp");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const authenticate = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const user = await verifyOtp({ phone, code, role, name });
      onAuthenticated(user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-command-900/90 p-6 shadow-2xl shadow-black/30 sm:p-8">
      <div className="mb-6 flex rounded-xl bg-slate-950/70 p-1">
        {["citizen", "responder"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setRole(option)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wider transition ${
              role === option
                ? "bg-cyan-400 text-slate-950"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {step === "phone" ? (
        <form onSubmit={requestCode} className="space-y-4">
          <label>
            <span className="label">Name</span>
            <input
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={role === "responder" ? "Responder name" : "Your name"}
            />
          </label>
          <label>
            <span className="label">Phone number</span>
            <input
              className="input"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+1 555 000 0000"
              autoComplete="tel"
              required
            />
          </label>
          <button disabled={busy} className="btn-primary w-full">
            {busy ? "Generating secure code…" : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={authenticate} className="space-y-4">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 text-sm text-cyan-200">
            {message} The generated code is also logged by the API server.
          </div>
          <label>
            <span className="label">6-digit OTP</span>
            <input
              className="input text-center text-2xl font-black tracking-[0.45em]"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, ""))
              }
              placeholder="000000"
              autoComplete="one-time-code"
              required
              autoFocus
            />
          </label>
          <button disabled={busy || code.length !== 6} className="btn-primary w-full">
            {busy ? "Verifying…" : "Verify & Enter"}
          </button>
          <button
            type="button"
            onClick={() => setStep("phone")}
            className="w-full text-sm font-bold text-slate-500 hover:text-slate-300"
          >
            Use another phone number
          </button>
        </form>
      )}
      {error && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
};

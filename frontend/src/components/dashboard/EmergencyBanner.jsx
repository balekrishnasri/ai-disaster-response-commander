import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export const EmergencyBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const requestHelp = () => {
    if (!user) {
      navigate("/login", { state: { from: "/rescue-portal" } });
      return;
    }
    navigate(
      user.role === "citizen" ? "/rescue-portal" : "/team/dashboard",
    );
  };

  return (
    <div className="sticky bottom-0 z-20 border-t border-red-500/30 bg-red-950/95 shadow-[0_-15px_40px_rgba(0,0,0,.45)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:px-6">
        <div>
          <p className="font-black text-white">Need Emergency Help?</p>
          <p className="text-sm text-red-200/70">
            Send your location directly to nearby rescue teams.
          </p>
        </div>
        <button type="button" onClick={requestHelp} className="btn-danger w-full sm:w-auto">
          Request Help Now
        </button>
      </div>
    </div>
  );
};

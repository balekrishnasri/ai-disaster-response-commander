import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import RescuePortalPage from "./pages/RescuePortalPage.jsx";
import TeamDashboardPage from "./pages/TeamDashboardPage.jsx";
import TrackRescuePage from "./pages/TrackRescuePage.jsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute roles={["citizen"]} />}>
        <Route path="/rescue-portal" element={<RescuePortalPage />} />
        <Route path="/track/:requestId" element={<TrackRescuePage />} />
      </Route>
      <Route element={<ProtectedRoute roles={["responder", "admin"]} />}>
        <Route path="/team/dashboard" element={<TeamDashboardPage />} />
      </Route>
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

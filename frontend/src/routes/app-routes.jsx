import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/page/login";
import RegisterPage from "@/page/register";
import HomePage from "@/page/home";
import DetectionPage from "@/page/detection";
import { useAppContext } from "@/context/app-provider";
import CCTVDashboardPage from "@/page/cctvdashboard";
import LostReportsPage from "@/page/lostreports";
import ReportChlidPage from "@/page/report-lost-child";
import SOSPage from "@/page/sos";

function AppRoutes() {
  const { isAuthenticated } = useAppContext();

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/report-lost-child" element={<ReportChlidPage />} />

        {isAuthenticated ? (
          <>
            <Route path="/cctvdashboard" element={<CCTVDashboardPage />} />
            <Route path="/detection" element={<DetectionPage />} />
            <Route path="/lost-reports" element={<LostReportsPage />} />
            <Route path="/sos" element={<SOSPage />} />
          </>
        ) : (
          <>
            <Route path="/cctvdashboard" element={<Navigate to="/login" />} />
            <Route path="/detection" element={<Navigate to="/login" />} />
            <Route path="/lost-reports" element={<Navigate to="/login" />} />
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default AppRoutes;

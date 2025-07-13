import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, memo } from "react";
import { Toaster } from "react-hot-toast";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

import UserProvider from "./context/userContext";
import { SettingsProvider } from "./context/settingsContext";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Dashboard/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const Income = lazy(() => import("./pages/Dashboard/Income"));
const Expense = lazy(() => import("./pages/Dashboard/Expense"));
const OtpVerification = lazy(() => import("./pages/auth/OtpVerification"));
const Profile = lazy(() => import("./pages/Dashboard/Profile"));
const Privacy = lazy(() => import("./pages/legal/Privacy"));
const Terms = lazy(() => import("./pages/legal/Terms"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));

// Setup dayjs
dayjs.extend(relativeTime);
dayjs.locale('en');

// Loading fallback component
const LoadingFallback = memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="loading-spinner"></div>
  </div>
));
LoadingFallback.displayName = 'LoadingFallback';

// Toast configuration - moved outside component to prevent recreation
const toastOptions = {
  duration: 4000,
  success: {
    style: {
      fontSize: "14px",
      background: "#10b981",
      color: "white",
    },
    iconTheme: {
      primary: "white",
      secondary: "#10b981",
    },
  },
  error: {
    style: {
      fontSize: "14px",
      background: "#ef4444",
      color: "white",
    },
    iconTheme: {
      primary: "white",
      secondary: "#ef4444",
    },
  },
  loading: {
    style: {
      fontSize: "14px",
      background: "#6366f1",
      color: "white",
    },
  },
};

// Root component to handle initial routing
const Root = memo(() => {
  const isAuthenticated = !!localStorage.getItem("access_token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
});
Root.displayName = 'Root';

const App = () => {
  return (
    <SettingsProvider>
      <UserProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Root Route */}
              <Route path="/" element={<Root />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/verify-otp" element={<OtpVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Legal Pages */}
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<Home />} />
              <Route path="/dashboard/income" element={<Income />} />
              <Route path="/dashboard/expense" element={<Expense />} />
              <Route path="/dashboard/profile" element={<Profile />} />

              {/* 404 Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>

        {/* Toast Notifications */}
        <Toaster position="top-right" toastOptions={toastOptions} />
      </UserProvider>
    </SettingsProvider>
  );
};

export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Dashboard/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import UserProvider from "./context/userContext";
import { Toaster } from "react-hot-toast";
import OtpVerification from "./pages/auth/OtpVerification";
import Profile from "./pages/Dashboard/Profile";
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

const App = () => {
  return (
    <UserProvider>
      <Router>
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
      </Router>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
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
        }}
      />
    </UserProvider>
  );
};

export default App;

// Root component to handle initial routing
const Root = () => {
  const isAuthenticated = !!localStorage.getItem("access_token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};
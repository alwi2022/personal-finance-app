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

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/dashboard/income" element={<Income />} />
          <Route path="/dashboard/expense" element={<Expense />} />
        </Routes>
      </Router>

      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: { fontSize: "16px" },
          },
          error: {
            style: { fontSize: "16px" },
          },
        }}
      />
    </UserProvider>
  );
};

export default App;


const Root = () => {
  const isAuthenticated = !!localStorage.getItem("access_token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
    
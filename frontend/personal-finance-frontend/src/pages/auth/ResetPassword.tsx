import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, TrendingUp, AlertCircle } from "lucide-react";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";
import { toast } from "react-hot-toast";

interface FormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ResetPassword() {
  const [form, setForm] = useState<FormData>({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from URL params or location state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const emailParam = urlParams.get("email");
    const stateEmail = location.state?.email;
    
    if (emailParam) {
      setForm(prev => ({ ...prev, email: emailParam }));
    } else if (stateEmail) {
      setForm(prev => ({ ...prev, email: stateEmail }));
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.otp) {
      newErrors.otp = "Reset code is required";
    } else if (form.otp.length !== 6) {
      newErrors.otp = "Reset code must be 6 digits";
    }

    if (!form.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await axiosInstance.post(API_PATH.AUTH.RESET_PASSWORD, {
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword,
      });

      setIsSuccess(true);
      toast.success("Password reset successful! Please login with your new password.");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Reset password failed:", err);
      const errorMessage = err?.response?.data?.message || "Failed to reset password";
      
      if (err?.response?.status === 400) {
        if (errorMessage.includes("OTP")) {
          setErrors({ otp: errorMessage });
        } else if (errorMessage.includes("password")) {
          setErrors({ newPassword: errorMessage });
        } else {
          setErrors({ email: errorMessage });
        }
      } else if (err?.response?.status === 404) {
        setErrors({ email: "No account found with this email address" });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/login" className="inline-flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">FinanceTracker</span>
            </Link>
          </div>

          {/* Success Card */}
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={24} className="text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h1>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You can now log in with your new password.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                Redirecting you to login page in 3 seconds...
              </p>
            </div>

            <Link
              to="/login"
              className="btn-primary w-full"
            >
              <ArrowLeft size={16} />
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">FinanceTracker</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            Enter the reset code sent to your email and create a new password
          </p>
        </div>

        {/* Form Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="input-label">Email address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                className={`input-box ${errors.email ? 'error' : ''}`}
                autoComplete="email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="input-error">{errors.email}</p>
              )}
            </div>

            {/* OTP Field */}
            <div>
              <label className="input-label">Reset Code</label>
              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit code"
                value={form.otp}
                onChange={handleChange}
                className={`input-box text-center text-2xl font-mono tracking-widest ${errors.otp ? 'error' : ''}`}
                maxLength={6}
                autoComplete="one-time-code"
                disabled={isLoading}
              />
              {errors.otp && (
                <p className="input-error">{errors.otp}</p>
              )}
              <p className="input-help">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            {/* New Password Field */}
            <div>
              <label className="input-label">New Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Create new password"
                  value={form.newPassword}
                  onChange={handleChange}
                  className={`input-box pl-11 pr-11 ${errors.newPassword ? 'error' : ''}`}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="input-error">{errors.newPassword}</p>
              )}
              <p className="input-help">
                Password must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="input-label">Confirm New Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`input-box pl-11 pr-11 ${errors.confirmPassword ? 'error' : ''}`}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="input-error">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary group w-full"
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  Reset Password
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Navigation Links */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-600 hover:text-primary flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Request New Code
            </Link>
            
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-primary flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center mt-0.5">
              <AlertCircle size={12} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-amber-900 text-sm mb-1">Security Notice</h3>
              <p className="text-amber-800 text-xs">
                Reset codes expire after 10 minutes. Make sure your new password is strong and unique.
                Never share your reset code with anyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
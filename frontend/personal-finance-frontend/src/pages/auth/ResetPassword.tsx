import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";
import { toast } from "react-hot-toast";
import { useSettings } from "../../context/settingsContext";
import AuthLayout from "../../components/layouts/AuthLayout";

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
  const { t } = useSettings();

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
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.email) {
      newErrors.email = t('email_required') || "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t('invalid_email') || "Please enter a valid email address";
    }

    if (!form.otp) {
      newErrors.otp = t('reset_code_required') || "Reset code is required";
    } else if (form.otp.length !== 6) {
      newErrors.otp = t('reset_code_6_digits') || "Reset code must be 6 digits";
    }

    if (!form.newPassword) {
      newErrors.newPassword = t('new_password_required') || "New password is required";
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = t('password_min_6') || "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = t('confirm_password_required') || "Please confirm your password";
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = t('passwords_dont_match') || "Passwords do not match";
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
      toast.success(t('password_reset_success') || "Password reset successful! Please login with your new password.");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Reset password failed:", err);
      const errorMessage = err?.response?.data?.message || t('failed_reset_password') || "Failed to reset password";
      
      if (err?.response?.status === 400) {
        if (errorMessage.includes("OTP")) {
          setErrors({ otp: errorMessage });
        } else if (errorMessage.includes("password")) {
          setErrors({ newPassword: errorMessage });
        } else {
          setErrors({ email: errorMessage });
        }
      } else if (err?.response?.status === 404) {
        setErrors({ email: t('no_account_found') || "No account found with this email address" });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout variant="minimal" showLanguageToggle={true}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={24} className="text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('password_reset_successful') || 'Password Reset Successful!'}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('password_reset_success_message') || 'Your password has been successfully reset. You can now log in with your new password.'}
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 text-sm">
              {t('redirecting_login') || 'Redirecting you to login page in 3 seconds...'}
            </p>
          </div>

          <Link to="/login" className="btn-primary w-full">
            <ArrowLeft size={16} />
            {t('go_to_login') || 'Go to Login'}
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout variant="minimal" showLanguageToggle={true}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('reset_password') || 'Reset Password'}
        </h1>
        <p className="text-gray-600">
          {t('reset_password_subtitle') || 'Enter the reset code sent to your email and create a new password'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label className="input-label">
            {t('email_address') || 'Email address'}
          </label>
          <input
            type="email"
            name="email"
            placeholder={t('enter_your_email') || 'Enter your email address'}
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
          <label className="input-label">
            {t('reset_code') || 'Reset Code'}
          </label>
          <input
            type="text"
            name="otp"
            placeholder={t('enter_6_digit_code') || 'Enter 6-digit code'}
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
            {t('enter_code_from_email') || 'Enter the 6-digit code sent to your email'}
          </p>
        </div>

        {/* New Password Field */}
        <div>
          <label className="input-label">
            {t('new_password') || 'New Password'}
          </label>
          <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </span>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              placeholder={t('create_new_password') || 'Create new password'}
              value={form.newPassword}
              onChange={handleChange}
              className={`w-full pl-11 pr-11 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
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
            {t('password_min_6_chars') || 'Password must be at least 6 characters'}
          </p>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="input-label">
            {t('confirm_new_password') || 'Confirm New Password'}
          </label>
          <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder={t('confirm_new_password') || 'Confirm new password'}
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-11 pr-11 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
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
              {t('reset_password') || 'Reset Password'}
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
          {t('request_new_code') || 'Request New Code'}
        </Link>
        
        <Link
          to="/login"
          className="text-sm text-gray-600 hover:text-primary flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} />
          {t('back_to_login') || 'Back to Login'}
        </Link>
      </div>

      {/* Security Notice */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center mt-0.5">
            <AlertCircle size={12} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-medium text-amber-900 text-sm mb-1">
              {t('security_notice') || 'Security Notice'}
            </h3>
            <p className="text-amber-800 text-xs">
              {t('reset_security_notice') || 'Reset codes expire after 10 minutes. Make sure your new password is strong and unique. Never share your reset code with anyone.'}
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

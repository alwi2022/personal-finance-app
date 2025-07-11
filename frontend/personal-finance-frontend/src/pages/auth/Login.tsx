import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import AuthLayout from "../../components/layouts/AuthLayout";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";
import { validateEmail } from "../../utils/helper";
import { UserContext } from "../../context/userContext";
import type { LoginResponse } from "../../types/type";
import { useSettings } from "../../context/settingsContext";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const { t } = useSettings();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const [form, setForm] = useState<FormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!userContext) {
    throw new Error("UserContext must be used within a UserProvider");
  }

  const { updateUser } = userContext;

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      const response = await axiosInstance.post<LoginResponse>(API_PATH.AUTH.LOGIN, {
        email: form.email,
        password: form.password,
      });

      const { access_token, user } = response.data;

      localStorage.setItem("access_token", access_token);
      updateUser(user);
      
      // Success feedback
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      
      const errorMessage = err?.response?.data?.message || "Login failed. Please try again.";
      
      // Check if it's a field-specific error
      if (err?.response?.status === 401) {
        setErrors({ password: "Invalid email or password" });
      } else {
        setErrors({ email: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout variant="split" showLanguageToggle={true}>
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('sign_in')}</h1>
          <p className="text-gray-600">
            {t('sign_in_to_your_account_to_continue')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="input-label">
              {t('email_address')}
            </label>
            <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Mail size={20} />
              </span>
              <input
                type="email"
                placeholder={t('enter_your_email')}
                value={form.email}
                onChange={handleChange("email")}
                className={`w-full pl-11 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="input-error">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="input-label">
              {t('password')}
            </label>
            <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t('enter_your_password')}
                value={form.password}
                onChange={handleChange("password")}
                className={`w-full pl-11 pr-11 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="input-error">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-600">{t('remember_me')}</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              {t('forgot_password')}
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary group"
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                {t('sign_in')}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="divider"></div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t('dont_have_an_account')}
              <Link
                to="/signup"
                className="text-primary hover:text-primary-dark font-medium"
              >
                {t('sign_up_for_free')}
              </Link>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
                {t('terms_of_service')}
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              {t('privacy_policy')}
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
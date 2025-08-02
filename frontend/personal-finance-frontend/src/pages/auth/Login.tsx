import { useState, useContext, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import AuthLayout from "../../components/layouts/AuthLayout";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";
import { validateEmail } from "../../utils/helper";
import { UserContext } from "../../context/userContext";
import { useSettings } from "../../context/settingsContext";
import type { LoginResponse } from "../../types/type";
import clsx from "clsx";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const { t } = useSettings();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  if (!userContext) throw new Error("UserContext must be used within a UserProvider");

  const { updateUser } = userContext;

  const [form, setForm] = useState<FormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = useCallback(
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm(prev => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    },
    [errors]
  );

  const validateForm = useCallback((): Partial<FormData> => {
    const newErrors: Partial<FormData> = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!validateEmail(form.email)) newErrors.email = "Please enter a valid email";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    return newErrors;
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { data } = await axiosInstance.post<LoginResponse>(API_PATH.AUTH.LOGIN, form);
      localStorage.setItem("access_token", data.access_token);
      updateUser(data.user);
      navigate("/dashboard");
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || "Login failed. Please try again.";
      setErrors(status === 401 ? { password: "Invalid email or password" } : { email: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout variant="split" showLanguageToggle>
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("sign_in")}</h1>
          <p className="text-gray-600">{t("sign_in_to_your_account_to_continue")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <InputField
            type="email"
            icon={<Mail size={20} />}
            placeholder={t("enter_your_email")}
            label={t("email_address")}
            value={form.email}
            error={errors.email}
            disabled={isLoading}
            onChange={handleChange("email")}
          />

          {/* Password */}
          <InputField
            type={showPassword ? "text" : "password"}
            icon={<Lock size={20} />}
            placeholder={t("enter_your_password")}
            label={t("password")}
            value={form.password}
            error={errors.password}
            disabled={isLoading}
            onChange={handleChange("password")}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-primary underline">
              {t("forgot_password")}
            </Link>
          </div>

          {/* Submit */}
          <button type="submit" disabled={isLoading} className="btn-primary group">
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
              <>
                {t("sign_in")}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Sign Up */}
          <p className="text-sm text-gray-600 text-center">
            {t("dont_have_an_account")}
            <Link to="/signup" className="text-primary ml-1 font-medium hover:text-primary-dark">
              {t("sign_up_for_free")}
            </Link>
          </p>
        </form>

        {/* Footer */}
        <p className="mt-8 text-xs text-center text-gray-500">
          By signing in, you agree to our{" "}
          <Link to="/terms" className="text-primary hover:underline">
            {t("terms_of_service")}
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            {t("privacy_policy")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

interface InputFieldProps {
  label: string;
  icon: React.ReactNode;
  rightIcon?: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

function InputField({
  label,
  icon,
  rightIcon,
  value,
  onChange,
  type = "text",
  placeholder = "",
  error,
  disabled = false,
}: InputFieldProps) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={clsx(
            "w-full pl-11 pr-11 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary",
            error ? "border-red-500" : "border-gray-300"
          )}
          autoComplete={type === "password" ? "current-password" : "email"}
          disabled={disabled}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</span>
        )}
      </div>
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}

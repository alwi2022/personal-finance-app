import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft, CheckCircle, Shield } from "lucide-react";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";
import { toast } from "react-hot-toast";
import { useSettings } from "../../context/settingsContext";
import AuthLayout from "../../components/layouts/AuthLayout";
import clsx from "clsx";

interface FormData {
  email: string;
}

interface FormErrors {
  email?: string;
}

export default function ForgotPassword() {
  const [form, setForm] = useState<FormData>({ email: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useSettings();
  const navigate = useNavigate();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ email: e.target.value });
    if (errors.email) setErrors({});
  }, [errors]);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.email) {
      newErrors.email = t("email_required") || "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = t("invalid_email") || "Please enter a valid email address";
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
    try {
      await axiosInstance.post(API_PATH.AUTH.FORGOT_PASSWORD, { email: form.email });
      setIsSubmitted(true);
      toast.success(t("reset_link_sent") || "Reset link sent");
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || t("failed_send_reset") || "Reset failed";
      if (status === 404) {
        setErrors({ email: t("no_account_found") || "No account found" });
      } else {
        setErrors({ email: msg });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout variant="minimal" showLanguageToggle>
        <div className="text-center max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Shield size={28} className="text-green-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("check_your_email")}</h1>
            <p className="text-gray-600">
              {t("reset_code_sent_to")} <strong>{form.email}</strong>
            </p>
          </div>

          <ol className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left text-blue-800 text-sm space-y-1">
            <li>1. {t("check_email_inbox")}</li>
            <li>2. {t("copy_reset_code")}</li>
            <li>3. {t("enter_code_next_page")}</li>
            <li>4. {t("create_new_password")}</li>
          </ol>

          <div className="space-y-3">
            <button
              onClick={() => navigate(`/reset-password?email=${encodeURIComponent(form.email)}`)}
              className="btn-primary w-full"
            >
              {t("enter_reset_code")}
            </button>
            <button onClick={() => setIsSubmitted(false)} className="btn-outline btn-sm w-full">
              {t("try_different_email")}
            </button>
            <Link to="/login" className="btn-outline btn-sm w-full block">
              {t("back_to_login")}
            </Link>
          </div>

          <p className="text-xs text-gray-500">{t("didnt_receive_email")}</p>
        </div>
      </AuthLayout>
    );
  }


  return (
    <AuthLayout variant="minimal" showLanguageToggle>
      <div className="text-center mb-6 space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">{t("forgot_password")}</h1>
        <p className="text-gray-600">{t("reset_password_instructions")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <div>
          <label className="input-label">{t("email_address")}</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail size={20} />
            </span>
            <input
              type="email"
              placeholder={t("enter_your_email")}
              value={form.email}
              onChange={handleChange}
              className={clsx(
                "w-full pl-11 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary",
                errors.email ? "border-red-500" : "border-gray-300"
              )}
              autoComplete="email"
              disabled={isLoading}
              autoFocus
            />
            {form.email && !errors.email && validateEmail(form.email) && (
              <CheckCircle size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
            )}
          </div>
          {errors.email && <p className="input-error">{errors.email}</p>}
          {/* <p className="input-help">{t("reset_code_help")}</p> */}
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary group w-full ">
          {isLoading ? (
            <div className="loading-spinner" />
          ) : (
            <>
              {t("send_reset_code")}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform ml-1" />
            </>
          )}
        </button>
      </form>

      {/* Bottom Actions */}
      <div className="mt-6  border-t border-gray-100 text-center space-y-4 text-sm text-gray-600">
        <Link to="/login" className="hover:text-primary flex justify-center items-center gap-1">
          <ArrowLeft size={14} /> {t("back_to_login")}
        </Link>

        <p>
          {t("dont_have_account")}{" "}
          <Link to="/signup" className="text-primary hover:text-primary-dark font-medium">
            {t("signup")}
          </Link>
        </p>
      </div>

     
    </AuthLayout>
  );
}

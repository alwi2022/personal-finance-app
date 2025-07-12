import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft, CheckCircle, Shield } from "lucide-react";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";
import { toast } from "react-hot-toast";
import { useSettings } from "../../context/settingsContext";
import AuthLayout from "../../components/layouts/AuthLayout";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm({ email: value });
    
    if (errors.email) {
      setErrors({ email: undefined });
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.email) {
      newErrors.email = t('email_required') || "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = t('invalid_email') || "Please enter a valid email address";
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
      await axiosInstance.post(API_PATH.AUTH.FORGOT_PASSWORD, {
        email: form.email,
      });

      setIsSubmitted(true);
      toast.success(t('reset_link_sent') || "Password reset code sent to your email");
    } catch (err: any) {
      console.error("Forgot password failed:", err);
      const errorMessage = err?.response?.data?.message || t('failed_send_reset') || "Failed to send reset email";
      
      if (err?.response?.status === 404) {
        setErrors({ email: t('no_account_found') || "No account found with this email address" });
      } else {
        setErrors({ email: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout variant="minimal" showLanguageToggle={true}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={24} className="text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('check_your_email') || 'Check Your Email'}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('reset_code_sent_to') || "We've sent a password reset code to"} <strong>{form.email}</strong>
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-blue-900 mb-2">
              {t('next_steps') || 'Next Steps'}:
            </h3>
            <ol className="text-blue-800 text-sm space-y-1">
              <li>1. {t('check_email_inbox') || 'Check your email inbox'}</li>
              <li>2. {t('copy_reset_code') || 'Copy the 6-digit reset code'}</li>
              <li>3. {t('enter_code_next_page') || 'Enter the code on next page'}</li>
              <li>4. {t('create_new_password') || 'Create your new password'}</li>
            </ol>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate(`/reset-password?email=${encodeURIComponent(form.email)}`)}
              className="btn-primary w-full"
            >
              <ArrowRight size={16} />
              {t('enter_reset_code') || 'Enter Reset Code'}
            </button>
            
            <button
              onClick={() => setIsSubmitted(false)}
              className="btn-outline btn-sm w-full"
            >
              {t('try_different_email') || 'Try Different Email'}
            </button>
            
            <Link to="/login" className="btn-outline btn-sm w-full block">
              <ArrowLeft size={16} />
              {t('back_to_login') || 'Back to Login'}
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            {t('didnt_receive_email') || "Didn't receive the email? Check your spam folder or contact support"}
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout variant="minimal" showLanguageToggle={true}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('forgot_password') || 'Forgot Password?'}
        </h1>
        <p className="text-gray-600">
          {t('reset_password_instructions') || 'No worries! Enter your email and we\'ll send you a reset code'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label className="input-label">
            {t('email_address') || 'Email address'}
          </label>
          <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Mail size={20} />
              </span>
            <input
              type="email"
              placeholder={t('enter_your_email') || 'Enter your email address'}
              value={form.email}

              onChange={handleChange}
             className={`w-full pl-11 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? "border-red-500" : "border-gray-300"
                  }`}
              autoComplete="email"
              disabled={isLoading}
              autoFocus
            />
            {form.email && !errors.email && validateEmail(form.email) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                <CheckCircle size={20} />
              </div>
            )}
          </div>
          {errors.email && (
            <p className="input-error">{errors.email}</p>
          )}
          <p className="input-help">
            {t('reset_code_help') || "We'll send a 6-digit reset code to this email"}
          </p>
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
              {t('send_reset_code') || 'Send Reset Code'}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Navigation Links */}
      <div className="mt-6 pt-6 border-t border-gray-200 space-y-4 text-center">
        <Link
          to="/login"
          className="text-sm text-gray-600 hover:text-primary flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} />
          {t('back_to_login') || 'Back to Login'}
        </Link>
        
        <p className="text-sm text-gray-600">
          {t('dont_have_account') || "Don't have an account?"}{" "}
          <Link
            to="/signup"
            className="text-primary hover:text-primary-dark font-medium"
          >
            {t('signup') || 'Sign up for free'}
          </Link>
        </p>
      </div>

      {/* Security Notice */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
            <CheckCircle size={12} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900 text-sm mb-1">
              {t('security_notice') || 'Security Notice'}
            </h3>
            <p className="text-blue-800 text-xs">
              {t('reset_code_expiry_notice') || 'Reset codes expire after 10 minutes and can only be used once. Check your spam folder if you don\'t receive an email.'}
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}


import { useContext, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import AuthLayout from "../../components/layouts/AuthLayout";
import ProfilePictureSelector from "../../components/Inputs/ProfilePictureSelector";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";
import { toast } from "react-hot-toast";
import { useSettings } from "../../context/settingsContext";

interface FormData {
  fullName: string;
  email: string;
  password: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
}

export default function SignUp() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const { t } = useSettings();

  const [form, setForm] = useState<FormData>({ fullName: "", email: "", password: "" });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!userContext) throw new Error("UserContext must be used within UserProvider");

  const handleChange = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    else if (form.fullName.trim().length < 2) newErrors.fullName = "At least 2 characters";

    if (!form.email) newErrors.email = "Email is required";
    else if (!validateEmail(form.email)) newErrors.email = "Invalid email";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) newErrors.password = "Minimum 8 characters";

    return newErrors;
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 8) return { strength: "weak", color: "text-red-500" };
    if (password.length < 12) return { strength: "medium", color: "text-yellow-500" };
    return { strength: "strong", color: "text-green-500" };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) return setErrors(formErrors);

    setLoading(true);
    try {
      let profileImageUrl = "";
      if (profilePicture) {
        const uploadRes = await uploadImage(profilePicture);
        profileImageUrl = uploadRes.imageUrl || "";
      }

      const res = await axiosInstance.post(API_PATH.AUTH.REGISTER, {
        email: form.email,
        fullName: form.fullName,
      });

      toast.success("OTP sent to your email");
      navigate("/verify-otp", {
        state: {
          ...form,
          profileImageUrl,
          expiredAt: res.data?.expiredAt,
        },
      });
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to send OTP";
      if (err?.response?.status === 400) setErrors({ email: message });
      else toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <AuthLayout variant="split" showLanguageToggle={true}>
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center  mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{t('sign_up')}</h1>
          <p className="text-gray-600">{t('fill_in_the_form_below_to_create_your_account')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Profile Picture */}
          <div className="text-center -mb-2">

            <div className="flex justify-center">
              <ProfilePictureSelector image={profilePicture} setImage={setProfilePicture} />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('full_name')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={18} />
              </span>
              <input
                type="text"
                placeholder={t('your_full_name')}
                value={form.fullName}
                onChange={handleChange("fullName")}
                className={`w-full pl-11 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                disabled={loading}
              />
              {form.fullName && !errors.fullName && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                  <CheckCircle size={18} />
                </span>
              )}
            </div>
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder={t('enter_your_email')}
                value={form.email}
                onChange={handleChange("email")}
                className={`w-full pl-11 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                autoComplete="email"
                disabled={loading}
              />
              {form.email && !errors.email && validateEmail(form.email) && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                  <CheckCircle size={18} />
                </span>
              )}
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t('create_password')}
                value={form.password}
                onChange={handleChange("password")}
                className={`w-full pl-11 pr-11 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            {form.password && !errors.password && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{t('strength')}:</span>
                <span className={`text-xs font-medium ${passwordStrength.color}`}>
                  {passwordStrength.strength}
                </span>
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <input type="checkbox" id="terms" className="mt-0.5" required />
            <label htmlFor="terms">
              {t('i_agree_to_the')}
              <Link to="/terms" className="text-primary underline">{t('terms')}</Link> {t('and')}
              <Link to="/privacy" className="text-primary underline">{t('privacy_policy')}</Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary group"
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                {t('create_account')}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Sign In */}
          <p className="text-center text-sm text-gray-600 mt-2">
            {t('already_have_an_account')}?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              {t('sign_in')}
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

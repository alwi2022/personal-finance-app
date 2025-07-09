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

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignUp() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const [form, setForm] = useState<FormData>({ 
    fullName: "", 
    email: "", 
    password: "",
    confirmPassword: ""
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!userContext) throw new Error("UserContext must be used within UserProvider");

  const handleChange = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm({ ...form, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (form.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

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
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

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

      const expiredAt = res.data?.expiredAt;

      toast.success("OTP has been sent to your email");

      navigate("/verify-otp", {
        state: {
          ...form,
          profileImageUrl,
          expiredAt,
        },
      });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to send OTP";
      
      // Handle specific error types
      if (err?.response?.status === 400) {
        setErrors({ email: errorMessage });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">
            Join thousands of users managing their finances
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Profile Picture (Optional)
            </label>
            <div className="flex justify-center">
              <ProfilePictureSelector 
                image={profilePicture} 
                setImage={setProfilePicture} 
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Upload a profile picture to personalize your account
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="input-label">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User size={20} />
              </div>
              <input
                type="text"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange("fullName")}
                className={`input-box pl-11 ${errors.fullName ? 'error' : ''}`}
                disabled={loading}
              />
              {form.fullName && !errors.fullName && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                  <CheckCircle size={20} />
                </div>
              )}
            </div>
            {errors.fullName && (
              <p className="input-error">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="input-label">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange("email")}
                className={`input-box pl-11 ${errors.email ? 'error' : ''}`}
                disabled={loading}
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
          </div>

          {/* Password */}
          <div>
            <label className="input-label">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange("password")}
                className={`input-box pl-11 pr-11 ${errors.password ? 'error' : ''}`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="input-error">{errors.password}</p>
            )}
            {form.password && !errors.password && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">Password strength:</span>
                <span className={`text-xs font-medium ${passwordStrength.color}`}>
                  {passwordStrength.strength}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="input-label">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                className={`input-box pl-11 pr-11 ${errors.confirmPassword ? 'error' : ''}`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {form.confirmPassword && form.password === form.confirmPassword && (
                <div className="absolute right-11 top-1/2 transform -translate-y-1/2 text-green-500">
                  <CheckCircle size={20} />
                </div>
              )}
            </div>
            {errors.confirmPassword && (
              <p className="input-error">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2 mt-1"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
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
                Create Account
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="divider"></div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you're joining a secure platform trusted by thousands
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
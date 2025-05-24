import { useContext, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
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
}

export default function SignUp() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const [form, setForm] = useState<FormData>({ fullName: "", email: "", password: "" });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!userContext) throw new Error("UserContext must be used within UserProvider");

  const handleChange = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const validateForm = () => {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!validateEmail(form.email)) return "Invalid email address.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    return "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const err = validateForm();
    if (err) return setError(err);

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
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create a New Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Fill in the form below to create your account
        </p>

        <form onSubmit={handleSubmit}>
          <ProfilePictureSelector image={profilePicture} setImage={setProfilePicture} />

          <Input label="Full Name" value={form.fullName} onChange={handleChange("fullName")} placeholder="Enter your full name" />
          <Input label="Email Address" type="email" value={form.email} onChange={handleChange("email")} placeholder="Enter your email address" />
          <Input label="Password" type="password" value={form.password} onChange={handleChange("password")} placeholder="At least 8 characters" />

          {error && <p className="text-red-500 text-xs pb-2.5 mt-2">{error}</p>}

          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <p className="text-[13px] text-slate-800 mt-4">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-primary underline">
              Sign in here
            </a>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

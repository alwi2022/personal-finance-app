import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import ProfilePictureSelector from "../../components/Inputs/ProfilePictureSelector";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";

export default function SignUp() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!userContext) {
    throw new Error("UserContext must be used inside a UserProvider");
  }

  const { updateUser } = userContext;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ Basic form validation
    if (!fullName.trim()) {
      return setError("Please enter your full name.");
    }
    if (!validateEmail(email)) {
      return setError("Please enter a valid email address.");
    }
    if (password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }

    setLoading(true);

    try {
      let profileImageUrl = "";

      // ✅ Upload image if exists
      if (profilePicture) {
        const uploadRes = await uploadImage(profilePicture);
        profileImageUrl = uploadRes?.imageUrl || ""; // 🚀 Fix key here
      }

      // ✅ Register user
      const res = await axiosInstance.post(API_PATH.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      const { access_token, user } = res.data;

      if (access_token) {
        localStorage.setItem("access_token", access_token);
        updateUser(user);
        navigate("/dashboard");
      } else {
        setError("Failed to receive access token.");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Signup failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-full h-auto md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-slate-700 mb-2">Create an Account</h3>
        <p className="text-sm text-slate-500 mb-6">Join us today by filling in your details below.</p>

        <form onSubmit={handleSignUp} className="mt-2">
          <ProfilePictureSelector image={profilePicture} setImage={setProfilePicture} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
            />
            <Input
              label="Email Address"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <div className="col-span-2">
              <Input
                label="Password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

          <button
            type="submit"
            className={`btn-primary mt-4 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Signing up..." : "SIGN UP"}
          </button>

          <p className="text-[13px] text-slate-800 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import Input from "../../components/Inputs/Input";
import ProfilePictureSelector from "../../components/Inputs/ProfilePictureSelector";
import { validateEmail } from "../../utils/helper";

export default function SignUp() {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName) {
      setError("Please enter your name");
      return;
    }

    if (validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setError("Please enter the password");
      return;
    }

    setError("");

    // TODO: Handle actual form submission
  };

  return (
    <AuthLayout>
      <div className="lg:w-full h-auto md:h-full flex flex-col justify-center">
        <h3 className="text-xl text-slate-700 mt-1 mb-6">Create an account</h3>
        <p>Join us today by entering details below</p>

        <form onSubmit={handleSignUp} className="mt-6">
          <ProfilePictureSelector image={profilePicture} setImage={setProfilePicture} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label="Full Name"
              type="text"
            />
            <Input
              placeholder="johnExample@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              type="text"
            />
            <div className="col-span-2">
              <Input
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                type="password"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">SIGN UP</button>

          <p className="text-[13px] text-slate-800 mt-3">
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

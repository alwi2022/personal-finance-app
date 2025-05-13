import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import { useState } from "react";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }
    setError("");
    try {
      // Tambahkan logika login di sini nanti
      return;
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>
        <form onSubmit={handleLogin}>
          <Input
            placeholder="johnExample@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            type="text"
          />
          <Input
            placeholder="Min 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            type="password"
          />
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button type="submit" className="btn-primary"
           disabled={isLoading}>
            {isLoading ? "Loading..." : "LOGIN"}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

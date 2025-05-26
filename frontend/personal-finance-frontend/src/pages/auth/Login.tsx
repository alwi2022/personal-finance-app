import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";
import { validateEmail } from "../../utils/helper";
import { UserContext } from "../../context/userContext";
import type { LoginResponse } from "../../types/type";

export default function Login() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!userContext) {
    throw new Error("UserContext must be used within a UserProvider");
  }

  const { updateUser } = userContext;

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const validateForm = (): string => {
    if (!validateEmail(form.email)) return "Please enter a valid email address.";
    if (!form.password || form.password.length < 6)
      return "Password must be at least 6 characters.";
    return "";
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post<LoginResponse>(API_PATH.AUTH.LOGIN, {
        email: form.email,
        password: form.password,
      });

      const { access_token, user } = response.data;

      localStorage.setItem("access_token", access_token);
      updateUser(user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      const message =
        (err as any)?.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Enter your email and password to sign in
        </p>

        <form onSubmit={handleLogin}>
          <Input
            label="Email Address"
            type="text"
            placeholder="example@email.com"
            value={form.email}
            onChange={handleChange("email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={handleChange("password")}
          />

          {error && <p className="text-red-500 text-xs pb-2.5 mt-2">{error}</p>}

          <button type="submit" className="btn-primary mt-2" disabled={isLoading}>
            {isLoading ? "Loading..." : "SIGN IN"}
          </button>

          <p className="text-[13px] text-slate-800 mt-4">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-medium text-primary underline">
              Sign Up Now
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

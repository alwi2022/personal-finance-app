import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import { useState } from "react";
import Input from "../../components/Inputs/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-md mt-4">LOGIN</button>

          <p className="text-sm text-slate-700 mt-4">Don't have an account? <Link to="/register" className="text-primary">Register</Link></p>
        </form>
      </div>
    </AuthLayout>
  );
}

import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";
import { toast } from "react-hot-toast";
import { UserContext } from "../../context/userContext";

export default function OtpVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const userContext = useContext(UserContext);

    const data = location.state as {
        fullName: string;
        email: string;
        password: string;
        profileImageUrl: string;
        expiredAt: number;
    };

    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [timer, setTimer] = useState(() => {
        if (data?.expiredAt) {
            return Math.max(Math.floor((data.expiredAt - Date.now()) / 1000), 0);
        }
        return 120; // fallback default
    });



    useEffect(() => {
        if (!data?.email) {
            navigate("/signup");
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((t) => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        document.getElementById("otp-0")?.focus();
    }, []);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);
        if (value && index < otp.length - 1) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handlePasteOtp = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData("text").slice(0, 6).split("");
        if (pasted.every((char) => /^\d$/.test(char))) {
            setOtp(pasted.concat(Array(6 - pasted.length).fill("")));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (otp.some((d) => d.trim() === "")) return setError("All OTP fields must be filled.");

        setLoading(true);
        try {
            const res = await axiosInstance.post(API_PATH.AUTH.VERIFY_REGISTER, {
                ...data,
                otp: otp.join(""),
            });
            const { access_token, user } = res.data;
            localStorage.setItem("access_token", access_token);
            userContext?.updateUser(user);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err?.response?.data?.message || "OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            const res = await axiosInstance.post(API_PATH.AUTH.RESEND_OTP, { email: data.email });
            toast.success("New OTP sent");
            const expiredAt = res.data?.expiredAt;
            if (expiredAt) {
                setTimer(Math.max(Math.floor((expiredAt - Date.now()) / 1000), 0));
            } else {
                setTimer(120);
            }
        } catch {
            toast.error("Failed to resend OTP");
        }
    };

    return (
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">OTP Verification</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Enter the 6-digit OTP code sent to your email
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-6 gap-2 w-full mb-4">
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                id={`otp-${i}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                onPaste={handlePasteOtp}
                                className="border h-12 text-center text-lg rounded w-full"
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        disabled={timer > 0}
                        onClick={handleResendOtp}
                        className={`text-sm ${timer > 0 ? "text-gray-400" : "text-primary"}`}
                    >
                        {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                    </button>

                    {error && <p className="text-red-500 text-xs pb-2.5 mt-2">{error}</p>}

                    <button
                        type="submit"
                        className={`btn-primary mt-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify"}
                    </button>

                    <p className="text-[13px] text-slate-800 mt-4">
                        Wrong email?{" "}
                        <a href="/signup" className="font-medium text-primary underline">
                            Sign up again
                        </a>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
}

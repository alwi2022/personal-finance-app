import { useContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Mail, RefreshCw, Shield, CheckCircle, ArrowRight, Clock, AlertCircle } from "lucide-react";
import AuthLayout from "../../components/layouts/AuthLayout";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";
import { toast } from "react-hot-toast";
import { UserContext } from "../../context/userContext";

export default function OtpVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const userContext = useContext(UserContext);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const data = location.state as {
        fullName: string;
        email: string;
        password: string;
        profileImageUrl: string;
        expiredAt: number;
    };

    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const [resendCount, setResendCount] = useState(0); // 👈 TAMBAH: Track resend count

    const [timer, setTimer] = useState(() => {
        if (data?.expiredAt) {
            return Math.max(Math.floor((data.expiredAt - Date.now()) / 1000), 0);
        }
        return 120; // fallback default
    });

    // 👇 TAMBAH: Check if OTP expired
    const isExpired = timer <= 0;

    useEffect(() => {
        if (!data?.email) {
            navigate("/signup");
            return;
        }
    }, [data, navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((t) => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        const isOtpComplete = otp.every(digit => digit !== "");
        setIsComplete(isOtpComplete);

        // 👇 PERBAIKAN: Hanya auto-submit jika tidak expired dan tidak loading
        if (isOtpComplete && !isExpired && !loading) {
            handleSubmit();
        }
    }, [otp, isExpired, loading]);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        // Clear error when user starts typing
        if (error) setError("");

        // Auto-focus next input
        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        // 👇 TAMBAH: Enter key submit
        if (e.key === "Enter" && isComplete && !isExpired) {
            handleSubmit();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text");
        const digits = pastedData.replace(/\D/g, "").slice(0, 6).split("");

        if (digits.length > 0) {
            const newOtp = [...otp];
            digits.forEach((digit, index) => {
                if (index < 6) {
                    newOtp[index] = digit;
                }
            });
            setOtp(newOtp);

            // Focus the next empty input or the last input
            const nextIndex = Math.min(digits.length, 5);
            inputRefs.current[nextIndex]?.focus();
        }
    };

    const handleSubmit = async () => {
        if (otp.some((digit) => digit.trim() === "")) {
            setError("Please enter the complete OTP code");
            return;
        }

        // 👇 TAMBAH: Check expiry before submit
        if (isExpired) {
            setError("OTP has expired. Please request a new code.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await axiosInstance.post(API_PATH.AUTH.VERIFY_REGISTER, {
                ...data,
                otp: otp.join(""),
            });

            const { access_token, user } = res.data;
            localStorage.setItem("access_token", access_token);
            userContext?.updateUser(user);

            toast.success("Account created successfully!");
            navigate("/dashboard");
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || "OTP verification failed";
            setError(errorMessage);

            // Clear OTP on error
            setOtp(Array(6).fill(""));
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        // 👇 TAMBAH: Limit resend attempts
        if (resendCount >= 3) {
            toast.error("Too many resend attempts. Please try again later.");
            return;
        }

        setResendLoading(true);

        try {
            const res = await axiosInstance.post(API_PATH.AUTH.RESEND_OTP, {
                email: data.email
            });

            toast.success("New OTP sent to your email");
            setResendCount(prev => prev + 1); // 👈 TAMBAH: Increment counter

            const expiredAt = res.data?.expiredAt;
            if (expiredAt) {
                setTimer(Math.max(Math.floor((expiredAt - Date.now()) / 1000), 0));
            } else {
                setTimer(120);
            }

            // Clear current OTP and focus first input
            setOtp(Array(6).fill(""));
            setError("");
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || "Failed to resend OTP. Please try again.";
            toast.error(errorMessage);
        } finally {
            setResendLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const maskedEmail = data?.email?.replace(/(.{2}).*(@.*)/, '$1***$2');

    return (
        <AuthLayout>
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield size={24} className="text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
                    <p className="text-gray-600">
                        We've sent a 6-digit code to{" "}
                        <span className="font-medium text-gray-900">{maskedEmail}</span>
                    </p>
                </div>

                {/* 👇 TAMBAH: Expiry warning */}
                {isExpired && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 text-red-700">
                            <AlertCircle size={16} />
                            <span className="text-sm font-medium">Code Expired</span>
                        </div>
                        <p className="text-red-600 text-sm mt-1">
                            Your verification code has expired. Please request a new one.
                        </p>
                    </div>
                )}

                <div className="space-y-6">
                    {/* OTP Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                            Enter verification code
                        </label>
                        <div className="flex justify-center gap-3 mb-6">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => {
                                        if (el) {
                                            inputRefs.current[index] = el;
                                        }
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg transition-all
                                        ${digit
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-gray-300 hover:border-gray-400'
                                        } 
                                        ${error ? 'border-red-500' : ''}
                                        ${isExpired ? 'border-red-300 bg-red-50 text-red-400' : ''}
                                        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                        disabled:opacity-50 disabled:cursor-not-allowed`}
                                    disabled={loading || isExpired}
                                />
                            ))}
                        </div>

                        {/* Progress indicator */}
                        <div className="flex justify-center mb-4">
                            <div className="flex gap-1">
                                {otp.map((digit, index) => (
                                    <div
                                        key={index}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            digit 
                                                ? isExpired ? 'bg-red-400' : 'bg-primary' 
                                                : 'bg-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 text-sm justify-center">
                                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                                    <span className="text-xs">!</span>
                                </div>
                                {error}
                            </div>
                        )}

                        {isComplete && !error && !isExpired && (
                            <div className="flex items-center gap-2 text-green-600 text-sm justify-center">
                                <CheckCircle size={16} />
                                <span>Verifying...</span>
                            </div>
                        )}
                    </div>

                    {/* Timer and Resend */}
                    <div className="text-center">
                        {timer > 0 ? (
                            <div className="flex items-center justify-center gap-2 text-gray-600">
                                <Clock size={16} />
                                <span className="text-sm">
                                    Code expires in {formatTime(timer)}
                                </span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <button
                                    onClick={handleResendOtp}
                                    disabled={resendLoading || resendCount >= 3}
                                    className="btn-outline btn-sm"
                                >
                                    {resendLoading ? (
                                        <div className="loading-spinner"></div>
                                    ) : (
                                        <>
                                            <RefreshCw size={16} />
                                            Resend Code
                                        </>
                                    )}
                                </button>
                                {/* 👇 TAMBAH: Show resend count */}
                                {resendCount > 0 && (
                                    <p className="text-xs text-gray-500">
                                        Resent {resendCount}/3 times
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Manual Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !isComplete || isExpired}
                        className="btn-primary group"
                    >
                        {loading ? (
                            <div className="loading-spinner"></div>
                        ) : (
                            <>
                                Verify & Continue
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="divider"></div>

                    {/* Back to Sign Up */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Wrong email address?{" "}
                            <Link
                                to="/signup"
                                className="text-primary hover:text-primary-dark font-medium"
                            >
                                Go back to sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                        <Mail size={14} />
                        <span>Check your spam folder if you don't see the email</span>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
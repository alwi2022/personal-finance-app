import { useContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Mail, RefreshCw, Shield, CheckCircle, ArrowRight, Clock, AlertCircle } from "lucide-react";
import AuthLayout from "../../components/layouts/AuthLayout";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";
import { toast } from "react-hot-toast";
import { UserContext } from "../../context/userContext";
import { useSettings } from "../../context/settingsContext";

export default function OtpVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const userContext = useContext(UserContext);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { t } = useSettings();

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
    const [resendCount, setResendCount] = useState(0);

    const [timer, setTimer] = useState(() => {
        if (data?.expiredAt) {
            return Math.max(Math.floor((data.expiredAt - Date.now()) / 1000), 0);
        }
        return 120;
    });

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

        if (isOtpComplete && !isExpired && !loading) {
            handleSubmit();
        }
    }, [otp, isExpired, loading]);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        if (error) setError("");

        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
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

            const nextIndex = Math.min(digits.length, 5);
            inputRefs.current[nextIndex]?.focus();
        }
    };

    const handleSubmit = async () => {
        if (otp.some((digit) => digit.trim() === "")) {
            setError(t('enter_complete_otp') || "Please enter the complete OTP code");
            return;
        }

        if (isExpired) {
            setError(t('otp_expired') || "OTP has expired. Please request a new code.");
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

            toast.success(t('account_created_success') || "Account created successfully!");
            navigate("/dashboard");
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || t('otp_verification_failed') || "OTP verification failed";
            setError(errorMessage);

            setOtp(Array(6).fill(""));
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCount >= 3) {
            toast.error(t('too_many_resend_attempts') || "Too many resend attempts. Please try again later.");
            return;
        }

        setResendLoading(true);

        try {
            const res = await axiosInstance.post(API_PATH.AUTH.RESEND_OTP, {
                email: data.email
            });

            toast.success(t('new_otp_sent') || "New OTP sent to your email");
            setResendCount(prev => prev + 1);

            const expiredAt = res.data?.expiredAt;
            if (expiredAt) {
                setTimer(Math.max(Math.floor((expiredAt - Date.now()) / 1000), 0));
            } else {
                setTimer(120);
            }

            setOtp(Array(6).fill(""));
            setError("");
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || t('failed_resend_otp') || "Failed to resend OTP. Please try again.";
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
        <AuthLayout variant="split" showLanguageToggle={true}>
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield size={24} className="text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {t('verify_your_email') || 'Verify Your Email'}
                    </h1>
                    <p className="text-gray-600">
                        {t('otp_sent_to') || "We've sent a 6-digit code to"}{" "}
                        <span className="font-medium text-gray-900">{maskedEmail}</span>
                    </p>
                </div>

                {/* Expiry Warning */}
                {isExpired && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 text-red-700">
                            <AlertCircle size={16} />
                            <span className="text-sm font-medium">
                                {t('code_expired') || 'Code Expired'}
                            </span>
                        </div>
                        <p className="text-red-600 text-sm mt-1">
                            {t('code_expired_message') || 'Your verification code has expired. Please request a new one.'}
                        </p>
                    </div>
                )}

                <div className="space-y-6">
                    {/* OTP Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                            {t('enter_verification_code') || 'Enter verification code'}
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
                                <span>{t('verifying') || 'Verifying...'}</span>
                            </div>
                        )}
                    </div>

                    {/* Timer and Resend */}
                    <div className="text-center">
                        {timer > 0 ? (
                            <div className="flex items-center justify-center gap-2 text-gray-600">
                                <Clock size={16} />
                                <span className="text-sm">
                                    {t('code_expires_in') || 'Code expires in'} {formatTime(timer)}
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
                                            {t('resend_code') || 'Resend Code'}
                                        </>
                                    )}
                                </button>
                                {resendCount > 0 && (
                                    <p className="text-xs text-gray-500">
                                        {t('resent_count') || 'Resent'} {resendCount}/3 {t('times') || 'times'}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Manual Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !isComplete || isExpired}
                        className="btn-primary group w-full"
                    >
                        {loading ? (
                            <div className="loading-spinner"></div>
                        ) : (
                            <>
                                {t('verify_continue') || 'Verify & Continue'}
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="divider"></div>

                    {/* Back to Sign Up */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            {t('wrong_email') || 'Wrong email address?'}{" "}
                            <Link
                                to="/signup"
                                className="text-primary hover:text-primary-dark font-medium"
                            >
                                {t('go_back_signup') || 'Go back to sign up'}
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                        <Mail size={14} />
                        <span>{t('check_spam_folder') || 'Check your spam folder if you don\'t see the email'}</span>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
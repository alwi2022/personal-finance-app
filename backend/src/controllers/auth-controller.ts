const OTP_TEMPLATES = {
  registration: (userName: string, otpCode: string) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verification Code</title>
    </head>
    <body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fff; color: #212529; line-height: 1.5;">
      <div style="max-width: 480px; margin: 0 auto;">
        <img src="https://finance.alwi.tech/assets/image/trending-up.png" alt="Logo" style="width: 80px; margin-bottom: 24px;">
        <h2 style="font-size: 20px; margin-bottom: 12px;">Hello ${userName},</h2>
        <p style="font-size: 15px; margin-bottom: 16px;">Please use the code below to verify your email address:</p>
        <div style="font-size: 26px; font-weight: bold; letter-spacing: 6px; text-align: center; margin: 24px 0;">${otpCode}</div>
        <p style="font-size: 14px; color: #6c757d; margin-bottom: 32px;">This code will expire in 2 minutes. If you did not request this, please ignore the email.</p>
        <p style="font-size: 12px; color: #adb5bd; text-align: left;">This is an automated email, please do not reply.</p>
      </div>
    </body>
    </html>
  `,

  resendRegistration: (userName: string, otpCode: string) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Verification Code</title>
    </head>
    <body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fff; color: #212529; line-height: 1.5;">
      <div style="max-width: 480px; margin: 0 auto;">
        <img src="https://finance.alwi.tech/assets/image/trending-up.png" alt="Logo" style="width: 80px; margin-bottom: 24px;">
        <h2 style="font-size: 20px; margin-bottom: 12px;">Hello ${userName},</h2>
        <p style="font-size: 15px; margin-bottom: 16px;">Here is your new verification code:</p>
        <div style="font-size: 26px; font-weight: bold; letter-spacing: 6px; text-align: center; margin: 24px 0;">${otpCode}</div>
        <p style="font-size: 14px; color: #6c757d; margin-bottom: 32px;">This new code will expire in 2 minutes. If you did not request this, you can ignore this email.</p>
        <p style="font-size: 12px; color: #adb5bd; text-align: left;">This is an automated email, please do not reply.</p>
      </div>
    </body>
    </html>
  `,

  passwordReset: (userName: string, otpCode: string) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Code</title>
    </head>
    <body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fff; color: #212529; line-height: 1.5;">
      <div style="max-width: 480px; margin: 0 auto;">
        <img src="https://finance.alwi.tech/assets/image/trending-up.png" alt="Logo" style="width: 80px; margin-bottom: 24px;">
        <h2 style="font-size: 20px; margin-bottom: 12px;">Hello ${userName},</h2>
        <p style="font-size: 15px; margin-bottom: 16px;">We received a request to reset your password. Use the following code to continue:</p>
        <div style="font-size: 26px; font-weight: bold; letter-spacing: 6px; text-align: center; margin: 24px 0;">${otpCode}</div>
        <p style="font-size: 14px; color: #6c757d; margin-bottom: 32px;">This code will expire in 10 minutes. If you did not request this, you can ignore this email safely.</p>
        <p style="font-size: 12px; color: #adb5bd; text-align: left;">This is an automated email, please do not reply.</p>
      </div>
    </body>
    </html>
  `,

  passwordResetSuccess: (userName: string) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Successful</title>
    </head>
    <body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fff; color: #212529; line-height: 1.5;">
      <div style="max-width: 480px; margin: 0 auto;">
        <img src="https://finance.alwi.tech/assets/image/trending-up.png" alt="Logo" style="width: 80px; margin-bottom: 24px;">
        <h2 style="font-size: 20px; margin-bottom: 12px;">Hi ${userName},</h2>
        <p style="font-size: 15px; margin-bottom: 16px;">Your password has been successfully reset. You can now log in using your new password.</p>
        <p style="font-size: 14px; color: #6c757d; margin-bottom: 32px;">If this wasn't you, please contact our support team immediately.</p>
        <p style="font-size: 12px; color: #adb5bd; text-align: left;">This is an automated email, please do not reply.</p>
      </div>
    </body>
    </html>
  `
};
import UserModel from "../models/user-model";
import { comparePassword, hashPassword } from "../utils/bcrypt.util";
import { signToken } from "../utils/jwt.util";
import nodemailer from "nodemailer";
import OTPModel from "../models/otp-model";
import { Request, Response, RequestHandler } from "express";

export default class AuthController {
  static SendRegisterOTP: RequestHandler = async (req: Request, res: Response) => {
    const { email, fullName } = req.body;

    if (!email || !fullName) {
      res.status(400).json({ message: "Email dan nama lengkap wajib diisi." });
      return;
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email sudah terdaftar." });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTPModel.findOneAndUpdate(
      { email },
      { code: otp, expiredAt: Date.now() + 2 * 60 * 1000, lastSentAt: new Date(), type: "register" },
      { upsert: true }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Personal Finance" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code – Personal Finance",
      html: OTP_TEMPLATES.registration(fullName || "there", otp),
    });


    res.status(200).json({
      success: true,
      message: "OTP has been sent to your email.",
      expiredAt: Date.now() + 2 * 60 * 1000
    });

  };

  static ResendOTP: RequestHandler = async (req: Request, res: Response) => {
    const { email, fullName } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email wajib diisi." });
      return;
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email sudah terdaftar. Silakan login." });
      return;
    }

    const record = await OTPModel.findOne({
      email,
      type: "register"
    });
    if (record && record.lastSentAt && Date.now() - record.lastSentAt.getTime() < 60000) {
      res.status(429).json({ message: "Tunggu 1 menit sebelum mengirim ulang OTP." });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTPModel.findOneAndUpdate(
      { email, type: "register" },
      {
        code: otp,
        expiredAt: Date.now() + 2 * 60 * 1000,
        lastSentAt: new Date(),
        type: "register"
      },
      { upsert: true }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Personal Finance" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code – Personal Finance",
      html: OTP_TEMPLATES.resendRegistration(fullName || "there", otp),
  
    });



    res.status(200).json({ success: true, message: "OTP has been sent to your email.", expiredAt: Date.now() + 2 * 60 * 1000 });
  };

  // ✅ Langkah 2 - Verifikasi OTP dan Buat Akun
  static VerifyRegister: RequestHandler = async (req: Request, res: Response) => {
    const { email, otp, fullName, password, profileImageUrl } = req.body;

    if (!email || !otp || !fullName || !password) {
      res.status(400).json({ message: "Semua data wajib diisi." });
      return;
    }

    const record = await OTPModel.findOne({
      email,
      type: "register"
    });

    if (
      !record ||
      !record.code ||
      !record.expiredAt ||
      record.code !== otp ||
      record.expiredAt.getTime() < Date.now()
    ) {
      res.status(400).json({ message: "OTP tidak valid atau kadaluarsa." });
      return;
    }



    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email sudah terdaftar." });
      return;
    }

    const user = await UserModel.create({
      fullName,
      email,
      password: hashPassword(password),
      profileImageUrl,
    });

    await OTPModel.deleteMany({ email });

    res.status(201).json({
      access_token: signToken({ id: user._id }),
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        profileImageUrl: user.profileImageUrl,
      },
    });
  };

  // ✅ Login biasa
  static Login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });

      if (!user || !comparePassword(password, user.password)) {
        res.status(401).json({ message: "Email atau kata sandi salah." });
        return;
      }

      const access_token = signToken({ id: user._id });
      res.status(200).json({
        access_token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          profileImageUrl: user.profileImageUrl,
        },
      });
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || "Terjadi kesalahan" });
    }
  };

  // ✅ Info user login
  static GetUserInfo: RequestHandler = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?._id;
      const user = await UserModel.findById(userId).select("-password");
      if (!user) {
        res.status(404).json({ message: "User tidak ditemukan" });
        return;
      }
      res.status(200).json({ user });
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || "Terjadi kesalahan" });
    }
  };

  // ✅ Update profile (nama & foto)
  static UpdateProfile: RequestHandler = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?._id;
      const { fullName, profileImageUrl } = req.body;

      if (!fullName) {
        res.status(400).json({ message: "Nama lengkap wajib diisi." });
        return;
      }

      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          fullName,
          profileImageUrl,
        },
        { new: true }
      ).select("-password");

      if (!user) {
        res.status(404).json({ message: "User tidak ditemukan." });
        return;
      }

      res.status(200).json({
        message: "Profile berhasil diperbarui.",
        user,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || "Terjadi kesalahan" });
    }
  };








  // ✅ Forgot Password - Kirim OTP Reset
  static ForgotPassword: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ message: "Email wajib diisi." });
        return;
      }

      // Cek apakah user ada
      const user = await UserModel.findOne({ email });
      if (!user) {
        res.status(404).json({ message: "No account found with this email address" });
        return;
      }

      // Cek rate limit (1 menit)
      const existingOTP = await OTPModel.findOne({
        email,
        type: "reset_password"
      });

      if (existingOTP && existingOTP.lastSentAt && Date.now() - existingOTP.lastSentAt.getTime() < 60000) {
        res.status(429).json({ message: "Tunggu 1 menit sebelum mengirim ulang kode reset." });
        return;
      }

      // Generate OTP 6 digit
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Simpan OTP ke database
      await OTPModel.findOneAndUpdate(
        { email, type: "reset_password" },
        {
          code: otp,
          expiredAt: Date.now() + 10 * 60 * 1000, // 10 menit
          lastSentAt: new Date(),
          type: "reset_password"
        },
        { upsert: true }
      );

      // Kirim email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"Personal Finance" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset Code – Personal Finance",
        html: OTP_TEMPLATES.passwordReset(user.fullName, otp),
      });

      res.status(200).json({
        success: true,
        message: "Password reset code has been sent to your email.",
        expiredAt: Date.now() + 10 * 60 * 1000
      });

    } catch (error: any) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Terjadi kesalahan saat mengirim kode reset." });
    }
  };

  // ✅ Reset Password - Verifikasi OTP dan Update Password
  static ResetPassword: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        res.status(400).json({ message: "Email, kode OTP, dan password baru wajib diisi." });
        return;
      }

      // Validasi password minimal 6 karakter
      if (newPassword.length < 6) {
        res.status(400).json({ message: "Password minimal 6 karakter." });
        return;
      }

      // Cek apakah user ada
      const user = await UserModel.findOne({ email });
      if (!user) {
        res.status(404).json({ message: "User tidak ditemukan." });
        return;
      }

      // Verifikasi OTP
      const otpRecord = await OTPModel.findOne({
        email,
        type: "reset_password"
      });

      if (
        !otpRecord ||
        !otpRecord.code ||
        !otpRecord.expiredAt ||
        otpRecord.code !== otp ||
        otpRecord.expiredAt.getTime() < Date.now()
      ) {
        res.status(400).json({ message: "Kode OTP tidak valid atau sudah kadaluarsa." });
        return;
      }

      // Update password
      await UserModel.findByIdAndUpdate(user._id, {
        password: hashPassword(newPassword)
      });

      // Hapus OTP setelah berhasil
      await OTPModel.deleteOne({ email, type: "reset_password" });

      // Kirim email konfirmasi
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"Personal Finance" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Successfully Reset – Personal Finance",
        html: OTP_TEMPLATES.passwordResetSuccess(user.fullName),
      });

      res.status(200).json({
        success: true,
        message: "Password berhasil direset. Silakan login dengan password baru Anda.",
      });

    } catch (error: any) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Terjadi kesalahan saat reset password." });
    }
  };


}

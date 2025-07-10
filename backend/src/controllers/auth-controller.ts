// ✅ Controller Auth
import UserModel from "../models/user-model";
import { comparePassword, hashPassword } from "../utils/bcrypt.util";
import { signToken } from "../utils/jwt.util";
import nodemailer from "nodemailer";
import OTPModel from "../models/otp-model";
import { Request, Response, RequestHandler } from "express";

export default class AuthController {
  // ✅ Langkah 1 - Kirim OTP
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
      { code: otp, expiredAt: Date.now() + 2 * 60 * 1000, lastSentAt: new Date(),type: "register" },
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
      from: `"Expense Tracker App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code – Expense Tracker App",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 24px; border-radius: 12px; border: 1px solid #e0e0e0;">
          <div style="text-align: center;">
           <img 
  src="https://finance.alwi.tech/assets/image/logo-expanse-tracker.png" 
  alt="Expense Tracker App Logo" 
  style="max-width: 160px; width: 100%; height: auto; display: block; margin: 0 auto 16px; border-radius: 8px;"
/>
            <h1>Expense Tracker App</h1>
            <p style="font-size: 14px; color: #555;">Manage your money better, every day.</p>
          </div>
    
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e0e0e0;" />
    
          <p style="font-size: 15px; color: #333;">Hi <strong>${fullName || "there"}</strong>,</p>
          <p style="font-size: 15px; color: #333;">Here's your <strong>One-Time Password (OTP)</strong> to verify your email and complete your registration:</p>
    
          <div style="background-color: #f3f0ff; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; font-size: 30px; font-weight: bold; color: #3b0764; letter-spacing: 6px;">${otp}</p>
          </div>
    
          <p style="font-size: 14px; color: #666;">
            This code will expire in <strong>2 minutes</strong>. If you didn’t request this, you can safely ignore this email.
          </p>
    
          <br/>
    
          <p style="font-size: 13px; color: #aaa; text-align: right;">
            Regards,<br/>
            Imam Bahri Alwi<br/>
            <em>Developer, Expense Tracker App</em>
          </p>
        </div>
      `,
    });


    res.status(200).json({
      success: true,
      message: "OTP has been sent to your email.",
      expiredAt: Date.now() + 2 * 60 * 1000
    });

  };

  static ResendOTP: RequestHandler = async (req: Request, res: Response) => {
    const { email } = req.body;

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
      from: `"Expense Tracker App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code – Expense Tracker App",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 24px; border-radius: 12px; border: 1px solid #e0e0e0;">
          <div style="text-align: center;">
            <img src="https://finance.alwi.tech/assets/image/logo-expanse-tracker.png" alt="Expense Tracker App Logo"  style="max-width: 160px; width: 100%; height: auto; display: block; margin: 0 auto 16px; border-radius: 8px;"  />
            <h1>Expense Tracker App</h1>
            <p style="font-size: 14px; color: #555;">Manage your money better, every day.</p>
          </div>
    
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e0e0e0;" />
    
          <p style="font-size: 15px; color: #333;">Hi <strong>${req.body.fullName || "there"}</strong>,</p>
          <p style="font-size: 15px; color: #333;">Here's your <strong>One-Time Password (OTP)</strong> to verify your email and complete your registration:</p>
    
          <div style="background-color: #f3f0ff; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; font-size: 30px; font-weight: bold; color: #3b0764; letter-spacing: 6px;">${otp}</p>
          </div>
    
          <p style="font-size: 14px; color: #666;">
            This code will expire in <strong>2 minutes</strong>. If you didn’t request this, you can safely ignore this email.
          </p>
    
          <br/>
    
          <p style="font-size: 13px; color: #aaa; text-align: right;">
            Regards,<br/>
            Imam Bahri Alwi<br/>
            <em>Developer, Expense Tracker App</em>
          </p>
        </div>
      `,
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
      from: `"Expense Tracker App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code – Expense Tracker App",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 24px; border-radius: 12px; border: 1px solid #e0e0e0;">
          <div style="text-align: center;">
            <img 
              src="https://finance.alwi.tech/assets/image/logo-expanse-tracker.png" 
              alt="Expense Tracker App Logo" 
              style="max-width: 160px; width: 100%; height: auto; display: block; margin: 0 auto 16px; border-radius: 8px;"
            />
            <h1>Expense Tracker App</h1>
            <p style="font-size: 14px; color: #555;">Manage your money better, every day.</p>
          </div>
    
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e0e0e0;" />
    
          <p style="font-size: 15px; color: #333;">Hi <strong>${user.fullName}</strong>,</p>
          <p style="font-size: 15px; color: #333;">We received a request to reset your password. Here's your <strong>Password Reset Code</strong>:</p>
    
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; border: 2px solid #f59e0b;">
            <p style="margin: 0; font-size: 30px; font-weight: bold; color: #92400e; letter-spacing: 6px;">${otp}</p>
          </div>
    
          <p style="font-size: 14px; color: #666;">
            This code will expire in <strong>10 minutes</strong>. If you didn't request this password reset, you can safely ignore this email.
          </p>

          <div style="background-color: #fee2e2; padding: 12px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #ef4444;">
            <p style="margin: 0; font-size: 13px; color: #dc2626;">
              <strong>Security Notice:</strong> Never share this code with anyone. Our team will never ask for your reset code.
            </p>
          </div>
    
          <br/>
    
          <p style="font-size: 13px; color: #aaa; text-align: right;">
            Regards,<br/>
            Imam Bahri Alwi<br/>
            <em>Developer, Expense Tracker App</em>
          </p>
        </div>
      `,
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
      from: `"Expense Tracker App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Successfully Reset – Expense Tracker App",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 24px; border-radius: 12px; border: 1px solid #e0e0e0;">
          <div style="text-align: center;">
            <img 
              src="https://finance.alwi.tech/assets/image/logo-expanse-tracker.png" 
              alt="Expense Tracker App Logo" 
              style="max-width: 160px; width: 100%; height: auto; display: block; margin: 0 auto 16px; border-radius: 8px;"
            />
            <h1>Expense Tracker App</h1>
            <p style="font-size: 14px; color: #555;">Manage your money better, every day.</p>
          </div>
    
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e0e0e0;" />
    
          <p style="font-size: 15px; color: #333;">Hi <strong>${user.fullName}</strong>,</p>
          <p style="font-size: 15px; color: #333;">Your password has been successfully reset. You can now log in with your new password.</p>
    
          <div style="background-color: #d1fae5; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; border: 2px solid #10b981;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #065f46;">✅ Password Reset Successful</p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #047857;">Reset completed on ${new Date().toLocaleString('id-ID')}</p>
          </div>
    
          <p style="font-size: 14px; color: #666;">
            If you didn't reset your password, please contact our support team immediately.
          </p>
    
          <br/>
    
          <p style="font-size: 13px; color: #aaa; text-align: right;">
            Regards,<br/>
            Imam Bahri Alwi<br/>
            <em>Developer, Expense Tracker App</em>
          </p>
        </div>
      `,
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

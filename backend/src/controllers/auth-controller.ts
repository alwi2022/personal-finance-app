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
      { code: otp, expiredAt: Date.now() + 2 * 60 * 1000 },
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
            <img src="https://finance.alwi.tech/assets/image/logo-expanse-tracker.png" alt="Expense Tracker App Logo" style="width: 80px; height: 80px; margin-bottom: 16px;" />
            <h1 style="font-size: 20px; color: #3b0764; margin-bottom: 4px;">Expense Tracker App</h1>
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

  // ✅ Langkah 2 - Verifikasi OTP dan Buat Akun
  static VerifyRegister: RequestHandler = async (req: Request, res: Response) => {
    const { email, otp, fullName, password, profileImageUrl } = req.body;

    if (!email || !otp || !fullName || !password) {
      res.status(400).json({ message: "Semua data wajib diisi." });
      return;
    }

    const record = await OTPModel.findOne({ email });

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

    await OTPModel.deleteOne({ email });

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
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
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

    const record = await OTPModel.findOne({ email });
    if (record && record.lastSentAt && Date.now() - record.lastSentAt.getTime() < 60000) {
      res.status(429).json({ message: "Tunggu 1 menit sebelum mengirim ulang OTP." });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTPModel.findOneAndUpdate(
      { email },
      {
        code: otp,
        expiredAt: Date.now() + 2 * 60 * 1000,
        lastSentAt: new Date(),
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
            <img src="https://finance.alwi.tech/assets/image/logo-expanse-tracker.png" alt="Expense Tracker App Logo" style="width: 80px; height: 80px; margin-bottom: 16px;" />
            <h1 style="font-size: 20px; color: #3b0764; margin-bottom: 4px;">Expense Tracker App</h1>
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


}

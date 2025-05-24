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
      { code: otp, expiredAt: Date.now() + 5 * 60 * 1000 },
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
      from: "imamBahrialwi@gmail.com",
      to: email,
      subject: "Kode OTP Pendaftaran",
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Kode OTP Anda</h2>
            <p>Gunakan kode berikut untuk menyelesaikan pendaftaran:</p>
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
              <h1 style="margin: 0; color: #333; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p>Kode ini berlaku selama 1 menit.</p>
          </div>
        `,
    });

    res.status(200).json({ success: true, message: "OTP telah dikirim ke email." });
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
        expiredAt: new Date(Date.now() + 5 * 60 * 1000),
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
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Kode OTP Baru",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Kode OTP Baru</h2>
        <p>Kode OTP baru Anda:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
          <h1 style="margin: 0; color: #333; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>Kode ini berlaku selama 5 menit.</p>
      </div>
    `,
    });

    res.status(200).json({ success: true, message: "OTP baru telah dikirim ke email." });
  };


}

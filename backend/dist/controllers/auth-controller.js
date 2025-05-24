"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user-model"));
const bcrypt_util_1 = require("../utils/bcrypt.util");
const jwt_util_1 = require("../utils/jwt.util");
const nodemailer_1 = __importDefault(require("nodemailer"));
const otp_model_1 = __importDefault(require("../models/otp-model"));
class AuthController {
}
_a = AuthController;
// ✅ Langkah 1 - Kirim OTP
AuthController.SendRegisterOTP = async (req, res) => {
    const { email, fullName } = req.body;
    if (!email || !fullName) {
        res.status(400).json({ message: "Email dan nama lengkap wajib diisi." });
        return;
    }
    const existingUser = await user_model_1.default.findOne({ email });
    if (existingUser) {
        res.status(400).json({ message: "Email sudah terdaftar." });
        return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await otp_model_1.default.findOneAndUpdate({ email }, { code: otp, expiredAt: Date.now() + 5 * 60 * 1000 }, { upsert: true });
    const transporter = nodemailer_1.default.createTransport({
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
            <p>Kode ini berlaku selama 5 menit.</p>
          </div>
        `,
    });
    res.status(200).json({ success: true, message: "OTP telah dikirim ke email." });
};
// ✅ Langkah 2 - Verifikasi OTP dan Buat Akun
AuthController.VerifyRegister = async (req, res) => {
    const { email, otp, fullName, password, profileImageUrl } = req.body;
    if (!email || !otp || !fullName || !password) {
        res.status(400).json({ message: "Semua data wajib diisi." });
        return;
    }
    const record = await otp_model_1.default.findOne({ email });
    if (!record ||
        !record.code ||
        !record.expiredAt ||
        record.code !== otp ||
        record.expiredAt.getTime() < Date.now()) {
        res.status(400).json({ message: "OTP tidak valid atau kadaluarsa." });
        return;
    }
    const existingUser = await user_model_1.default.findOne({ email });
    if (existingUser) {
        res.status(400).json({ message: "Email sudah terdaftar." });
        return;
    }
    const user = await user_model_1.default.create({
        fullName,
        email,
        password: (0, bcrypt_util_1.hashPassword)(password),
        profileImageUrl,
    });
    await otp_model_1.default.deleteOne({ email });
    res.status(201).json({
        access_token: (0, jwt_util_1.signToken)({ id: user._id }),
        user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            profileImageUrl: user.profileImageUrl,
        },
    });
};
// ✅ Login biasa
AuthController.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user || !(0, bcrypt_util_1.comparePassword)(password, user.password)) {
            res.status(401).json({ message: "Email atau kata sandi salah." });
            return;
        }
        const access_token = (0, jwt_util_1.signToken)({ id: user._id });
        res.status(200).json({
            access_token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                profileImageUrl: user.profileImageUrl,
            },
        });
    }
    catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Terjadi kesalahan" });
    }
};
// ✅ Info user login
AuthController.GetUserInfo = async (req, res) => {
    try {
        const userId = req.user?._id;
        const user = await user_model_1.default.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User tidak ditemukan" });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
AuthController.ResendOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: "Email wajib diisi." });
        return;
    }
    const existingUser = await user_model_1.default.findOne({ email });
    if (existingUser) {
        res.status(400).json({ message: "Email sudah terdaftar. Silakan login." });
        return;
    }
    const record = await otp_model_1.default.findOne({ email });
    if (record && record.lastSentAt && Date.now() - record.lastSentAt.getTime() < 60000) {
        res.status(429).json({ message: "Tunggu 1 menit sebelum mengirim ulang OTP." });
        return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await otp_model_1.default.findOneAndUpdate({ email }, {
        code: otp,
        expiredAt: new Date(Date.now() + 5 * 60 * 1000),
        lastSentAt: new Date(),
    }, { upsert: true });
    const transporter = nodemailer_1.default.createTransport({
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
exports.default = AuthController;

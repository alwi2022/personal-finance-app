"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//auth-routes.ts
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth-controller"));
const auth_middleware_1 = require("../middlewares/auth-middleware");
const upload_middleware_1 = __importDefault(require("../middlewares/upload-middleware"));
const router = (0, express_1.Router)();
// ✅ Registrasi dengan OTP
router.post("/register", auth_controller_1.default.SendRegisterOTP); // kirim otp
router.post("/verify-register", auth_controller_1.default.VerifyRegister); // verifikasi & buat akun
router.post("/resend-otp", auth_controller_1.default.ResendOTP);
// ✅ Login biasa
router.post("/login", auth_controller_1.default.Login);
// ✅ Info user login
router.get("/me", auth_middleware_1.authentication, auth_controller_1.default.GetUserInfo);
// ✅ Update profile (nama dan foto)
router.put("/update-profile", auth_middleware_1.authentication, auth_controller_1.default.UpdateProfile);
// ✅ Upload gambar profil
router.post("/upload-image", upload_middleware_1.default.single("image"), (req, res) => {
    console.log("📸 File received:", req.file); // 👈 tambahkan log ini
    if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});
exports.default = router;

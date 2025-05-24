import { Router } from "express";
import AuthController from "../controllers/auth-controller";
import { authentication } from "../middlewares/auth-middleware";
import upload from "../middlewares/upload-middleware";
import { Request, Response } from "express";

const router = Router();

// ✅ Registrasi dengan OTP
router.post("/register", AuthController.SendRegisterOTP); // kirim otp
router.post("/verify-register", AuthController.VerifyRegister); // verifikasi & buat akun
router.post("/resend-otp", AuthController.ResendOTP);


// ✅ Login biasa
router.post("/login", AuthController.Login);

// ✅ Info user login
router.get("/me", authentication, AuthController.GetUserInfo);

// ✅ Upload gambar profil
router.post("/upload-image", upload.single("image"), (req: Request, res: Response): void => {
  console.log("📸 File received:", req.file); // 👈 tambahkan log ini
  if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});


export default router;


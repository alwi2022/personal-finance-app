import AuthController from "../controllers/auth-controller";
import { authentication } from "../middlewares/auth-middleware";
import upload from "../middlewares/upload-middleware";
import { Request, Response } from "express";

import { Router } from "express";


const router = Router();



router.post("/register", AuthController.Register);
router.post("/login", AuthController.Login);
router.get("/me", authentication, AuthController.GetUserInfo);

// ✅ Upload route
router.post("/upload-image", upload.single("image"), (req: Request, res: Response): void => {
    if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});

export default router;
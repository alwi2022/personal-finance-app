"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = __importDefault(require("../controllers/auth-controller"));
const auth_middleware_1 = require("../middlewares/auth-middleware");
const upload_middleware_1 = __importDefault(require("../middlewares/upload-middleware"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.default.Register);
router.post("/login", auth_controller_1.default.Login);
router.get("/me", auth_middleware_1.authentication, auth_controller_1.default.GetUserInfo);
// ✅ Upload route
router.post("/upload-image", upload_middleware_1.default.single("image"), (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});
exports.default = router;

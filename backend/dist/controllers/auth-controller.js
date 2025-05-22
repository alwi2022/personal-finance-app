"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user-model"));
const bcrypt_util_1 = require("../utils/bcrypt.util");
const jwt_util_1 = require("../utils/jwt.util");
class AuthController {
}
_a = AuthController;
AuthController.Register = async (req, res) => {
    try {
        const { fullName, email, password, profileImageUrl } = req.body;
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already exists" });
            return;
        }
        const user = await user_model_1.default.create({
            fullName,
            email,
            password: (0, bcrypt_util_1.hashPassword)(password),
            profileImageUrl,
        });
        res.status(201).json({
            fullName: user.fullName,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            access_token: (0, jwt_util_1.signToken)({ id: user._id }),
        });
    }
    catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
        return;
    }
};
AuthController.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user || !(0, bcrypt_util_1.comparePassword)(password, user.password)) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const access_token = (0, jwt_util_1.signToken)({ id: user._id });
        res.status(200).json({
            id: user._id,
            user,
            access_token
        });
    }
    catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
        return;
    }
};
AuthController.GetUserInfo = async (req, res) => {
    try {
        // Assuming req.user is set by authentication middleware
        const userId = req.user?._id;
        const user = await user_model_1.default.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
};
exports.default = AuthController;

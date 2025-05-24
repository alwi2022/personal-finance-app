"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const zod_1 = require("zod");
exports.registerValidation = zod_1.z.object({
    fullName: zod_1.z.string().min(1, "Full name is required"),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email format"),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters"),
    profileImageUrl: zod_1.z.string().optional(),
});
exports.loginValidation = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email format"),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required"),
});

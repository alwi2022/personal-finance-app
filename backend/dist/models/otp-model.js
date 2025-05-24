"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OTPSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
    expiredAt: { type: Date, required: true },
    lastSentAt: { type: Date, required: true },
});
exports.default = (0, mongoose_1.model)("OTP", OTPSchema);

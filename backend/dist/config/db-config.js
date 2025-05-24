"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri)
            throw new Error("MONGODB_URI is not defined");
        await mongoose_1.default.connect(uri);
        console.log("✅ MongoDB connected");
    }
    catch (error) {
        console.error("❌ Error connecting to MongoDB", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;

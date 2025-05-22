"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI, {});
        console.log("MongoDB connected");
    }
    catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;

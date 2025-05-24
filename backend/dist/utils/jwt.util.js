"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
function signToken(data) {
    const token = jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET);
    return token;
}
function verifyToken(token) {
    const data = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    console.info(data);
    return data;
}

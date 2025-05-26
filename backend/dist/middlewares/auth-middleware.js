"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = authentication;
const user_model_1 = __importDefault(require("../models/user-model"));
const jwt_util_1 = require("../utils/jwt.util");
async function authentication(req, res, next) {
    try {
        const bearerToken = req.headers.authorization;
        if (!bearerToken) {
            throw { name: "Unauthorized", message: "Invalid token" };
        }
        const [_, token] = bearerToken.split(" ");
        if (!token) {
            throw { name: "Unauthorized", message: "Invalid token" };
        }
        const data = (0, jwt_util_1.verifyToken)(token);
        const user = await user_model_1.default.findById(data.id);
        if (!user) {
            throw { name: "Unauthorized", message: "Invalid token" };
        }
        console.info(user);
        req.user = user;
        next();
    }
    catch (err) {
        next(err);
    }
}

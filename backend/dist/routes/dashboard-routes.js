"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = __importDefault(require("../controllers/dashboard-controller"));
const auth_middleware_1 = require("../middlewares/auth-middleware");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authentication, dashboard_controller_1.default.getDashboardData);
exports.default = router;

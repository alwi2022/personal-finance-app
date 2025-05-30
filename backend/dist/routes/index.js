"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//index.ts
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_routes_1 = __importDefault(require("./auth-routes"));
const income_routes_1 = __importDefault(require("./income-routes"));
const expense_routes_1 = __importDefault(require("./expense-routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard-routes"));
router.use("/auth", auth_routes_1.default);
router.use("/income", income_routes_1.default);
router.use("/expense", expense_routes_1.default);
router.use("/dashboard", dashboard_routes_1.default);
exports.default = router;

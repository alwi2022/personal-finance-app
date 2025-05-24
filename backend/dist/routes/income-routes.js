"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const income_controller_1 = __importDefault(require("../controllers/income-controller"));
const router = (0, express_1.Router)();
router.post("/add", auth_middleware_1.authentication, income_controller_1.default.addIncome);
router.get("/get", auth_middleware_1.authentication, income_controller_1.default.getAllIncome);
router.get("/downloadexcel", auth_middleware_1.authentication, income_controller_1.default.downloadExcel);
router.delete("/:id", auth_middleware_1.authentication, income_controller_1.default.deleteIncome);
exports.default = router;

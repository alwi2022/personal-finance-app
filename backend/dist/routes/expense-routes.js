"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const expanse_controller_1 = __importDefault(require("../controllers/expanse-controller"));
const router = (0, express_1.Router)();
router.post("/add", auth_middleware_1.authentication, expanse_controller_1.default.addExpanse);
router.get("/get", auth_middleware_1.authentication, expanse_controller_1.default.getAllExpanse);
router.get("/downloadexcel", auth_middleware_1.authentication, expanse_controller_1.default.downloadExcel);
router.delete("/:id", auth_middleware_1.authentication, expanse_controller_1.default.deleteExpanse);
exports.default = router;

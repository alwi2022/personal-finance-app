"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_config_1 = require("../config/db-config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("../routes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config(); // Load .env first!
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/", routes_1.default);
// === 🧾 Static Files ===
const uploadsDir = path_1.default.resolve(process.cwd(), "uploads");
app.use("/uploads", express_1.default.static(uploadsDir));
console.log("🧾 Serving uploads from:", uploadsDir);
const startServer = async () => {
    await (0, db_config_1.connectDB)();
    app.listen(PORT, () => {
        console.info(`🚀 Server is running on port ${PORT}`);
    });
};
startServer();

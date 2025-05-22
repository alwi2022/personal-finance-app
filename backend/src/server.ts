import dotenv from "dotenv";
import { connectDB } from "./config/db-config";
import express from "express";
import cors from "cors";
import router from "./routes";
import path from "path";


dotenv.config(); // Load .env first!
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/", router)
// === 🧾 Static Files ===
const uploadsDir = path.resolve(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsDir));
console.log("🧾 Serving uploads from:", uploadsDir);



const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.info(`🚀 Server is running on port ${PORT}`);
  });
};

startServer();


import express from "express";
const router = express.Router();
import authRoutes from "./auth-routes";
import incomeRoutes from "./income-routes";
import expenseRoutes from "./expense-routes";
import dashboardRoutes from "./dashboard-routes";




router.use("/auth", authRoutes)
router.use("/income", incomeRoutes)
router.use("/expense", expenseRoutes)
router.use("/dashboard", dashboardRoutes)




export default router;

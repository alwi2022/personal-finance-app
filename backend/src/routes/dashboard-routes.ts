import { Router } from "express";
import DashboardController from "../controllers/dashboard-controller";
import { authentication } from "../middlewares/auth-middleware";

const router = Router();




router.get("/", authentication, DashboardController.getDashboardData)



export default router;

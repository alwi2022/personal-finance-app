
import { Router } from "express";
import { authentication } from "../middlewares/auth-middleware";
import ExpenseController from "../controllers/expanse-controller";

const router = Router();



router.post("/add",authentication,ExpenseController.addExpanse)
router.get("/get",authentication,ExpenseController.getAllExpanse)
router.get("/downloadexcel",authentication,ExpenseController.downloadExcel)
router.delete("/:id",authentication,ExpenseController.deleteExpanse)

export default router;

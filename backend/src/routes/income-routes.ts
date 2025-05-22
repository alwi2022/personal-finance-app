
import { Router } from "express";
import { authentication } from "../middlewares/auth-middleware";
import IncomeController from "../controllers/income-controller";

const router = Router();



router.post("/add", authentication, IncomeController.addIncome)
router.get("/get", authentication, IncomeController.getAllIncome)
router.get("/downloadexcel", authentication, IncomeController.downloadExcel)
router.delete("/:id", authentication, IncomeController.deleteIncome)

export default router;

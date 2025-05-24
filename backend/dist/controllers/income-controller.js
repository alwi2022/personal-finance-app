"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const income_model_1 = __importDefault(require("../models/income-model"));
const xlsx_1 = __importDefault(require("xlsx"));
class IncomeController {
}
_a = IncomeController;
IncomeController.addIncome = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { icon, source, amount, date } = req.body;
        if (!source || !amount || !date) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const newIncome = new income_model_1.default({ userId, icon, source, amount, date: new Date(date) });
        await newIncome.save();
        res.status(201).json(newIncome);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
IncomeController.getAllIncome = async (req, res) => {
    try {
        const userId = req.user?._id;
        const incomes = await income_model_1.default.find({ userId }).sort({ date: -1 });
        res.status(200).json(incomes);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
IncomeController.downloadExcel = async (req, res) => {
    const userId = req.user?._id;
    try {
        const incomes = await income_model_1.default.find({ userId }).sort({ date: -1 });
        const data = incomes.map((income) => ({
            source: income.source,
            amount: income.amount,
            date: income.date
        }));
        const wb = xlsx_1.default.utils.book_new();
        const ws = xlsx_1.default.utils.json_to_sheet(data);
        xlsx_1.default.utils.book_append_sheet(wb, ws, "Incomes");
        xlsx_1.default.writeFile(wb, "income_details.xlsx");
        res.download("income_details.xlsx");
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
IncomeController.deleteIncome = async (req, res) => {
    try {
        await income_model_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Income deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.default = IncomeController;

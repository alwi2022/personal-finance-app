"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const expanse_model_1 = __importDefault(require("../models/expanse-model"));
const xlsx_1 = __importDefault(require("xlsx"));
class ExpenseController {
}
_a = ExpenseController;
ExpenseController.addExpanse = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { category, amount, date } = req.body;
        if (!category || !amount || !date) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const newExpanse = new expanse_model_1.default({ userId, category, amount, date: new Date(date) });
        await newExpanse.save();
        res.status(201).json(newExpanse);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
ExpenseController.getAllExpanse = async (req, res) => {
    try {
        const userId = req.user?._id;
        const Expenses = await expanse_model_1.default.find({ userId }).sort({ date: -1 });
        res.status(200).json(Expenses);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
ExpenseController.downloadExcel = async (req, res) => {
    const userId = req.user?._id;
    try {
        const Expenses = await expanse_model_1.default.find({ userId }).sort({ date: -1 });
        const data = Expenses.map((Expanse) => ({
            category: Expanse.category,
            amount: Expanse.amount,
            date: Expanse.date
        }));
        const wb = xlsx_1.default.utils.book_new();
        const ws = xlsx_1.default.utils.json_to_sheet(data);
        xlsx_1.default.utils.book_append_sheet(wb, ws, "Expenses");
        xlsx_1.default.writeFile(wb, "Expanse_details.xlsx");
        res.download("Expanse_details.xlsx");
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
ExpenseController.deleteExpanse = async (req, res) => {
    try {
        await expanse_model_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Expanse deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.default = ExpenseController;

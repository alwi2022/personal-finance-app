"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const income_model_1 = __importDefault(require("../models/income-model"));
const expanse_model_1 = __importDefault(require("../models/expanse-model"));
const mongoose_1 = require("mongoose");
class DashboardController {
}
_a = DashboardController;
DashboardController.getDashboardData = async (req, res) => {
    const userId = req.user?._id;
    if (!(0, mongoose_1.isValidObjectId)(userId)) {
        res.status(400).json({ message: "Invalid user ID" });
        return;
    }
    const userObjectId = new mongoose_1.Types.ObjectId(userId);
    try {
        const totalIncome = await income_model_1.default.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const totalExpense = await expanse_model_1.default.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const incomeLast60Days = await income_model_1.default.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });
        const incomeLast60DaysTotal = incomeLast60Days.reduce((sum, txn) => sum + txn.amount, 0);
        const expenseLast30Days = await expanse_model_1.default.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });
        const expenseLast30DaysTotal = expenseLast30Days.reduce((sum, txn) => sum + txn.amount, 0);
        const recentIncome = await income_model_1.default.find({ userId: userObjectId })
            .sort({ date: -1 })
            .limit(5);
        const recentExpense = await expanse_model_1.default.find({ userId: userObjectId })
            .sort({ date: -1 })
            .limit(5);
        const recentTransactions = [
            ...recentIncome.map((txn) => ({ ...txn.toObject(), type: "income" })),
            ...recentExpense.map((txn) => ({ ...txn.toObject(), type: "expense" })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        res.json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            expenseLast30Days: {
                total: expenseLast30DaysTotal,
                transactions: expenseLast30Days,
            },
            incomeLast60Days: {
                total: incomeLast60DaysTotal,
                transactions: incomeLast60Days,
            },
            recentTransactions,
        });
    }
    catch (error) {
        console.log(error, "error");
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.default = DashboardController;

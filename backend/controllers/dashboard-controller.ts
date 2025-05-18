import { RequestHandler, Request, Response } from "express";
import IncomeModel from "../model/income-model";
import ExpenseModel from "../model/expanse-model";
import { isValidObjectId, Types } from "mongoose";

export default class DashboardController {
  static getDashboardData: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?._id;

    if (!isValidObjectId(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const userObjectId = new Types.ObjectId(userId);

    try {
      const totalIncome = await IncomeModel.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const totalExpense = await ExpenseModel.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const incomeLast60Days = await IncomeModel.find({
        userId: userObjectId,
        date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      }).sort({ date: -1 });

      const incomeLast60DaysTotal = incomeLast60Days.reduce((sum, txn) => sum + txn.amount, 0);

      const expenseLast30Days = await ExpenseModel.find({
        userId: userObjectId,
        date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }).sort({ date: -1 });

      const expenseLast30DaysTotal = expenseLast30Days.reduce((sum, txn) => sum + txn.amount, 0);

      const recentIncome = await IncomeModel.find({ userId: userObjectId })
        .sort({ date: -1 })
        .limit(5);
      const recentExpense = await ExpenseModel.find({ userId: userObjectId })
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
    } catch (error) {
      console.log(error,"error")
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

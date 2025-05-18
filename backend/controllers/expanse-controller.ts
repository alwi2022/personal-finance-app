

import { Request, Response, RequestHandler } from "express";
import ExpanseModel from "../model/expanse-model";

import xlsx from "xlsx";

export default class ExpenseController {
    static addExpanse: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {

            const userId = (req as any).user?._id;
            const { icon, category, amount, date } = req.body

            if (!category || !amount || !date) {
                res.status(400).json({ message: "All fields are required" })
                return
            }

            const newExpanse = new ExpanseModel({ userId, icon, category, amount, date: new Date(date) })
            await newExpanse.save()


            res.status(201).json(newExpanse)

        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    static getAllExpanse: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?._id;
            const Expenses = await ExpanseModel.find({ userId }).sort({ date: -1 })
            res.status(200).json(Expenses)

        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })

        }
    }

    static downloadExcel: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const userId = (req as any).user?._id;
        try {
            const Expenses = await ExpanseModel.find({ userId }).sort({ date: -1 })
            const data = Expenses.map((Expanse) => ({
                category: Expanse.category,
                amount: Expanse.amount,
                date: Expanse.date
            }))
            const wb = xlsx.utils.book_new()
            const ws = xlsx.utils.json_to_sheet(data)
            xlsx.utils.book_append_sheet(wb, ws, "Expenses")
            xlsx.writeFile(wb, "Expanse_details.xlsx")
            res.download("Expanse_details.xlsx")


        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    static deleteExpanse: RequestHandler = async (req: Request, res: Response): Promise<void> => {

        try {
            await ExpanseModel.findByIdAndDelete(req.params.id)
            res.status(200).json({ message: "Expanse deleted successfully" })
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

}
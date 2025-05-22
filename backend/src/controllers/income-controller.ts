
import { Request, Response, RequestHandler } from "express";
import IncomeModel from "../models/income-model";

import xlsx from "xlsx";

export default class IncomeController {

    static addIncome: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {

            const userId = (req as any).user?._id;
            const { icon, source, amount, date } = req.body
            if (!source || !amount || !date) {
                res.status(400).json({ message: "All fields are required" })
                return
            }

            const newIncome = new IncomeModel({ userId, icon, source, amount, date: new Date(date) })
            await newIncome.save()


            res.status(201).json(newIncome)

        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    static getAllIncome: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?._id;
            const incomes = await IncomeModel.find({ userId }).sort({ date: -1 })
            res.status(200).json(incomes)

        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })

        }
    }

    static downloadExcel: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const userId = (req as any).user?._id;
        try {
            const incomes = await IncomeModel.find({ userId }).sort({ date: -1 })
            const data = incomes.map((income) => ({
                source: income.source,
                amount: income.amount,
                date: income.date
            }))
            const wb = xlsx.utils.book_new()
            const ws = xlsx.utils.json_to_sheet(data)
            xlsx.utils.book_append_sheet(wb, ws, "Incomes")
            xlsx.writeFile(wb, "income_details.xlsx")
            res.download("income_details.xlsx")
           

        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    static deleteIncome: RequestHandler = async (req: Request, res: Response): Promise<void> => {

        try {
            await IncomeModel.findByIdAndDelete(req.params.id)
            res.status(200).json({ message: "Income deleted successfully" })
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

}




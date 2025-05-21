import { useEffect } from "react";
import { useState } from "react";
import { prepareExpanseLineChartData } from "../../utils/helper";
import { LuPlus } from "react-icons/lu";
import CustomLineChart from "../Charts/CustomLineChart";

const ExpenseOverview = ({ transactions, onExpanseIncome }: { transactions: any, onExpanseIncome: () => void }) => {
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        const result = prepareExpanseLineChartData(transactions);
        setChartData(result);
    }, [transactions]);

    return (
        <div className="card">
            <div className="flex justify-between items-center">
                <div>
                    <h5 className="text-lg ">Expense Overview</h5>
                    <p className="text-sm text-gray-500 mt-0.5">Track your spending trends over time and gain insights into your spending habits.</p>
                </div>
                <button className="add-btn" onClick={onExpanseIncome}><LuPlus className="text-lg" /> Add Expense</button>

            </div>
            <div className="mt-10">
                <CustomLineChart data={chartData} />
            </div>
        </div>
    )
}
export default ExpenseOverview; 
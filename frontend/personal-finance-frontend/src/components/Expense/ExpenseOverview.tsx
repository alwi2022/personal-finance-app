import { useEffect } from "react";
import { useState } from "react";
import { prepareExpanseLineChartData } from "../../utils/helper";
import { LuPlus } from "react-icons/lu";
import CustomLineChart from "../Charts/CustomLineChart";
import { useSettings } from "../../context/settingsContext";
const ExpenseOverview = ({ transactions, onExpanseIncome }: { transactions: any, onExpanseIncome: () => void }) => {
    const { t } = useSettings();
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        const result = prepareExpanseLineChartData(transactions);
        setChartData(result);
    }, [transactions]);

    return (
        <div className="card">
            <div className="flex justify-between items-center">
                <div>
                    <h5 className="text-lg ">{t('expense_overview')}</h5>
                    <p className="text-sm text-gray-500 mt-0.5">{t('expense_overview_description')}</p>
                </div>
                <button className="add-btn" onClick={onExpanseIncome}><LuPlus className="text-lg" /> {t('add_expense')}</button>

            </div>
            <div className="mt-10">
                <CustomLineChart data={chartData} />
            </div>
        </div>
    )
}
export default ExpenseOverview; 
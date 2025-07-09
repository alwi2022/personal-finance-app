//src/components/Dashboard/Last30DaysExpenseChart.tsx
import { useEffect, useState } from "react";
import type { TypeTransaction } from "../../types/type";
import { prepareBarExpenseChartData } from "../../utils/helper";
import CustomBarChart from "../Charts/CustomBarChart";

type Props = {
  transactions: TypeTransaction[];
  onSeeMore: () => void;

};


const Last30DaysExpenseChart = ({ transactions, onSeeMore }: Props) => {
  const [chartData, setChartData] = useState<{ month: string; amount: number; category?: string }[]>([]);

  useEffect(() => {
    const result = prepareBarExpenseChartData(transactions);
    setChartData(result);
  }, [transactions]);


  return (
    <div className="card p-4 rounded-xl shadow-sm border bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">
          Last 30 Days Expense
        </h2>
        <button
          onClick={onSeeMore}
          className="text-sm text-primary hover:underline"
        >
          See More
        </button>
      </div>

      {chartData.length > 0 ? (
        <CustomBarChart data={chartData} />
      ) : (
        <div className="h-40 flex items-center justify-center text-gray-400">
          No expense data in the last 30 days.
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600 ">
        Total Transactions: {transactions.length}
      </div>
    </div>
  );
};

export default Last30DaysExpenseChart;

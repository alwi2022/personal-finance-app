import { useEffect, useState } from "react";
import { useSettings } from "../../context/settingsContext";
import type { TypeTransaction } from "../../types/type";
import { prepareBarExpenseChartData } from "../../utils/helper";
import CustomBarChart from "../Charts/CustomBarChart";

interface Last30DaysExpenseChartProps {
  transactions: TypeTransaction[];
  onSeeMore: () => void;
}

const Last30DaysExpenseChart = ({ transactions, onSeeMore }: Last30DaysExpenseChartProps) => {
  const { t } = useSettings();
  const [chartData, setChartData] = useState<{ month: string; amount: number; category?: string }[]>([]);

  useEffect(() => {
    const result = prepareBarExpenseChartData(transactions);
    setChartData(result);
  }, [transactions]);

  return (
    <div className="card p-4 rounded-xl shadow-sm border bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">
          {t('last_30_days_expense')}
        </h2>
        <button
          onClick={onSeeMore}
          className="text-sm text-primary hover:underline"
        >
          {t('see_more')}
        </button>
      </div>

      {chartData.length > 0 ? (
        <CustomBarChart data={chartData} />
      ) : (
        <div className="h-40 flex items-center justify-center text-gray-400">
          {t('no_expense_data_30_days')}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        {t('total_transactions_count', { count: transactions.length })}
      </div>
    </div>
  );
};

export default Last30DaysExpenseChart;
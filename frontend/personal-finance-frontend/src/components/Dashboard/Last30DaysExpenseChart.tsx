import { useEffect, useState } from "react";
import { useSettings } from "../../context/settingsContext";
import type { TypeTransaction } from "../../types/type";
import { prepareBarExpenseChartData } from "../../utils/helper";
import CustomBarChart from "../Charts/CustomBarChart";

// Extended interface to match what comes from Home.tsx
interface ExtendedTransaction extends TypeTransaction {
  displayAmount?: number;
  name?: string;
  type?: 'income' | 'expense';
}

interface Last30DaysExpenseChartProps {
  transactions: ExtendedTransaction[];
  onSeeMore: () => void;
}

const Last30DaysExpenseChart = ({ transactions, onSeeMore }: Last30DaysExpenseChartProps) => {
  const { t, currency, exchangeRate } = useSettings();
  const [chartData, setChartData] = useState<{ month: string; amount: number; category?: string }[]>([]);

  // Helper function to get display amount (use processed displayAmount from Home.tsx)
  const getDisplayAmount = (transaction: ExtendedTransaction): number => {
    // Use pre-calculated displayAmount from Home.tsx if available
    if (transaction.displayAmount !== undefined) {
      return transaction.displayAmount;
    }
    
    // Fallback logic for backward compatibility
    if (transaction.currency && transaction.amountUSD !== undefined) {
      // Convert from stored data to current display preference
      if (currency === 'USD') {
        return transaction.amountUSD;
      } else {
        return transaction.amountUSD * exchangeRate;
      }
    }
    
    // Legacy data - assume it's already in the right currency from backend
    return transaction.amount;
  };

  useEffect(() => {
    // Process transactions to use display amounts for chart
    const processedTransactions = transactions.map(transaction => ({
      ...transaction,
      amount: getDisplayAmount(transaction) // Override amount with display amount
    }));
    
    const result = prepareBarExpenseChartData(processedTransactions);
    setChartData(result);
  }, [transactions, currency]); // Re-process when currency changes

  return (
    <div className="card p-4 rounded-xl shadow-sm border bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">
          {t('last_30_days_expense') || 'Pengeluaran 30 Hari Terakhir'}
        </h2>
        <button
          onClick={onSeeMore}
          className="text-sm text-primary hover:underline"
        >
          {t('see_more') || 'Lihat Selengkapnya'}
        </button>
      </div>

      {chartData.length > 0 ? (
        <CustomBarChart data={chartData} />
      ) : (
        <div className="h-40 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-sm mb-1">
              {t('no_expense_data_30_days') || 'Tidak ada data pengeluaran dalam 30 hari terakhir.'}
            </p>
            <p className="text-xs">
              {t('total_transactions') || 'Total Transaksi'}: {transactions.length}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        {t('total_transactions') || 'Total Transaksi'}: {transactions.length} 
        {currency && (
          <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
            {t('currency') || 'Mata Uang'}: {currency}
          </span>
        )}
      </div>
    </div>
  );
};

export default Last30DaysExpenseChart;
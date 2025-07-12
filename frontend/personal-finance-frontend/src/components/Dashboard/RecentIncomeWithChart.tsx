import { useEffect, useState } from "react";
import { PieChart, TrendingUp, DollarSign, Target } from "lucide-react";
import { useSettings } from "../../context/settingsContext";
import CustomPieChart from "../Charts/CustomPieChart";

// Updated interface to match backend transaction structure
interface Transaction { 
  _id: string;
  userId: string;
  category: string;
  source: string;
  amount: number;
  currency?: 'USD' | 'IDR';
  amountUSD?: number;
  exchangeRate?: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  type?: 'income' | 'expense';
  displayAmount?: number; // Added from Home.tsx processing
  name?: string; // For chart compatibility
}

interface RecentIncomeWithChartProps {
  transactions: Transaction[];
  totalIncome: number;
}

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

const RecentIncomeWithChart = ({
  transactions,
  totalIncome,
}: RecentIncomeWithChartProps) => {
  const { t, formatCurrency, currency } = useSettings();
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const dataArr = transactions.map((item) => ({
      name: item.source, // Use source as name for chart
      amount: item.displayAmount || item.amount, // Use displayAmount if available
      source: item.source,
      category: item.category,
      type: item.type || 'income',
      _id: item._id,
      date: item.date
    }));
    setChartData(dataArr);
  }, [transactions]);

  // Calculate income statistics using displayAmount when available
  const getTransactionAmount = (transaction: Transaction): number => {
    return transaction.displayAmount || transaction.amount;
  };

  const averageIncome = transactions.length > 0 ? totalIncome / transactions.length : 0;
  const highestIncome = transactions.reduce((max, item) => {
    const amount = getTransactionAmount(item);
    return amount > max ? amount : max;
  }, 0);
  
  const topSource = transactions.reduce((max, item) => {
    const amount = getTransactionAmount(item);
    return amount > getTransactionAmount(max) ? item : max;
  }, { source: t('not_available') || 'N/A', amount: 0, displayAmount: 0 } as Transaction);

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <PieChart size={18} className="text-green-600" />
          </div>
          <div>
            <h2 className="card-title">
              {t('last_60_days_income') || 'Pemasukan 60 Hari Terakhir'}
            </h2>
            <p className="card-subtitle">
              {t('income_breakdown_by_source') || 'Rincian pemasukan berdasarkan sumber'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
            <TrendingUp size={16} />
            <span className="text-xs font-medium">{t('total') || 'Total'}</span>
          </div>
          <p className="text-lg font-bold text-green-900">
            {formatCurrency(totalIncome, currency)}
          </p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
            <DollarSign size={16} />
            <span className="text-xs font-medium">{t('average') || 'Rata-rata'}</span>
          </div>
          <p className="text-lg font-bold text-blue-900">
            {formatCurrency(averageIncome, currency)}
          </p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
            <Target size={16} />
            <span className="text-xs font-medium">{t('highest') || 'Tertinggi'}</span>
          </div>
          <p className="text-lg font-bold text-purple-900">
            {formatCurrency(highestIncome, currency)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="card-content">
        {chartData.length > 0 ? (
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Pie Chart */}
            <div className="flex-1">
              <CustomPieChart
                data={chartData}
                label={t('total_income') || 'Total Pemasukan'}
                totalAmount={totalIncome}
                showTextAnchors={true}
                colors={COLORS}
              />
            </div>

            {/* Income Sources */}
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">
                {t('income_sources') || 'Sumber Pemasukan'}
              </h3>
              {chartData.map((item, index) => (
                <IncomeSourceItem
                  key={item._id}
                  source={item.source}
                  amount={item.amount}
                  percentage={totalIncome > 0 ? (item.amount / totalIncome) * 100 : 0}
                  color={COLORS[index % COLORS.length]}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <PieChart size={20} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">
              {t('no_income_data') || 'Tidak ada data pemasukan'}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {t('add_income_sources_to_see_breakdown') || 'Tambahkan sumber pemasukan untuk melihat rincian'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="card-footer">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>
              {t('top_source') || 'Sumber Teratas'}: {topSource.source}
            </span>
          </div>
          <div className="text-gray-500">
            {transactions.length} {t('income_sources') || 'sumber pemasukan'}
          </div>
        </div>
      </div>
    </div>
  );
};

// Income Source Item Component
interface IncomeSourceItemProps {
  source: string;
  amount: number;
  percentage: number;
  color: string;
}

const IncomeSourceItem = ({ source, amount, percentage, color }: IncomeSourceItemProps) => {
  const { t, formatCurrency, currency } = useSettings();
  
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
        <div>
          <p className="font-medium text-gray-900 text-sm">{source}</p>
          <p className="text-xs text-gray-500">
            {percentage.toFixed(1)}% {t('of_total') || 'dari total'}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-green-600">
          {formatCurrency(amount, currency)}
        </p>
      </div>
    </div>
  );
};

export default RecentIncomeWithChart;
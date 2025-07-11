import { useEffect, useState } from "react";
import { PieChart, TrendingUp, DollarSign, Target } from "lucide-react";
import { useSettings } from "../../context/settingsContext";
import CustomPieChart from "../Charts/CustomPieChart";

interface Transaction { 
  source: string;
  amount: number;
  name: string;
  category: string;
  type: string;
  _id: string;
  date: Date;
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
  const { t, formatCurrency } = useSettings();
  const [chartData, setChartData] = useState<Transaction[]>([]);

  useEffect(() => {
    const dataArr = transactions.map((item) => ({
      name: item.source,
      amount: item.amount,
      source: item.source,
      category: item.category,
      type: item.type,
      _id: item._id,
      date: item.date
    }));
    setChartData(dataArr);
  }, [transactions]);

  // Calculate income statistics
  const averageIncome = transactions.length > 0 ? totalIncome / transactions.length : 0;
  const highestIncome = transactions.reduce((max, item) => 
    item.amount > max ? item.amount : max, 0);
  const topSource = transactions.reduce((max, item) => 
    item.amount > max.amount ? item : max, { source: t('not_available'), amount: 0 });

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <PieChart size={18} className="text-green-600" />
          </div>
          <div>
            <h2 className="card-title">{t('last_60_days_income')}</h2>
            <p className="card-subtitle">
              {t('income_breakdown_by_source')}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
            <TrendingUp size={16} />
            <span className="text-xs font-medium">{t('total')}</span>
          </div>
          <p className="text-lg font-bold text-green-900">
            {formatCurrency(totalIncome)}
          </p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
            <DollarSign size={16} />
            <span className="text-xs font-medium">{t('average')}</span>
          </div>
          <p className="text-lg font-bold text-blue-900">
            {formatCurrency(averageIncome)}
          </p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
            <Target size={16} />
            <span className="text-xs font-medium">{t('highest')}</span>
          </div>
          <p className="text-lg font-bold text-purple-900">
            {formatCurrency(highestIncome)}
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
                label={t('total_income')}
                totalAmount={totalIncome}
                showTextAnchors={true}
                colors={COLORS}
              />
            </div>

            {/* Income Sources */}
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">{t('income_sources')}</h3>
              {chartData.map((item, index) => (
                <IncomeSourceItem
                  key={item._id}
                  source={item.source}
                  amount={item.amount}
                  percentage={(item.amount / totalIncome) * 100}
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
            <p className="text-gray-500 text-sm">{t('no_income_data')}</p>
            <p className="text-gray-400 text-xs mt-1">{t('add_income_sources_to_see_breakdown')}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="card-footer">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{t('top_source')}: {topSource.source}</span>
          </div>
          <div className="text-gray-500">
            {t('income_streams_count', { count: transactions.length })}
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
  const { t, formatCurrency } = useSettings();
  
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
            {percentage.toFixed(1)}% {t('of_total')}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-green-600">
          {formatCurrency(amount)}
        </p>
      </div>
    </div>
  );
};

export default RecentIncomeWithChart;
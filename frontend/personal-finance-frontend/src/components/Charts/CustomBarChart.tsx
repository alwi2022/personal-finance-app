import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { TrendingUp, BarChart3, TrendingDown } from "lucide-react";
import { useSettings } from "../../context/settingsContext";

interface BarChartData {
  month: string;
  amount: number;
  category?: string;
}

interface CustomBarChartProps {
  data: BarChartData[];
}

const CustomBarChart = ({ data }: CustomBarChartProps) => {
  const { t, formatCurrency, currency } = useSettings();
  
  // Calculate statistics
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const averageAmount = data.length > 0 ? totalAmount / data.length : 0;
  const maxAmount = Math.max(...data.map(item => item.amount));
  const minAmount = Math.min(...data.map(item => item.amount));

  // Dynamic bar colors based on amount (for expenses - higher is more concerning)
  const getBarColor = (amount: number) => {
    if (maxAmount === 0) return "#ef4444"; // Fallback color
    
    const percentage = (amount / maxAmount) * 100;
    if (percentage >= 75) return "#ef4444"; // High expense - red (concerning)
    if (percentage >= 50) return "#f59e0b"; // Medium expense - orange  
    if (percentage >= 25) return "#3b82f6"; // Low expense - blue
    return "#10b981"; // Very low expense - green (good)
  };
  
  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <p className="text-sm font-semibold text-gray-800">{label}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-600">
              {t('amount') || 'Jumlah'}: <span className="font-medium">{formatCurrency(data.amount, currency)}</span>
            </p>
            {data.category && (
              <p className="text-xs text-gray-600">
                {t('category') || 'Kategori'}: <span className="font-medium">{data.category}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis values
  const formatYAxisValue = (value: number) => {
    return formatCurrency(value, currency);
  };

  return (
    <div className="w-full">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
            <BarChart3 size={16} />
            <span className="text-xs font-medium">{t('total') || 'Total'}</span>
          </div>
          <p className="text-lg font-bold text-blue-900">
            {formatCurrency(totalAmount, currency)}
          </p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
            <TrendingUp size={16} />
            <span className="text-xs font-medium">{t('average') || 'Rata-rata'}</span>
          </div>
          <p className="text-lg font-bold text-green-900">
            {formatCurrency(averageAmount, currency)}
          </p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
            <TrendingUp size={16} />
            <span className="text-xs font-medium">{t('highest') || 'Tertinggi'}</span>
          </div>
          <p className="text-lg font-bold text-red-900">
            {formatCurrency(maxAmount, currency)}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
            <TrendingDown size={16} />
            <span className="text-xs font-medium">{t('lowest') || 'Terendah'}</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(minAmount, currency)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: "#6b7280" }}
                stroke="#e5e7eb"
                tickLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "#6b7280" }}
                stroke="#e5e7eb"
                tickLine={{ stroke: "#e5e7eb" }}
                tickFormatter={formatYAxisValue}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.amount)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600">{t('chart_level_high') || 'Tinggi'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-600">{t('chart_level_medium') || 'Sedang'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">{t('chart_level_low') || 'Rendah'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">{t('chart_level_very_low') || 'Sangat Rendah'}</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {t('showing_data_points')} {data.length} 
          </span>
          <span className="text-gray-500">
            {t('range')}: {formatCurrency(minAmount, currency)} - {formatCurrency(maxAmount, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomBarChart;
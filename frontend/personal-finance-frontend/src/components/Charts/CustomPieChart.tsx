import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import { useSettings } from "../../context/settingsContext";

interface ChartItem {
  name: string;
  amount: number;
  color?: string;
}

interface CustomPieChartProps {
  data: ChartItem[];
  label: string;
  colors: string[];
  showTextAnchors: boolean;
  totalAmount: number;
}

const CustomPieChart = ({
  data,
  label,
  colors,
  showTextAnchors,
  totalAmount,
}: CustomPieChartProps) => {
  const { formatCurrency, currency } = useSettings();

  return (
    <div className="w-full h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="amount"
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
              />
            ))}
          </Pie>
          <Tooltip 
            content={<CustomTooltip />} 
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Middle content in chart */}
      {showTextAnchors && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 mb-1">
              {label}
            </div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(totalAmount, currency)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPieChart;
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

interface ChartItem {
  name: string;
  amount: number;
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
  return (
    <div className="relative w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={130}
            innerRadius={100}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* 👇 Middle content in chart */}
      {showTextAnchors && (
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-lg font-semibold text-gray-800">
            Rp {totalAmount.toLocaleString("id-ID")}
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomPieChart;

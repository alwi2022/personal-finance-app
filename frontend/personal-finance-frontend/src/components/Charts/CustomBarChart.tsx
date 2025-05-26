import {
    Bar,
    BarChart,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Cell,
    ResponsiveContainer,
    CartesianGrid,
  } from "recharts";
  
  import CustomLegend from "./CustomLegend";
  
  const CustomBarChart = ({ data }: { data: any[] }) => {
    const getBarColor = (index: number) => {
      return index % 2 === 0 ? "#875cf5" : "#cfbefb";
    };
  
    const CustomTooltip = ({
      active,
      payload,
    }: {
      active?: boolean;
      payload?: any[];
    }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white p-2 rounded-md border border-gray-300">
            <p className="text-xs font-semibold text-purple-800 mb-1">
            Amount:{" "}
            </p>
            <p className="text-sm text-gray-600">
              Amount:
              <span className="font-medium text-sm text-gray-800">
              Rp {payload[0].payload.amount.toLocaleString("id-ID")}
              </span>
            </p>
          </div>
        );
      }
      return null;
    };
  
    return (
      <div className="bg-white mt-6 p-4 rounded-lg shadow-sm">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#555" }}
              stroke="none"
            />
            <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
              {data.map(( index) => (
                <Cell key={`${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default CustomBarChart;
  
import { useEffect, useState } from "react";
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RecentIncomeWithChart = ({
  transactions,
  totalIncome,
}: RecentIncomeWithChartProps) => {
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

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold ">Last 60 Days Income</h2>
      </div>
      <CustomPieChart
        data={chartData}
        label="Total Income"
        totalAmount={totalIncome}

        showTextAnchors={true}
        colors={COLORS}
      />
    </div>
  );
};

export default RecentIncomeWithChart;

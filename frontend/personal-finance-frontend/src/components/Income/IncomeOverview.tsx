import React, { useState, useEffect } from "react";
import type { TypeTransaction } from "../../types/type";
import { prepareIncomeBarChartData } from "../../utils/helper";
import CustomBarChart from "../Charts/CustomBarChart";

interface Props {
  transactions: TypeTransaction[];
  onAddIncome: () => void;
}

const IncomeOverview: React.FC<Props> = ({ transactions, onAddIncome }) => {
  const [chartData, setChartData] = useState<
    { month: string; amount: number; source?: string }[]
  >([]);

  useEffect(() => {
    setChartData(prepareIncomeBarChartData(transactions));
  }, [transactions]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h5 className="text-lg font-semibold text-gray-800">Income Overview</h5>
          <p className="text-sm text-gray-500">
            Track your earnings over time and analyze your income trends.
          </p>
        </div>
        <button
          className="add-btn transition hover:bg-primary hover:text-white"
          onClick={onAddIncome}
        >
          Add Income
        </button>
      </div>

      <div className="mt-6">
        <CustomBarChart data={chartData} />
      </div>
    </div>
  );
};

export default IncomeOverview;

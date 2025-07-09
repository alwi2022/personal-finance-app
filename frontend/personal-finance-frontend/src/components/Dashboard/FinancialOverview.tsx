import { PieChart, TrendingUp, TrendingDown, DollarSign, Calculator } from "lucide-react";
import CustomPieChart from "../Charts/CustomPieChart";

interface FinancialOverviewProps {
    totalBalance: number;
    totalIncome: number;
    totalExpense: number;
}

const COLORS = ["#6366f1", "#ef4444", "#22c55e"]; // Primary, Red, Green

const FinancialOverview = ({ totalBalance, totalIncome, totalExpense }: FinancialOverviewProps) => {
    // Calculate financial ratios
    const expenseRatio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
    const savingsRatio = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    const netFlow = totalIncome - totalExpense;

    const balanceData = [
        {
            name: "Total Balance",
            amount: totalBalance,
            color: COLORS[0],
        },
        {
            name: "Total Expense",
            amount: totalExpense,
            color: COLORS[1],
        },
        {
            name: "Total Income",
            amount: totalIncome,
            color: COLORS[2],
        },
    ];

    // Financial health status
    const getHealthStatus = () => {
        if (expenseRatio < 50) return { status: "Excellent", color: "text-green-600", bg: "bg-green-100" };
        if (expenseRatio < 70) return { status: "Good", color: "text-blue-600", bg: "bg-blue-100" };
        if (expenseRatio < 90) return { status: "Moderate", color: "text-yellow-600", bg: "bg-yellow-100" };
        return { status: "Needs Attention", color: "text-red-600", bg: "bg-red-100" };
    };

    const healthStatus = getHealthStatus();

    return (
        <div className="card">
            {/* Header */}
            <div className="card-header">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <PieChart size={18} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="card-title">Financial Overview</h2>
                        <p className="card-subtitle">
                            Your financial health summary
                        </p>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="card-content">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    {/* Pie Chart */}
                    <div className="flex-1">
                        <CustomPieChart
                            data={balanceData}
                            label="Total Balance"
                            colors={COLORS}
                            showTextAnchors
                            totalAmount={totalBalance}
                        />
                    </div>

                    {/* Financial Metrics */}
                    <div className="flex-1 space-y-4">
                        {/* Health Status */}
                        <div className={`p-3 rounded-lg ${healthStatus.bg}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <Calculator size={16} className={healthStatus.color} />
                                <span className={`text-sm font-medium ${healthStatus.color}`}>
                                    Financial Health
                                </span>
                            </div>
                            <span className={`text-lg font-bold ${healthStatus.color}`}>
                                {healthStatus.status}
                            </span>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 gap-3">
                            <MetricCard
                                icon={<TrendingUp size={16} />}
                                label="Savings Rate"
                                value={`${savingsRatio.toFixed(1)}%`}
                                color={savingsRatio > 20 ? "text-green-600" : "text-yellow-600"}
                                bg={savingsRatio > 20 ? "bg-green-50" : "bg-yellow-50"}
                            />
                            <MetricCard
                                icon={<TrendingDown size={16} />}
                                label="Expense Ratio"
                                value={`${expenseRatio.toFixed(1)}%`}
                                color={expenseRatio < 70 ? "text-green-600" : "text-red-600"}
                                bg={expenseRatio < 70 ? "bg-green-50" : "bg-red-50"}
                            />
                            <MetricCard
                                icon={<DollarSign size={16} />}
                                label="Net Flow"
                                value={`$${Math.abs(netFlow).toLocaleString()}`}
                                color={netFlow > 0 ? "text-green-600" : "text-red-600"}
                                bg={netFlow > 0 ? "bg-green-50" : "bg-red-50"}
                                prefix={netFlow > 0 ? "+" : "-"}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="card-footer">
                <div className="flex items-center justify-center gap-6">
                    {balanceData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-sm text-gray-600">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Metric Card Component
interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
    bg: string;
    prefix?: string;
}

const MetricCard = ({ icon, label, value, color, bg, prefix }: MetricCardProps) => {
    return (
        <div className={`p-3 rounded-lg ${bg}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={color}>
                        {icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
                <span className={`text-sm font-bold ${color}`}>
                    {prefix && <span className="mr-1">{prefix}</span>}
                    {value}
                </span>
            </div>
        </div>
    );
};

export default FinancialOverview;
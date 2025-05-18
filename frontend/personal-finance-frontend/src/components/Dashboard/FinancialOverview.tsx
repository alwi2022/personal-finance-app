import CustomPieChart from "../Charts/CustomPieChart";



interface FinancialOverviewProps {
    totalBalance: number;
    totalIncome: number;
    totalExpense: number;
}
const COLORS = ["#875CF5","#FA2C37","#FF6900"]

const FinancialOverview = ({ totalBalance, totalIncome, totalExpense }: FinancialOverviewProps) => {

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
 
]

    return <div className="card">
        <div className="flex items-center justify-between">
            <h5 className="text-lg">Financial Overview</h5>
        </div>
<CustomPieChart
data={balanceData}
label="Total Balance"
colors={COLORS}
showTextAnchors
totalAmount={totalBalance} 
/>
           
    </div>
}

export default FinancialOverview;

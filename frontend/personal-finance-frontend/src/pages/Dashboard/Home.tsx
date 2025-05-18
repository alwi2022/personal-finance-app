import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/userAuth";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";

import InfoCard from "../../components/Cards/InfoCard";
import { IoMdCard } from "react-icons/io";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { addThousandSeparator } from "../../utils/helper";

import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinancialOverview from "../../components/Dashboard/FinancialOverview";
import Last30DaysExpenseChart from "../../components/Dashboard/Last30DaysExpenseChart";
import ExpanseTransactionsChart from "../../components/Dashboard/ExpanseTransactionsChart";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";

export default function Home() {
  useUserAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_PATH.DASHBOARD.GET_DASHBOARD_DATA);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Something went wrong while fetching dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandSeparator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandSeparator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandSeparator(dashboardData?.totalExpense || 0)}
            color="bg-red-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/dashboard/expense")}
          />
          <FinancialOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpense || 0}
          />
          <ExpanseTransactionsChart
            transactions={dashboardData?.expenseLast30Days?.transactions || []}
            onSeeMore={() => navigate("/dashboard/expense")}
          />
          <Last30DaysExpenseChart
            transactions={dashboardData?.expenseLast30Days?.transactions || []}
            onSeeMore={() => navigate("/dashboard/expense")}
          />
          <RecentIncomeWithChart
            transactions={dashboardData?.incomeLast60Days?.transactions?.slice(0, 4) || []}
            totalIncome={dashboardData?.totalIncome || 0}
          />
          <RecentIncome
            transactions={dashboardData?.incomeLast60Days?.transactions || []}
            onSeeMore={() => navigate("/dashboard/income")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

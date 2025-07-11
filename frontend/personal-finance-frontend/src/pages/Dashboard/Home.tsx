import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CreditCard,
  PiggyBank
} from "lucide-react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/userAuth";
import { useSettings } from "../../context/settingsContext";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";

// Import dashboard components
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinancialOverview from "../../components/Dashboard/FinancialOverview";
import Last30DaysExpenseChart from "../../components/Dashboard/Last30DaysExpenseChart";
import ExpanseTransactionsChart from "../../components/Dashboard/ExpanseTransactionsChart";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";

interface DashboardData {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  recentTransactions: any[];
  expenseLast30Days: {
    transactions: any[];
  };
  incomeLast60Days: {
    transactions: any[];
  };
}

export default function Home() {
  useUserAuth();
  const navigate = useNavigate();
  const { t, formatCurrency } = useSettings();
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (isLoading && dashboardData) return; // Prevent multiple calls

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(API_PATH.DASHBOARD.GET_DASHBOARD_DATA);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(t('failed_to_load_dashboard'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate financial metrics
  const calculateMetrics = () => {
    if (!dashboardData) return null;

    const { totalBalance, totalIncome, totalExpense } = dashboardData;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    const netWorth = totalBalance;

    return {
      savingsRate: savingsRate.toFixed(1),
      netWorth,
      monthlyFlow: totalIncome - totalExpense,
    };
  };

  const metrics = calculateMetrics();

  return (
    <DashboardLayout activeMenu="Dashboard">
      {/* Quick Actions Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('financial_overview')}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              disabled={isLoading}
              className="btn-ghost btn-sm"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              {t('refresh')}
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      {!isLoading && dashboardData && (
        <>
          {/* Financial Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <ModernInfoCard
              icon={<Wallet size={24} />}
              label={t('total_balance')}
              value={formatCurrency(dashboardData.totalBalance || 0)}
              change={metrics?.netWorth && metrics.netWorth > 0 ? "+2.5%" : "0%"}
              changeType="positive"
              color="bg-blue-500"
            />
            <ModernInfoCard
              icon={<TrendingUp size={24} />}
              label={t('total_income')}
              value={formatCurrency(dashboardData.totalIncome || 0)}
              change="+12.3%"
              changeType="positive"
              color="bg-green-500"
            />
            <ModernInfoCard
              icon={<TrendingDown size={24} />}
              label={t('total_expense')}
              value={formatCurrency(dashboardData.totalExpense || 0)}
              change="-8.2%"
              changeType="negative"
              color="bg-red-500"
            />
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <QuickMetricCard
              icon={<PiggyBank size={20} />}
              label={t('savings_rate')}
              value={`${metrics?.savingsRate || 0}%`}
              subtext={t('of_total_income')}
              color="bg-purple-500"
            />
            <QuickMetricCard
              icon={<CreditCard size={20} />}
              label={t('monthly_flow')}
              value={formatCurrency(Math.abs(metrics?.monthlyFlow || 0))}
              subtext={metrics?.monthlyFlow && metrics.monthlyFlow > 0 ? t('surplus') : t('deficit')}
              color={metrics?.monthlyFlow && metrics.monthlyFlow > 0 ? "bg-green-500" : "bg-red-500"}
            />
            <QuickMetricCard
              icon={<DollarSign size={20} />}
              label={t('net_worth')}
              value={formatCurrency(dashboardData.totalBalance || 0)}
              subtext={t('total_assets')}
              color="bg-indigo-500"
            />
          </div>

          {/* Dashboard Widgets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentTransactions
              transactions={dashboardData.recentTransactions}
              onSeeMore={() => navigate("/dashboard/expense")}
            />
            <FinancialOverview
              totalBalance={dashboardData.totalBalance || 0}
              totalIncome={dashboardData.totalIncome || 0}
              totalExpense={dashboardData.totalExpense || 0}
            />
            <ExpanseTransactionsChart
              transactions={dashboardData.expenseLast30Days?.transactions || []}
              onSeeMore={() => navigate("/dashboard/expense")}
            />
            <Last30DaysExpenseChart
              transactions={dashboardData.expenseLast30Days?.transactions || []}
              onSeeMore={() => navigate("/dashboard/expense")}
            />
            <RecentIncomeWithChart
              transactions={dashboardData.incomeLast60Days?.transactions?.slice(0, 4) || []}
              totalIncome={dashboardData.totalIncome || 0}
            />
            <RecentIncome
              transactions={dashboardData.incomeLast60Days?.transactions || []}
              onSeeMore={() => navigate("/dashboard/income")}
            />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

// Modern Info Card Component
interface ModernInfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
  color: string;
}

const ModernInfoCard = ({ icon, label, value, change, changeType, color }: ModernInfoCardProps) => {
  return (
    <div className="card hover:shadow-lg transition-all duration-200 relative overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute top-0 right-0 w-20 h-20 ${color} opacity-5 rounded-full -mr-10 -mt-10`}></div>

      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${changeType === "positive"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
            }`}>
            {changeType === "positive" ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            )}
            {change}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

// Quick Metric Card Component
interface QuickMetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: string;
}

const QuickMetricCard = ({ icon, label, value, subtext, color }: QuickMetricCardProps) => {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center text-white`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500">{subtext}</p>
    </div>
  );
};
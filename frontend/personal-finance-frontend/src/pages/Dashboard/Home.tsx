import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CreditCard,
  PiggyBank,
  BarChart3,
  Activity,
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

// Unified transaction interface that matches backend and component expectations
interface DashboardTransaction {
  _id: string;
  userId: string;
  category: string;
  source: string;
  amount: number;
  currency?: 'USD' | 'IDR';
  amountUSD?: number;
  exchangeRate?: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  type?: 'income' | 'expense';
  displayAmount?: number; // Calculated display amount
  name?: string; // For chart compatibility
}

interface DashboardData {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  recentTransactions: DashboardTransaction[];
  expenseLast30Days: {
    total: number;
    transactions: DashboardTransaction[];
  };
  incomeLast60Days: {
    total: number;
    transactions: DashboardTransaction[];
  };
}

export default function Home() {
  useUserAuth();
  const navigate = useNavigate();
  const { formatCurrency, currency, exchangeRate, t } = useSettings();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');

  // Helper function to determine transaction display amount
  const getTransactionDisplayAmount = (transaction: any): number => {
    // If transaction has currency info, use it properly
    if (transaction.currency && transaction.amountUSD !== undefined) {
      if (currency === 'USD') {
        return transaction.amountUSD;
      } else {
        return transaction.amountUSD * exchangeRate;
      }
    }

    // For legacy or new transactions without currency field
    // Assume backend sends amounts in the currency that was used for input
    if (currency === 'IDR') {
      return transaction.amount; // Backend should already be sending IDR amounts
    } else {
      // If user wants USD but backend has IDR amounts
      return transaction.amount / exchangeRate;
    }
  };

  // Helper function to calculate totals
  const calculateDisplayTotal = (amount: number): number => {
    // Backend sends totals based on stored amounts
    // Since we fixed the input to store in correct currency,
    // backend totals should already be in the right currency
    if (currency === 'IDR') {
      return amount; // Backend calculated in IDR
    } else {
      // Convert to USD if user preference is USD
      return amount / exchangeRate;
    }
  };

  // Process transaction for component compatibility
  const processTransaction = (transaction: any): DashboardTransaction => {
    const displayAmount = getTransactionDisplayAmount(transaction);
    return {
      ...transaction,
      displayAmount,
      name: transaction.source, // For chart compatibility
      type: transaction.type || 'income'
    };
  };

  const fetchDashboardData = async () => {
    if (isLoading && dashboardData) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(API_PATH.DASHBOARD.GET_DASHBOARD_DATA);
      if (response.data) {
        // Process the data with proper currency handling
        const processedData: DashboardData = {
          ...response.data,
          // Calculate display totals
          totalBalance: calculateDisplayTotal(response.data.totalBalance),
          totalIncome: calculateDisplayTotal(response.data.totalIncome),
          totalExpense: calculateDisplayTotal(response.data.totalExpense),

          // Process transactions
          recentTransactions: response.data.recentTransactions.map(processTransaction),
          expenseLast30Days: {
            ...response.data.expenseLast30Days,
            transactions: response.data.expenseLast30Days.transactions.map(processTransaction)
          },
          incomeLast60Days: {
            ...response.data.incomeLast60Days,
            transactions: response.data.incomeLast60Days.transactions.map(processTransaction)
          }
        };

        setDashboardData(processedData);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(t('failed_load_dashboard') || "Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currency]); // Refetch when currency changes

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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              {t('financial_overview') || 'Financial Overview'}
            </h1>
            <p className="text-gray-500">
              {t('welcome_back') || 'Welcome back'} • {currency}
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            {t('refresh') || 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !dashboardData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-lg p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && dashboardData && (
        <>
          {/* Primary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ModernInfoCard
              icon={<Wallet size={20} />}
              label={t('total_balance') || 'Total Balance'}
              value={formatCurrency(dashboardData.totalBalance || 0, currency)}
              change={metrics?.netWorth && metrics.netWorth > 0 ? "+2.5%" : "0%"}
              color="bg-blue-500"
              changeType="positive"
            />
            <ModernInfoCard 
              icon={<TrendingUp size={20} />}
              label={t('total_income') || 'Total Income'}
              value={formatCurrency(dashboardData.totalIncome || 0, currency)}
              change="+12.3%"
              color="bg-green-500"
              changeType="positive"
            />
            <ModernInfoCard
              icon={<TrendingDown size={20} />}
              label={t('total_expenses') || 'Total Expenses'}
              value={formatCurrency(dashboardData.totalExpense || 0, currency)}
              change="-8.2%"
              color="bg-red-500"
              changeType="negative"
            />
          </div>

          {/* Navigation Tabs */}
          <div className="mb-6">
            <nav className="flex space-x-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-gray-600" />
                  {t('overview') || 'Overview'}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-gray-600" />
                  {t('analytics') || 'Analytics'}
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Secondary Metrics */}
              <div className="bg-white border border-gray-100 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t('key_metrics') || 'Key Metrics'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div  style={{backgroundColor: '#FFD700'}} className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <PiggyBank size={20} className="text-white" />
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{metrics?.savingsRate || 0}%</p>
                    <p className="text-sm text-gray-500">{t('savings_rate') || 'Savings Rate'}</p>
                  </div>
                  <div className="text-center">
                    <div style={{backgroundColor: '#007BFF'}} className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <CreditCard size={20} className="text-white" />
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(Math.abs(metrics?.monthlyFlow || 0), currency)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {metrics?.monthlyFlow && metrics.monthlyFlow > 0 ?
                        (t('surplus') || 'Surplus') :
                        (t('deficit') || 'Deficit')
                      }
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <DollarSign size={20} className="text-white" />
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(dashboardData.totalBalance || 0, currency)}
                    </p>
                    <p className="text-sm text-gray-500">{t('net_worth') || 'Net Worth'}</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecentTransactions
                  transactions={dashboardData.recentTransactions}
                  onSeeMore={() => navigate("/dashboard/expense")}
                />
                <FinancialOverview
                  totalBalance={dashboardData.totalBalance || 0}
                  totalIncome={dashboardData.totalIncome || 0}
                  totalExpense={dashboardData.totalExpense || 0}
                />
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
          )}
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



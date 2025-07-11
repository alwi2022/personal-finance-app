import { ArrowRight, TrendingDown, AlertCircle, Utensils, ShoppingBag, Gamepad2, FileText, GraduationCap, Plane, Heart, Car, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { useSettings } from "../../context/settingsContext";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';
import type { TypeTransaction } from "../../types/type";

interface ExpenseTransactionsChartProps {
  transactions: TypeTransaction[];
  onSeeMore: () => void;
}

// Category mapping with translation keys (reuse from RecentTransactions)
const CATEGORY_MAP: Record<string, { labelKey: string; icon: React.ReactNode; color: string }> = {
  food: { labelKey: "category_food", icon: <Utensils size={16} />, color: "bg-orange-500" },
  transport: { labelKey: "category_transport", icon: <Car size={16} />, color: "bg-blue-500" },
  shopping: { labelKey: "category_shopping", icon: <ShoppingBag size={16} />, color: "bg-purple-500" },
  entertainment: { labelKey: "category_entertainment", icon: <Gamepad2 size={16} />, color: "bg-pink-500" },
  bills: { labelKey: "category_bills", icon: <FileText size={16} />, color: "bg-gray-500" },
  health: { labelKey: "category_health", icon: <Heart size={16} />, color: "bg-red-500" },
  education: { labelKey: "category_education", icon: <GraduationCap size={16} />, color: "bg-green-500" },
  travel: { labelKey: "category_travel", icon: <Plane size={16} />, color: "bg-indigo-500" },
  rent: { labelKey: "category_rent", icon: <Home size={16} />, color: "bg-yellow-500" },
  other: { labelKey: "category_other", icon: <AlertCircle size={16} />, color: "bg-gray-500" },
};

const ExpenseTransactionsChart = ({ transactions, onSeeMore }: ExpenseTransactionsChartProps) => {
  const { t, formatCurrency, language } = useSettings();
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  // Set moment locale when language changes
  useEffect(() => {
    dayjs.locale(language === 'id' ? 'id' : 'en');
  }, [language]);

  // Sort transactions
  const sortedTransactions = [...(transactions || [])].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.amount - a.amount;
    }
  });

  // Calculate expense statistics
  const totalExpenses = transactions?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const averageExpense = transactions?.length > 0 ? totalExpenses / transactions.length : 0;
  const highestExpense = transactions?.reduce((max, expense) =>
    expense.amount > max ? expense.amount : max, 0) || 0;

  // Enhanced time formatting function
  const formatTransactionTime = (date: string) => {
    const transactionDate = dayjs(date);
    const now = dayjs();
    const diffDays = now.diff(transactionDate, 'days');
    
    if (diffDays === 0) {
      return t('today');
    } else if (diffDays === 1) {
      return t('yesterday');
    } else if (diffDays <= 7) {
      return transactionDate.format('dddd');
    } else {
      return transactionDate.format(language === 'id' ? 'DD MMM' : 'MMM DD');
    }
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown size={18} className="text-red-600" />
            </div>
            <div>
              <h2 className="card-title">{t('recent_expenses')}</h2>
              <p className="card-subtitle">
                {t('expense_transactions_count', { count: transactions?.length || 0 })}
              </p>
            </div>
          </div>

          <button onClick={onSeeMore} className="btn-ghost btn-sm group">
            {t('view_all')}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-xs font-medium text-red-600 mb-1">{t('total')}</p>
          <p className="text-lg font-bold text-red-900">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-xs font-medium text-blue-600 mb-1">{t('average')}</p>
          <p className="text-lg font-bold text-blue-900">
            {formatCurrency(averageExpense)}
          </p>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <p className="text-xs font-medium text-orange-600 mb-1">{t('highest')}</p>
          <p className="text-lg font-bold text-orange-900">
            {formatCurrency(highestExpense)}
          </p>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">{t('sort_by')}:</span>
        <button
          onClick={() => setSortBy('date')}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            sortBy === 'date'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t('date')}
        </button>
        <button
          onClick={() => setSortBy('amount')}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            sortBy === 'amount'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t('amount')}
        </button>
      </div>

      {/* Transactions List */}
      <div className="card-content">
        {sortedTransactions.length > 0 ? (
          <div className="space-y-3">
            {sortedTransactions.slice(0, 5).map((expense) => (
              <ModernExpenseItem
                key={expense._id}
                expense={expense}
                formatTime={formatTransactionTime}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={20} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">{t('no_expenses_found')}</p>
            <p className="text-gray-400 text-xs mt-1">{t('add_first_expense')}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {sortedTransactions.length > 5 && (
        <div className="card-footer">
          <button
            onClick={onSeeMore}
            className="w-full btn-outline btn-sm"
          >
            {t('view_more_expenses', { count: sortedTransactions.length - 5 })}
          </button>
        </div>
      )}
    </div>
  );
};

// Modern Expense Item Component
interface ModernExpenseItemProps {
  expense: TypeTransaction;
  formatTime: (date: string) => string;
}

const ModernExpenseItem = ({ expense, formatTime }: ModernExpenseItemProps) => {
  const { t, formatCurrency } = useSettings();
  
  // Get category info
  const categoryInfo = CATEGORY_MAP[expense.category || "other"];
  const categoryLabel = t(categoryInfo.labelKey);
  
  // Format time
  const timeDisplay = formatTime(expense.date.toString());
  
  // Use source for display title, category for subtitle
  const title = expense.source || categoryLabel;

  return (
    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
      {/* Left side - Icon and details */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryInfo.color}`}>
          <span className="text-white">{categoryInfo.icon}</span>
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900 text-sm">
            {title}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{categoryLabel}</span>
            <span>•</span>
            <span>{timeDisplay}</span>
          </div>
        </div>
      </div>

      {/* Right side - Amount */}
      <div className="text-right">
        <p className="font-semibold text-red-600">
          -{formatCurrency(expense.amount)}
        </p>
        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
          <TrendingDown size={10} />
          {t('expense')}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTransactionsChart;
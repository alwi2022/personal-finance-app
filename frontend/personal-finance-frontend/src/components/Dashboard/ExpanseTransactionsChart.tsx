import { ArrowRight, TrendingDown, AlertCircle, Utensils, ShoppingBag, Gamepad2, FileText, GraduationCap, Plane, Heart, Car, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { useSettings } from "../../context/settingsContext";
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import type { TypeTransaction } from "../../types/type";

// Extended interface to match what comes from Home.tsx
interface ExtendedTransaction extends TypeTransaction {
  displayAmount?: number;
  name?: string;
  type?: 'income' | 'expense';
}

interface ExpenseTransactionsChartProps {
  transactions: ExtendedTransaction[];
  onSeeMore: () => void;
}

// Category mapping with translation keys and fallback labels
const CATEGORY_MAP: Record<string, { labelKey: string; fallback: string; icon: React.ReactNode; color: string }> = {
  food: { labelKey: "category_food", fallback: "Makanan", icon: <Utensils size={16} />, color: "bg-orange-500" },
  transport: { labelKey: "category_transport", fallback: "Transportasi", icon: <Car size={16} />, color: "bg-blue-500" },
  shopping: { labelKey: "category_shopping", fallback: "Belanja", icon: <ShoppingBag size={16} />, color: "bg-purple-500" },
  entertainment: { labelKey: "category_entertainment", fallback: "Hiburan", icon: <Gamepad2 size={16} />, color: "bg-pink-500" },
  bills: { labelKey: "category_bills", fallback: "Tagihan", icon: <FileText size={16} />, color: "bg-gray-500" },
  health: { labelKey: "category_health", fallback: "Kesehatan", icon: <Heart size={16} />, color: "bg-red-500" },
  education: { labelKey: "category_education", fallback: "Pendidikan", icon: <GraduationCap size={16} />, color: "bg-green-500" },
  travel: { labelKey: "category_travel", fallback: "Perjalanan", icon: <Plane size={16} />, color: "bg-indigo-500" },
  rent: { labelKey: "category_rent", fallback: "Sewa", icon: <Home size={16} />, color: "bg-yellow-500" },
  other: { labelKey: "category_other", fallback: "Lainnya", icon: <AlertCircle size={16} />, color: "bg-gray-500" },
};

const ExpenseTransactionsChart = ({ transactions, onSeeMore }: ExpenseTransactionsChartProps) => {
  const { t, formatCurrency, language, currency, exchangeRate } = useSettings();
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  // Set dayjs locale when language changes
  useEffect(() => {
    dayjs.locale(language === 'id' ? 'id' : 'en');
  }, [language]);

  // Helper function to get display amount (use processed displayAmount from Home.tsx)
  const getDisplayAmount = (transaction: ExtendedTransaction): number => {
    // Use pre-calculated displayAmount from Home.tsx if available
    if (transaction.displayAmount !== undefined) {
      return transaction.displayAmount;
    }
    
    // Fallback logic for backward compatibility
    if (transaction.currency && transaction.amountUSD !== undefined) {
      // Convert from stored data to current display preference
      if (currency === 'USD') {
        return transaction.amountUSD;
      } else {
        return transaction.amountUSD * exchangeRate;
      }
    }
    
    // Legacy data - assume it's already in the right currency from backend
    return transaction.amount;
  };

  // Sort transactions using display amounts
  const sortedTransactions = [...(transactions || [])].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return getDisplayAmount(b) - getDisplayAmount(a);
    }
  });

  // Calculate expense statistics using display amounts
  const displayAmounts = transactions?.map(getDisplayAmount) || [];
  const totalExpenses = displayAmounts.reduce((sum, amount) => sum + amount, 0);
  const averageExpense = displayAmounts.length > 0 ? totalExpenses / displayAmounts.length : 0;
  const highestExpense = displayAmounts.reduce((max, amount) => amount > max ? amount : max, 0);

  // Enhanced time formatting function
  const formatTransactionTime = (date: string) => {
    const transactionDate = dayjs(date);
    const now = dayjs();
    const diffDays = now.diff(transactionDate, 'days');
    
    if (diffDays === 0) {
      return t('today') || 'Hari ini';
    } else if (diffDays === 1) {
      return t('yesterday') || 'Kemarin';
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
              <h2 className="card-title">
                {t('recent_expenses') || 'Pengeluaran Terkini'}
              </h2>
              <p className="card-subtitle">
                {transactions?.length || 0} {t('transactions_this_month') || 'transaksi bulan ini'}
              </p>
            </div>
          </div>

          <button onClick={onSeeMore} className="btn-ghost btn-sm group">
            {t('view_all') || 'Lihat Semua'}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-xs font-medium text-red-600 mb-1">
            {t('total') || 'Total'}
          </p>
          <p className="text-lg font-bold text-red-900">
            {formatCurrency(totalExpenses, currency)}
          </p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-xs font-medium text-blue-600 mb-1">
            {t('average') || 'Rata-rata'}
          </p>
          <p className="text-lg font-bold text-blue-900">
            {formatCurrency(averageExpense, currency)}
          </p>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <p className="text-xs font-medium text-orange-600 mb-1">
            {t('highest') || 'Tertinggi'}
          </p>
          <p className="text-lg font-bold text-orange-900">
            {formatCurrency(highestExpense, currency)}
          </p>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">
          {t('sort_by') || 'Urutkan berdasarkan'}:
        </span>
        <button
          onClick={() => setSortBy('date')}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            sortBy === 'date'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t('date') || 'Tanggal'}
        </button>
        <button
          onClick={() => setSortBy('amount')}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            sortBy === 'amount'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t('amount') || 'Jumlah'}
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
                getDisplayAmount={getDisplayAmount}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={20} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">
              {t('no_expenses_found') || 'Tidak ada pengeluaran ditemukan'}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {t('add_first_expense') || 'Tambahkan pengeluaran pertama Anda untuk memulai'}
            </p>
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
            {t('view_more') || 'Lihat'} {sortedTransactions.length - 5} {t('more_expenses') || 'pengeluaran lainnya'}
          </button>
        </div>
      )}
    </div>
  );
};

// Modern Expense Item Component
interface ModernExpenseItemProps {
  expense: ExtendedTransaction;
  formatTime: (date: string) => string;
  getDisplayAmount: (transaction: ExtendedTransaction) => number;
}

const ModernExpenseItem = ({ expense, formatTime, getDisplayAmount }: ModernExpenseItemProps) => {
  const { t, formatCurrency, currency } = useSettings();
  
  // Get category info
  const categoryInfo = CATEGORY_MAP[expense.category || "other"];
  const categoryLabel = t(categoryInfo.labelKey) || categoryInfo.fallback;
  
  // Format time
  const timeDisplay = formatTime(expense.date.toString());
  
  // Use source for display title, category for subtitle
  const title = expense.source || categoryLabel;
  
  // Get display amount using the helper function
  const displayAmount = getDisplayAmount(expense);

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
          -{formatCurrency(displayAmount, currency)}
        </p>
        
        {/* Show original amount info if available and different */}
        {expense.currency && expense.currency !== currency && expense.amountUSD && (
          <p className="text-xs text-gray-500">
            {t('originally') || 'Asli'}: {expense.currency} {expense.amount.toLocaleString()}
          </p>
        )}
        
        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
          <TrendingDown size={10} />
          {t('expense') || 'Pengeluaran'}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTransactionsChart;
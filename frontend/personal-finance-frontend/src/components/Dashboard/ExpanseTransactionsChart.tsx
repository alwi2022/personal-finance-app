import { ArrowRight, TrendingDown, AlertCircle, Filter, Utensils, ShoppingBag, Gamepad2, FileText, GraduationCap, Plane, Heart, Car, Home } from "lucide-react";
import { useState } from "react";
import moment from "moment";
import type { TypeTransaction } from "../../types/type";

interface ExpenseTransactionsChartProps {
  transactions: TypeTransaction[];
  onSeeMore: () => void;
}
const CATEGORY_MAP: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  food: { label: "Food & Dining", icon: <Utensils size={16} />, color: "bg-orange-500" },
  transport: { label: "Transportation", icon: <Car size={16} />, color: "bg-blue-500" },
  shopping: { label: "Shopping", icon: <ShoppingBag size={16} />, color: "bg-purple-500" },
  entertainment: { label: "Entertainment", icon: <Gamepad2 size={16} />, color: "bg-pink-500" },
  bills: { label: "Bills & Utilities", icon: <FileText size={16} />, color: "bg-gray-500" },
  health: { label: "Healthcare", icon: <Heart size={16} />, color: "bg-red-500" },
  education: { label: "Education", icon: <GraduationCap size={16} />, color: "bg-green-500" },
  travel: { label: "Travel", icon: <Plane size={16} />, color: "bg-indigo-500" },
  rent: { label: "Rent & Housing", icon: <Home size={16} />, color: "bg-yellow-500" },
}

const ExpanseTransactionsChart = ({ transactions, onSeeMore }: ExpenseTransactionsChartProps) => {
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  
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
              <h2 className="card-title">Recent Expenses</h2>
              <p className="card-subtitle">
                {transactions?.length || 0} transactions this month
              </p>
            </div>
          </div>

          <button onClick={onSeeMore} className="btn-ghost btn-sm group">
            View All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-xs font-medium text-red-600 mb-1">Total</p>
          <p className="text-lg font-bold text-red-900">
            ${totalExpenses.toLocaleString()}
          </p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-xs font-medium text-blue-600 mb-1">Average</p>
          <p className="text-lg font-bold text-blue-900">
            ${averageExpense.toFixed(0)}
          </p>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <p className="text-xs font-medium text-orange-600 mb-1">Highest</p>
          <p className="text-lg font-bold text-orange-900">
            ${highestExpense.toLocaleString()}
          </p>
        </div>
      </div>

  

      {/* Transactions List */}
      <div className="card-content">
        {sortedTransactions.length > 0 ? (
          <div className="space-y-3">
            {sortedTransactions.slice(0, 5).map((expense) => (
              <ModernExpenseItem
                key={expense._id}
                expense={expense}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={20} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No expenses found</p>
            <p className="text-gray-400 text-xs mt-1">Add your first expense to get started</p>
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
            View {sortedTransactions.length - 5} More Expenses
          </button>
        </div>
      )}
    </div>
  );
};

// Modern Expense Item Component
interface ModernExpenseItemProps {
  expense: TypeTransaction;
}

const ModernExpenseItem = ({ expense }: ModernExpenseItemProps) => {
  const formattedDate = moment(expense.date).format("MMM DD, YYYY");
  const timeAgo = moment(expense.date).fromNow();
  
  return (
    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
      {/* Left side - Icon and details */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${CATEGORY_MAP[expense.category || "other"].color}`}>
          <span className="text-white">{CATEGORY_MAP[expense.category || "other"].icon}</span>
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900 text-sm">
            {expense.category || "Unknown"}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>

      {/* Right side - Amount */}
      <div className="text-right">
        <p className="font-semibold text-red-600">
          -${expense.amount.toLocaleString()}
        </p>
        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
          <TrendingDown size={10} />
          expense
        </div>
      </div>
    </div>
  );
};

export default ExpanseTransactionsChart;
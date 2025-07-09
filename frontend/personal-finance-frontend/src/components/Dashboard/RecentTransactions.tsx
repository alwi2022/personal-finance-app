import { ArrowRight, Clock, TrendingUp, TrendingDown, Search } from "lucide-react";
import { useState } from "react";
import type { TypeTransaction } from "../../types/type";
import moment from "moment";

interface RecentTransactionsProps {
    transactions: TypeTransaction[];
    onSeeMore: () => void;
}

const RecentTransactions = ({ transactions, onSeeMore }: RecentTransactionsProps) => {
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

    // Filter transactions based on selected filter
    const filteredTransactions = transactions?.filter(transaction => {
        if (filter === 'all') return true;
        return transaction.type === filter;
    }) || [];

    // Calculate transaction statistics
    const stats = {
        total: transactions?.length || 0,
        income: transactions?.filter(t => t.type === 'income').length || 0,
        expense: transactions?.filter(t => t.type === 'expense').length || 0,
    };

    return (
        <div className="card">
            {/* Header */}
            <div className="card-header">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Clock size={18} className="text-primary" />
                        </div>
                        <div>
                            <h2 className="card-title">Recent Transactions</h2>
                            <p className="card-subtitle">
                                {stats.total} transactions this month
                            </p>
                        </div>
                    </div>

                    <button onClick={onSeeMore} className="btn-ghost btn-sm group">
                        View All
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-4">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    All ({stats.total})
                </button>
                <button
                    onClick={() => setFilter('income')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'income'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <TrendingUp size={14} className="inline mr-1" />
                    Income ({stats.income})
                </button>
                <button
                    onClick={() => setFilter('expense')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'expense'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <TrendingDown size={14} className="inline mr-1" />
                    Expense ({stats.expense})
                </button>
            </div>

            {/* Transactions List */}
            <div className="card-content">
                {filteredTransactions.length > 0 ? (
                    <div className="space-y-3">
                        {filteredTransactions.slice(0, 5).map((transaction: TypeTransaction) => (
                            <ModernTransactionItem
                                key={transaction._id}
                                transaction={transaction}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Search size={20} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm">
                            No {filter === 'all' ? '' : filter} transactions found
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            {filteredTransactions.length > 5 && (
                <div className="card-footer">
                    <button
                        onClick={onSeeMore}
                        className="w-full btn-outline btn-sm"
                    >
                        View {filteredTransactions.length - 5} More Transactions
                    </button>
                </div>
            )}
        </div>
    );
};

// Modern Transaction Item Component
interface ModernTransactionItemProps {
    transaction: TypeTransaction;
}

const ModernTransactionItem = ({ transaction }: ModernTransactionItemProps) => {
    const isIncome = transaction.type === 'income';
    const title = isIncome ? transaction.source : transaction.category;
    const formattedDate = moment(transaction.date).format("MMM DD, YYYY");
    const timeAgo = moment(transaction.date).fromNow();

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            {/* Left side - Icon and details */}
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                    {transaction.icon}
                </div>
                <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{formattedDate}</span>
                        <span>•</span>
                        <span>{timeAgo}</span>
                    </div>
                </div>
            </div>

            {/* Right side - Amount */}
            <div className="text-right">
                <p className={`font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {isIncome ? '+' : '-'}${transaction.amount.toLocaleString()}
                </p>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${isIncome
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                    {isIncome ? (
                        <TrendingUp size={10} />
                    ) : (
                        <TrendingDown size={10} />
                    )}
                    {transaction.type}
                </div>
            </div>
        </div>
    );
};

export default RecentTransactions;
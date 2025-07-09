import { ArrowRight, TrendingUp, Plus, AlertCircle } from "lucide-react";

import type { TypeTransaction } from "../../types/type";
import moment from "moment";
import { useNavigate } from "react-router-dom";

interface RecentIncomeProps {
    transactions: TypeTransaction[];
    onSeeMore: () => void;
}

const RecentIncome = ({ transactions, onSeeMore }: RecentIncomeProps) => {
    const navigate = useNavigate();

    // Calculate income statistics
    const totalIncome = transactions?.reduce((sum, income) => sum + income.amount, 0) || 0;
    const averageIncome = transactions?.length > 0 ? totalIncome / transactions.length : 0;
    const highestIncome = transactions?.reduce((max, income) =>
        income.amount > max ? income.amount : max, 0) || 0;

    return (
        <div className="card">
            {/* Header */}
            <div className="card-header">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <TrendingUp size={18} className="text-green-600" />
                        </div>
                        <div>
                            <h2 className="card-title">Recent Income</h2>
                            <p className="card-subtitle">
                                {transactions?.length || 0} income sources
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
                <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xs font-medium text-green-600 mb-1">Total</p>
                    <p className="text-lg font-bold text-green-900">
                        ${totalIncome.toLocaleString()}
                    </p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-medium text-blue-600 mb-1">Average</p>
                    <p className="text-lg font-bold text-blue-900">
                        ${averageIncome.toFixed(0)}
                    </p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs font-medium text-purple-600 mb-1">Highest</p>
                    <p className="text-lg font-bold text-purple-900">
                        ${highestIncome.toLocaleString()}
                    </p>
                </div>
            </div>



            {/* Income List */}
            <div className="card-content">
                {transactions.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <AlertCircle size={20} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm mb-2">No income records found</p>
                        <p className="text-gray-400 text-xs mb-4">Add your first income source to get started</p>
                        <button onClick={() => navigate("/dashboard/income")} className="btn-primary btn-sm">
                            <Plus size={16} />
                            Add Income
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.slice(0, 5).map((transaction) => (
                            <ModernIncomeItem
                                key={transaction._id}
                                transaction={transaction}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {transactions.length > 5 && (
                <div className="card-footer">
                    <button
                        onClick={onSeeMore}
                        className="w-full btn-outline btn-sm"
                    >
                        View {transactions.length - 5} More Income Sources
                    </button>
                </div>
            )}
        </div>
    );
};

// Modern Income Item Component
interface ModernIncomeItemProps {
    transaction: TypeTransaction;
}

const ModernIncomeItem = ({ transaction }: ModernIncomeItemProps) => {
    const formattedDate = moment(transaction.date).format("MMM DD, YYYY");
    const timeAgo = moment(transaction.date).fromNow();

    return (
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            {/* Left side - Icon and details */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg text-green-600">
                    {transaction.icon}
                </div>
                <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                        {transaction.source || "Unknown"}
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
                <p className="font-semibold text-green-600">
                    +${transaction.amount.toLocaleString()}
                </p>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                    <TrendingUp size={10} />
                    income
                </div>
            </div>
        </div>
    );
};

export default RecentIncome;
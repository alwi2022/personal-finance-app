import { ArrowRight, TrendingUp, Plus, AlertCircle, Briefcase, Building, CreditCard, Award, Gift, Home, CircleHelp } from "lucide-react";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';
import { useNavigate } from "react-router-dom";
import { useSettings, type Currency } from "../../context/settingsContext";
import { useEffect } from "react";
import type { TypeTransaction } from "../../types/type";


// Setup dayjs plugins
dayjs.extend(relativeTime);

interface RecentIncomeProps {
    transactions: TypeTransaction[];
    onSeeMore: () => void;
}

const RecentIncome = ({ transactions, onSeeMore }: RecentIncomeProps) => {
    const navigate = useNavigate();
    const { formatCurrency, t, language } = useSettings();
    
    useEffect(() => {
        dayjs.locale(language === 'id' ? 'id' : 'en');
    }, [language]);

    // Category mapping with translation keys
    const getCategoryData = (category: string) => {
        const categoryKey = `category_${category}` as const;
        const categoryMap: Record<string, { icon: React.ReactNode; color: string }> = {
            salary: { icon: <Briefcase size={16} />, color: "bg-blue-500" },
            freelance: { icon: <TrendingUp size={16} />, color: "bg-green-500" },
            business: { icon: <Building size={16} />, color: "bg-purple-500" },
            investment: { icon: <CreditCard size={16} />, color: "bg-orange-500" },
            bonus: { icon: <Award size={16} />, color: "bg-yellow-500" },
            gift: { icon: <Gift size={16} />, color: "bg-pink-500" },
            rental: { icon: <Home size={16} />, color: "bg-indigo-500" },
            other: { icon: <CircleHelp size={16} />, color: "bg-gray-500" },
        };

        return {
            label: t(categoryKey),
            icon: categoryMap[category]?.icon || categoryMap.other.icon,
            color: categoryMap[category]?.color || categoryMap.other.color,
        };
    };

    // Helper function to get display amount (with currency support)
    const getDisplayAmount = (transaction: TypeTransaction): number => {
        // If transaction has amountUSD (new format), use it
        if (transaction.amountUSD !== undefined) {
            return transaction.amountUSD;
        }
        
        // For legacy data, check if it has currency info
        if (transaction.currency) {
            // Always return USD amount for consistent calculation
            return transaction.currency === 'IDR' 
                ? transaction.amount / 16245  // Convert IDR to USD
                : transaction.amount;
        }
        
        // Fallback: assume it's in USD
        return transaction.amount;
    };

    // Calculate income statistics using display amounts
    const displayAmounts = transactions?.map(getDisplayAmount) || [];
    const totalIncome = displayAmounts.reduce((sum, amount) => sum + amount, 0);
    const averageIncome = displayAmounts.length > 0 ? totalIncome / displayAmounts.length : 0;
    const highestIncome = displayAmounts.reduce((max, amount) => amount > max ? amount : max, 0);

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
                            <h2 className="card-title">{t('recent_income')}</h2>
                            <p className="card-subtitle">
                                {t('income_streams_count', { count: transactions?.length || 0 })}
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
                <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xs font-medium text-green-600 mb-1">{t('total')}</p>
                    <p className="text-lg font-bold text-green-900">
                        {formatCurrency(totalIncome, 'USD')}
                    </p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-medium text-blue-600 mb-1">{t('average')}</p>
                    <p className="text-lg font-bold text-blue-900">
                        {formatCurrency(Math.round(averageIncome), 'USD')}
                    </p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs font-medium text-purple-600 mb-1">{t('highest')}</p>
                    <p className="text-lg font-bold text-purple-900">
                        {formatCurrency(highestIncome, 'USD')}
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
                        <p className="text-gray-500 text-sm mb-2">{t('no_income_data')}</p>
                        <p className="text-gray-400 text-xs mb-4">{t('add_income_sources_to_see_breakdown')}</p>
                        <button onClick={() => navigate("/dashboard/income")} className="btn-primary btn-sm">
                            <Plus size={16} />
                            {t('add_income')}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.slice(0, 5).map((transaction) => (
                            <ModernIncomeItem
                                key={transaction._id}
                                transaction={transaction}
                                getCategoryData={getCategoryData}
                                getDisplayAmount={getDisplayAmount}
                                formatCurrency={formatCurrency}
                                t={t}
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
                        {t('view_more_transactions', { count: transactions.length - 5 })} {t('income')}
                    </button>
                </div>
            )}
        </div>
    );
};

// Modern Income Item Component
interface ModernIncomeItemProps {
    transaction: TypeTransaction;
    getCategoryData: (category: string) => { label: string; icon: React.ReactNode; color: string };
    getDisplayAmount: (transaction: TypeTransaction) => number;
    formatCurrency: (amount: number, sourceCurrency?: Currency) => string;
    t: (key: string, params?: { [key: string]: string | number }) => string;
}

const ModernIncomeItem = ({ transaction, getCategoryData, getDisplayAmount, formatCurrency, t }: ModernIncomeItemProps) => {
    const formattedDate = dayjs(transaction.date).format("MMM DD, YYYY");
    const timeAgo = dayjs(transaction.date).fromNow();
    const categoryData = getCategoryData(transaction.category || "other");
    
    // Get display amount for current user currency preference
    const displayAmount = getDisplayAmount(transaction);

    return (
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            {/* Left side - Icon and details */}
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${categoryData.color}`}>
                    <span className="text-white">{categoryData.icon}</span>
                </div>
                <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                        {transaction.source || t('not_available')}
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
                    +{formatCurrency(displayAmount, 'USD')}
                </p>
                
                {/* Show original amount if different currency */}
                {transaction.currency && transaction.currency !== 'USD' && transaction.amountUSD && (
                    <p className="text-xs text-gray-500">
                        {t('originally')}: {transaction.currency} {transaction.amount.toLocaleString()}
                    </p>
                )}
                
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                    <TrendingUp size={10} />
                    {t('income')}
                </div>
            </div>
        </div>
    );
};

export default RecentIncome;
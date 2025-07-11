import { ArrowRight, Clock, TrendingUp, TrendingDown, Search, Briefcase, Building, CreditCard, Award, Gift, Home, CircleHelp, Utensils, Car, FileText, Heart, GraduationCap, Plane, Gamepad2, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { useSettings } from "../../context/settingsContext";
import type { TypeTransaction } from "../../types/type";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

// Setup dayjs
dayjs.extend(relativeTime);
dayjs.locale('en'); // default

// Category mappings with translation keys
const CATEGORY_MAP: Record<string, { labelKey: string; icon: React.ReactNode; color: string }> = {
    // Income categories
    salary: { labelKey: "category_salary", icon: <Briefcase size={16} />, color: "bg-blue-500" },
    freelance: { labelKey: "category_freelance", icon: <TrendingUp size={16} />, color: "bg-green-500" },
    business: { labelKey: "category_business", icon: <Building size={16} />, color: "bg-purple-500" },
    investment: { labelKey: "category_investment", icon: <CreditCard size={16} />, color: "bg-orange-500" },
    bonus: { labelKey: "category_bonus", icon: <Award size={16} />, color: "bg-yellow-500" },
    gift: { labelKey: "category_gift", icon: <Gift size={16} />, color: "bg-pink-500" },
    rental: { labelKey: "category_rental", icon: <Home size={16} />, color: "bg-indigo-500" },
    
    // Expense categories
    food: { labelKey: "category_food", icon: <Utensils size={16} />, color: "bg-orange-500" },
    transport: { labelKey: "category_transport", icon: <Car size={16} />, color: "bg-blue-500" },
    shopping: { labelKey: "category_shopping", icon: <ShoppingBag size={16} />, color: "bg-purple-500" },
    entertainment: { labelKey: "category_entertainment", icon: <Gamepad2 size={16} />, color: "bg-pink-500" },
    bills: { labelKey: "category_bills", icon: <FileText size={16} />, color: "bg-gray-500" },
    health: { labelKey: "category_health", icon: <Heart size={16} />, color: "bg-red-500" },
    education: { labelKey: "category_education", icon: <GraduationCap size={16} />, color: "bg-green-500" },
    travel: { labelKey: "category_travel", icon: <Plane size={16} />, color: "bg-indigo-500" },
    rent: { labelKey: "category_rent", icon: <Home size={16} />, color: "bg-yellow-500" },
    other: { labelKey: "category_other", icon: <CircleHelp size={16} />, color: "bg-gray-500" },
};

interface RecentTransactionsProps {
    transactions: TypeTransaction[];
    onSeeMore: () => void;
}

const RecentTransactions = ({ transactions, onSeeMore }: RecentTransactionsProps) => {
    const { t, formatCurrency, language } = useSettings();
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

    // Set moment locale when language changes
    useEffect(() => {
        dayjs.locale(language === 'id' ? 'id' : 'en');
    }, [language]);

    // Filter transactions
    const filteredTransactions = transactions?.filter(transaction => {
        if (filter === 'all') return true;
        return transaction.type === filter;
    }) || [];

    // Calculate stats
    const stats = {
        total: transactions?.length || 0,
        income: transactions?.filter(t => t.type === 'income').length || 0,
        expense: transactions?.filter(t => t.type === 'expense').length || 0,
    };

    // Enhanced time formatting
    const formatTransactionTime = (date: string) => {
        const transactionDate = dayjs(date);
        const now = dayjs();
        const diffDays = now.diff(transactionDate, 'days');
        
        if (diffDays === 0) {
            return t('today');
        } else if (diffDays === 1) {
            return t('yesterday');
        } else if (diffDays <= 7) {
            return transactionDate.format('dddd'); // Day name
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
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Clock size={18} className="text-primary" />
                        </div>
                        <div>
                            <h2 className="card-title">{t('recent_transactions')}</h2>
                            <p className="card-subtitle">
                                {t('transactions_count', { count: stats.total })}
                            </p>
                        </div>
                    </div>

                    <button onClick={onSeeMore} className="btn-ghost btn-sm group">
                        {t('view_all')}
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-4">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        filter === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    {t('all')} ({stats.total})
                </button>
                <button
                    onClick={() => setFilter('income')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        filter === 'income'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <TrendingUp size={14} className="inline mr-1" />
                    {t('income')} ({stats.income})
                </button>
                <button
                    onClick={() => setFilter('expense')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        filter === 'expense'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <TrendingDown size={14} className="inline mr-1" />
                    {t('expense')} ({stats.expense})
                </button>
            </div>

            {/* Transactions List */}
            <div className="card-content">
                {filteredTransactions.length > 0 ? (
                    <div className="space-y-3">
                        {filteredTransactions.slice(0, 5).map((transaction: TypeTransaction) => (
                            <TransactionItem
                                key={transaction._id}
                                transaction={transaction}
                                formatTime={formatTransactionTime}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Search size={20} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm">
                            {t('no_transactions_found', { 
                                type: filter === 'all' ? '' : t(filter).toLowerCase()
                            })}
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
                        {t('view_more_transactions', { 
                            count: filteredTransactions.length - 5 
                        })}
                    </button>
                </div>
            )}
        </div>
    );
};

// Transaction Item Component
interface TransactionItemProps {
    transaction: TypeTransaction;
    formatTime: (date: string) => string;
}

const TransactionItem = ({ transaction, formatTime }: TransactionItemProps) => {
    const { t, formatCurrency } = useSettings();
    const isIncome = transaction.type === 'income';
    
    // Use source for display (keep original from API)
    const title = transaction.source;
    
    // Get category info
    const categoryInfo = CATEGORY_MAP[transaction.category || "other"];
    const categoryLabel = t(categoryInfo.labelKey);
    
    // Format time
        const timeDisplay = formatTime(transaction.date.toString());

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            {/* Left side - Icon and details */}
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryInfo.color}`}>
                    <span className="text-white">{categoryInfo.icon}</span>
                </div>  
                <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{categoryLabel}</span>
                        <span>•</span>
                        <span>{timeDisplay}</span>
                    </div>
                </div>
            </div>

            {/* Right side - Amount */}
            <div className="text-right">
                <p className={`font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                 {formatCurrency(transaction.amount)}
                </p>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                    isIncome ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {isIncome ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {t(transaction.type || '')}
                </div>
            </div>
        </div>
    );
};

export default RecentTransactions;
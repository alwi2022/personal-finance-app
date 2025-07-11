import {
  TrendingUp, Trash2, Utensils, MoreVertical, Building, CreditCard, Award,
  Gift, Home, CircleHelp, Briefcase,
  Plane,
  GraduationCap,
  Heart,
  FileText,
  Gamepad2,
  ShoppingBag,
  Car
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSettings } from "../../context/settingsContext";
import dayjs from "dayjs";
import 'dayjs/locale/id';

// Category mapping with translation support
const CATEGORY_MAP: Record<string, { labelKey: string; fallback: string; icon: React.ReactNode; color: string }> = {
  // Income categories
  salary: { labelKey: "category_salary", fallback: "Salary", icon: <Briefcase size={16} />, color: "bg-blue-500" },
  freelance: { labelKey: "category_freelance", fallback: "Freelance", icon: <TrendingUp size={16} />, color: "bg-green-500" },
  business: { labelKey: "category_business", fallback: "Business", icon: <Building size={16} />, color: "bg-purple-500" },
  investment: { labelKey: "category_investment", fallback: "Investment", icon: <CreditCard size={16} />, color: "bg-orange-500" },
  bonus: { labelKey: "category_bonus", fallback: "Bonus", icon: <Award size={16} />, color: "bg-yellow-500" },
  gift: { labelKey: "category_gift", fallback: "Gift", icon: <Gift size={16} />, color: "bg-pink-500" },
  rental: { labelKey: "category_rental", fallback: "Rental", icon: <Home size={16} />, color: "bg-indigo-500" },
  other: { labelKey: "category_other", fallback: "Other", icon: <CircleHelp size={16} />, color: "bg-gray-500" },
  
  // Expense categories
  food: { labelKey: "category_food", fallback: "Food & Dining", icon: <Utensils size={16} />, color: "bg-orange-500" },
  transport: { labelKey: "category_transport", fallback: "Transportation", icon: <Car size={16} />, color: "bg-blue-500" },
  shopping: { labelKey: "category_shopping", fallback: "Shopping", icon: <ShoppingBag size={16} />, color: "bg-purple-500" },
  entertainment: { labelKey: "category_entertainment", fallback: "Entertainment", icon: <Gamepad2 size={16} />, color: "bg-pink-500" },
  bills: { labelKey: "category_bills", fallback: "Bills & Utilities", icon: <FileText size={16} />, color: "bg-gray-500" },
  health: { labelKey: "category_health", fallback: "Healthcare", icon: <Heart size={16} />, color: "bg-red-500" },
  education: { labelKey: "category_education", fallback: "Education", icon: <GraduationCap size={16} />, color: "bg-green-500" },
  travel: { labelKey: "category_travel", fallback: "Travel", icon: <Plane size={16} />, color: "bg-indigo-500" },
  rent: { labelKey: "category_rent", fallback: "Rent & Housing", icon: <Home size={16} />, color: "bg-yellow-500" },
};

interface TransactionCardProps {
  title?: string;
  category?: string;
  date: string;
  amount: number;
  type: string;
  hideDeletBtn?: boolean;
  onDelete?: () => void;
  // Extended props for currency support
  currency?: 'USD' | 'IDR';
  amountUSD?: number;
  originalAmount?: number;
  displayAmount?: number;
}

const TransactionCard = ({
  title,
  category,
  date,
  amount,
  type,
  hideDeletBtn,
  onDelete,
  currency: transactionCurrency,
  amountUSD,
  originalAmount,
  displayAmount,
}: TransactionCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const isIncome = type === "income";
  const { t, formatCurrency, language, currency: userCurrency, exchangeRate } = useSettings();

  useEffect(() => {
    dayjs.locale(language === 'id' ? 'id' : 'en');
  }, [language]);

  // Helper function to get display amount with currency conversion
  const getDisplayAmount = (): number => {
    // Use pre-calculated displayAmount if available
    if (displayAmount !== undefined) {
      return displayAmount;
    }
    
    // If transaction has currency info, convert appropriately
    if (transactionCurrency && amountUSD !== undefined) {
      if (userCurrency === 'USD') {
        return amountUSD;
      } else {
        return amountUSD * exchangeRate;
      }
    }
    
    // Use original amount or fallback to amount prop
    return originalAmount || amount;
  };

  // Get category info with translation
  const getCategoryInfo = () => {
    const categoryInfo = CATEGORY_MAP[category || "other"];
    if (!categoryInfo) {
      return {
        label: t('category_other') || 'Other',
        icon: <CircleHelp size={16} />,
        color: 'bg-gray-500'
      };
    }
    
    return {
      label: t(categoryInfo.labelKey) || categoryInfo.fallback,
      icon: categoryInfo.icon,
      color: categoryInfo.color
    };
  };

  // Get styles based on transaction type
  const getStyles = () => {
    if (isIncome) {
      return {
        amountBg: "bg-green-50",
        amountText: "text-green-600",
        iconBg: "bg-green-100",
        iconText: "text-green-600",
        border: "border-green-200",
        hoverBg: "hover:bg-green-50/50",
      };
    } else {
      return {
        amountBg: "bg-red-50",
        amountText: "text-red-600",
        iconBg: "bg-red-100",
        iconText: "text-red-600",
        border: "border-red-200",
        hoverBg: "hover:bg-red-50/50",
      };
    }
  };

  const styles = getStyles();
  const categoryInfo = getCategoryInfo();
  const finalDisplayAmount = getDisplayAmount();

  return (
    <div className={`group relative flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white ${styles.hoverBg} transition-all duration-200 hover:shadow-md`}>
      {/* Transaction Icon */}
      <div className={`w-12 h-12 flex items-center justify-center rounded-full`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${categoryInfo.color}`}>
          <span className="text-white">{categoryInfo.icon}</span>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm leading-tight">
              {title || t('unknown_transaction') || 'Unknown Transaction'}
            </h4>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span>{dayjs(date).format("DD MMMM YYYY")}</span>
              <span className="inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="capitalize">{categoryInfo.label}</span>
              <span className="inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="capitalize">{t(type) || type}</span>
            </p>
          </div>

          {/* Amount Display */}
          <div className="flex items-center gap-3">
            <div className={`flex flex-col items-end gap-1 px-3 py-2 rounded-lg ${styles.amountBg} ${styles.border}`}>
              <span className={`text-sm font-semibold ${styles.amountText}`}>
                {formatCurrency(finalDisplayAmount, userCurrency)}
              </span>
              
              {/* Show original amount if different currency */}
              {transactionCurrency && transactionCurrency !== userCurrency && amountUSD && (
                <span className="text-xs text-gray-500">
                  {t('originally') || 'Orig'}: {transactionCurrency} {amount.toLocaleString()}
                </span>
              )}
            </div>

            {/* Actions Menu */}
            {!hideDeletBtn && (
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <MoreVertical size={16} />
                </button>

                {/* Actions Dropdown */}
                {showActions && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowActions(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      <button
                        onClick={() => {
                          onDelete?.();
                          setShowActions(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                        {t('delete_transaction') || 'Delete'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
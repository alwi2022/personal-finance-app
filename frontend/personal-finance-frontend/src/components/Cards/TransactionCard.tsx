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
const CATEGORY_MAP: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  salary: { label: "Salary", icon: <Briefcase size={16} />, color: "bg-blue-500" },
  freelance: { label: "Freelance", icon: <TrendingUp size={16} />, color: "bg-green-500" },
  business: { label: "Business", icon: <Building size={16} />, color: "bg-purple-500" },
  investment: { label: "Investment", icon: <CreditCard size={16} />, color: "bg-orange-500" },
  bonus: { label: "Bonus", icon: <Award size={16} />, color: "bg-yellow-500" },
  gift: { label: "Gift", icon: <Gift size={16} />, color: "bg-pink-500" },
  rental: { label: "Rental", icon: <Home size={16} />, color: "bg-indigo-500" },
  other: { label: "Other", icon: <CircleHelp size={16} />, color: "bg-gray-500" },
  food: { label: "Food & Dining", icon: <Utensils size={16} />, color: "bg-orange-500" },
  transport: { label: "Transportation", icon: <Car size={16} />, color: "bg-blue-500" },
  shopping: { label: "Shopping", icon: <ShoppingBag size={16} />, color: "bg-purple-500" },
  entertainment: { label: "Entertainment", icon: <Gamepad2 size={16} />, color: "bg-pink-500" },
  bills: { label: "Bills & Utilities", icon: <FileText size={16} />, color: "bg-gray-500" },
  health: { label: "Healthcare", icon: <Heart size={16} />, color: "bg-red-500" },
  education: { label: "Education", icon: <GraduationCap size={16} />, color: "bg-green-500" },
  travel: { label: "Travel", icon: <Plane size={16} />, color: "bg-indigo-500" },
  rent: { label: "Rent & Housing", icon: <Home size={16} />, color: "bg-yellow-500" },


};




interface TransactionCardProps {
  title?: string;
  category?: string;
  date: string;
  amount: number;
  type: string;
  hideDeletBtn?: boolean;
  onDelete?: () => void;
}

const TransactionCard = ({
  title,
  category,
  date,
  amount,
  type,
  hideDeletBtn,
  onDelete,
}: TransactionCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const isIncome = type === "income";
  const { t, formatCurrency, language } = useSettings();
  useEffect(() => {
    dayjs.locale(language === 'id' ? 'id' : 'en');
  }, [language]);
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

  return (
    <div className={`group relative flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white ${styles.hoverBg} transition-all duration-200 hover:shadow-md`}>
      {/* Transaction Icon */}
      <div className={`w-12 h-12 flex items-center justify-center rounded-full`}>
        {category && category !== "" ? (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${CATEGORY_MAP[category || "other"].color}`}>
            <span className="text-white">{CATEGORY_MAP[category || "other"].icon}</span>
          </div>
        ) : (
          <Utensils size={20} className="text-gray-500" />
        )}


      </div>

      {/* Transaction Details */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm leading-tight">
              {title || t('unknown_transaction')}
            </h4>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span>{dayjs(date).format("DD MMMM YYYY")}</span>
              <span className="inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="capitalize">{t(type)}</span>
            </p>
          </div>

          {/* Amount Display */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${styles.amountBg} ${styles.border}`}>
              <span className={`text-sm font-semibold ${styles.amountText}`}>
                {formatCurrency(amount)}
              </span>

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
                        {t('delete_transaction')}
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
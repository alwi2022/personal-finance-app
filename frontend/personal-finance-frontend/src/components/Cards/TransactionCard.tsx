import { TrendingUp, TrendingDown, Trash2, Utensils, MoreVertical } from "lucide-react";
import { useState } from "react";
import { addThousandSeparator } from "../../utils/helper";

interface TransactionCardProps {
  title?: string;
  icon: React.ReactNode;
  date: string;
  amount: number;
  type: string;
  hideDeletBtn?: boolean;
  onDelete?: () => void;
}

const TransactionCard = ({
  title,
  icon,
  date,
  amount,
  type,
  hideDeletBtn,
  onDelete,
}: TransactionCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const isIncome = type === "income";

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
      <div className={`w-12 h-12 flex items-center justify-center rounded-full ${styles.iconBg} ${styles.iconText}`}>
        {icon && icon !== "" ? (
          <span className="text-xl">{icon}</span>
        ) : (
          <Utensils size={20} />
        )}
      </div>

      {/* Transaction Details */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm leading-tight">
              {title || "Unknown Transaction"}
            </h4>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span>{date}</span>
              <span className="inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="capitalize">{type}</span>
            </p>
          </div>

          {/* Amount Display */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${styles.amountBg} ${styles.border}`}>
              <span className={`text-sm font-semibold ${styles.amountText}`}>
                {isIncome ? "+" : "-"}${addThousandSeparator(amount)}
              </span>
              {isIncome ? (
                <TrendingUp size={16} className={styles.amountText} />
              ) : (
                <TrendingDown size={16} className={styles.amountText} />
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
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${isIncome ? 'bg-green-500' : 'bg-red-500'}`} />
    </div>
  );
};

export default TransactionCard;
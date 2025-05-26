import { LuUtensils, LuTrendingUp, LuTrendingDown, LuTrash2 } from "react-icons/lu";
import { addThousandSeparator, } from "../../utils/helper";


interface TransactionCardProps {
  title?: string;
  icon: React.ReactNode
  date: string;
  amount: number;
  type: string;
  hideDeletBtn?: boolean;
  onDelete?: () => void;
}

const getAmountStyles = (type: string) => {
  return type === "income"
    ? "bg-green-50 text-green-500"
    : "bg-red-50 text-red-500";
};

const TransactionCard = ({
  title,
  icon,
  date,
  amount,
  type,
  hideDeletBtn,
  onDelete,
}: TransactionCardProps) => {
  return (
    <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60">
     <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 rounded-full">
  {icon && icon !== "" ? (
    <span className="text-2xl">{icon}</span>
  ) : (
    <LuUtensils />
  )}
</div>


      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700 font-medium">{title}</p>
          <p className="text-xs text-gray-400 mt-1">{date}</p>
        </div>

        <div className="flex items-center gap-2">
          {!hideDeletBtn && (
            <button onClick={onDelete} className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <LuTrash2 size={18} />
            </button>
          )}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles(
              type
            )}`}
          >
            <h6 className="text-xs font-medium">
            {type === "income" ? "+" : "-"} {addThousandSeparator(amount)}
            </h6>
            {type === "income" ? (
              <LuTrendingUp size={18} />
            ) : (
              <LuTrendingDown size={18} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;

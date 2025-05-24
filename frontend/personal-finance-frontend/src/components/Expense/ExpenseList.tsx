import { LuDownload } from "react-icons/lu";
import type { TypeTransaction } from "../../types/type";
import TransactionCard from "../Cards/TransactionCard";
import moment from "moment";
interface Props {
  transactions: TypeTransaction[];
  onDelete: (id: string) => void;
  onDownload: () => void;
}

const ExpenseList = ({ transactions, onDelete, onDownload }: Props) => {
  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Expense List</h2>
        <button
          className="text-sm flex items-center gap-1 text-blue-600 hover:underline"
          onClick={onDownload}
        >
          <LuDownload className="w-4 h-4" />
          Download
        </button>
      </div>

      {transactions.length === 0 ? (
        <p className="text-sm text-gray-500">No expense data available.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {transactions.map((item) => (
          <TransactionCard
          key={item._id}
          title={item.category}
          icon={item.icon}
          date={moment(item.date).format("DD MMMM YYYY")}
          amount={item.amount}
          type="expense"
          onDelete={() => onDelete(item._id)}

            />
          ))}
        </ul>
      )}
    </div>
  );
};

    export default ExpenseList;

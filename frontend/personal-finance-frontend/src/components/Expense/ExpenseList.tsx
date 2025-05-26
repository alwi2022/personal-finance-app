import { LuDownload } from "react-icons/lu";
import type { TypeTransaction } from "../../types/type";
import moment from "moment";
import TransactionItem from "../Cards/TransactionItem";
import { useState } from "react";

interface Props {
  transactions: TypeTransaction[];
  onDelete: (id: string) => void;
  onDownload: () => void;
}

const ExpenseList = ({ transactions, onDelete, onDownload }: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const onRequestDelete = (id: string) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      onDelete(selectedId);
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setSelectedId(null);
  };

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
            <li key={item._id}>
              <TransactionItem
                title={item.category}
                icon={item.icon}
                date={moment(item.date).format("DD MMMM YYYY")}
                amount={item.amount}
                type="expense"
                onRequestDelete={() => onRequestDelete(item._id)}
              />
            </li>
          ))}
        </ul>
      )}

      {showConfirm && (
        <div className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h3 className="text-lg font-semibold mb-4">Hapus transaksi ini?</h3>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;

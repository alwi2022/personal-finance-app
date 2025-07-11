import { LuDownload } from "react-icons/lu";
import type { TypeTransaction } from "../../types/type";
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import TransactionItem from "../Cards/TransactionItem";
import { useSettings } from "../../context/settingsContext";

interface ExtendedTransaction extends TypeTransaction {
  displayAmount?: number;
  name?: string;
  type?: 'income' | 'expense';
}

interface Props {
  transactions: ExtendedTransaction[];
  onDelete: (id: string) => void;
  onDownload: () => void;
}

const IncomeList = ({ transactions, onDelete, onDownload }: Props) => {
  const { t, currency, exchangeRate } = useSettings();

  const getDisplayAmount = (transaction: ExtendedTransaction): number => {
    if (transaction.displayAmount !== undefined) {
      return transaction.displayAmount;
    }
    
    if (transaction.currency && transaction.amountUSD !== undefined) {
      if (currency === 'USD') {
        return transaction.amountUSD;
      } else {
        return transaction.amountUSD * exchangeRate;
      }
    }
    
    return transaction.amount;
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {t('income_list') || 'Daftar Pemasukan'}
        </h2>
        <button
          className="text-sm flex items-center gap-1 text-blue-600 hover:underline"
          onClick={onDownload}
        >
          <LuDownload className="w-4 h-4" />
          {t('download') || 'Unduh'}
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 mb-2">
            {t('no_income_data_available') || 'Tidak ada data pemasukan tersedia'}
          </p>
          <p className="text-xs text-gray-400">
            {t('add_first_income_to_see_list') || 'Tambahkan pemasukan pertama untuk melihat daftar'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((item) => (
            <TransactionItem
              key={item._id}
              title={item.source}
              category={item.category}
              date={dayjs(item.date).format("DD MMMM YYYY")}
              amount={getDisplayAmount(item)}
              type="income"
              onRequestDelete={() => onDelete(item._id)}
              currency={item.currency}
              amountUSD={item.amountUSD}
              originalAmount={item.amount}
              displayAmount={item.displayAmount}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IncomeList;
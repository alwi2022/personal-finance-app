import { LuDownload } from "react-icons/lu";
import type { TypeTransaction } from "../../types/type";
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import TransactionItem from "../Cards/TransactionItem";
import { useSettings } from "../../context/settingsContext";
import relativeTime from 'dayjs/plugin/relativeTime';
interface Props {
  transactions: TypeTransaction[];
  onDelete: (id: string) => void;
  onDownload: () => void;
}

const ExpenseList = ({ transactions, onDelete, onDownload }: Props) => {
  const { t, language } = useSettings();
   // Setup dayjs locale
   dayjs.extend(relativeTime);
   dayjs.locale(language === 'id' ? 'id' : 'en');

  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{t('expense_list')}</h2>
        <button
          className="text-sm flex items-center gap-1 text-blue-600 hover:underline"
          onClick={onDownload}
        >
          <LuDownload className="w-4 h-4" />
          {t('download')}
        </button>
      </div>

      {transactions.length === 0 ? (
        <p className="text-sm text-gray-500">{t('no_expense_data_available')}</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {transactions.map((item) => (
            <li key={item._id}>
              <TransactionItem
                title={item.source}
                category={item.category || "other"}
                date={dayjs(item.date).format("DD MMMM YYYY")}
                amount={item.amount}
                type="expense"
                onRequestDelete={() => onDelete(item._id)}
              />
            </li>
          ))}
        </ul>
      )}

  
    </div>
  );
};

export default ExpenseList;

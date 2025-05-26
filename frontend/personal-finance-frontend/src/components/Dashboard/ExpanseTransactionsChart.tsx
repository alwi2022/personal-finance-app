import { LuArrowRight } from "react-icons/lu";
import TransactionCard from "../Cards/TransactionCard";
import moment from "moment";
import type { TypeTransaction } from "../../types/type";

const ExpanseTransactionsChart = ({
    transactions,
    onSeeMore,
  }: {
    transactions: TypeTransaction[];
    onSeeMore: () => void;
  }) => {
    return (
      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Expenses</h2>
          <button className="card-btn" onClick={onSeeMore}>
            See all <LuArrowRight className="text-base" />
          </button>
        </div>
        <div className="mt-6">
          {transactions?.slice(0, 5).map((expense) => (
            <TransactionCard
              key={expense._id}
              title={expense.category ?? "Unknown"}
              icon={expense.icon}
              date={moment(expense.date).format("DD MMM YYYY")}
              amount={expense.amount}
              type="expense"
              hideDeletBtn={true}
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default ExpanseTransactionsChart;

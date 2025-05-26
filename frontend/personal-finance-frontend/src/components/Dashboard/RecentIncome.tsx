import { LuArrowRight } from "react-icons/lu";
import type { TypeTransaction } from "../../types/type";
import TransactionCard from "../Cards/TransactionCard";
import moment from "moment";
interface RecentIncomeProps {
    transactions: TypeTransaction[];
    onSeeMore: () => void;
}

const RecentIncome = ({ transactions, onSeeMore }: RecentIncomeProps) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold"> Income</h2>
                <button className="card-btn" onClick={onSeeMore}>See All <LuArrowRight className="text-base" /></button>
            </div>
            <div className="mt-6">
                {transactions.length === 0 ? (
                    <div className="text-sm text-gray-400 text-center py-6">
                        No income records found.
                    </div>
                ) : (
                    transactions.slice(0, 5).map((transaction) => (
                        <TransactionCard
                            key={transaction._id}
                            title={transaction.source ?? "Unknown"}
                            amount={transaction.amount}
                            icon={transaction.icon}
                            date={moment(transaction.date).format("DD MMM YYYY")}
                            type="income"
                            hideDeletBtn
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default RecentIncome;    
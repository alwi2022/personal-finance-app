import { LuArrowRight } from "react-icons/lu";
import type { TypeTransaction } from "../../types/type";
import moment from "moment";
import TransactionCard from "../Cards/TransactionCard";


interface RecentTransactionsProps {
    transactions: TypeTransaction[];
    onSeeMore: () => void;
}

const RecentTransactions = ({ transactions, onSeeMore }: RecentTransactionsProps) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Recent Transactions</h2>

                <button onClick={onSeeMore} className="card-btn"> See All<LuArrowRight className="text-base" /></button>
            </div>
            <div className="mt-6">
                {transactions?.map((transaction: TypeTransaction) => (
                    <TransactionCard key={transaction._id} 
                    title={transaction.type == "expense" ? transaction.category : transaction.source}
                    icon={transaction.icon}
                    date={moment(transaction.date).format("DD MMM YYYY")}
                    amount={transaction.amount}
                    type={transaction.type }
                    hideDeletBtn
                    />  
                ))}

            </div>
        </div>
    );
};

export default RecentTransactions;


import {
  SwipeableList,
  SwipeableListItem,
  TrailingActions,
  SwipeAction,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import TransactionCard from "../Cards/TransactionCard";
import { isMobile } from "../../utils/isMobile";

interface Props {
  title?: string;
  icon: React.ReactNode;
  date: string;
  amount: number;
  type: string;
  onRequestDelete: () => void
}

const TransactionItem = ({ title, icon, date, amount, type, onRequestDelete }: Props) => {
  const mobile = isMobile();

  if (mobile) {
    const trailingActions = () => (
      <TrailingActions>
        <SwipeAction destructive={false} onClick={onRequestDelete}>
          <div className="bg-red-100 text-red-600 p-3 flex items-center justify-end pr-5 font-medium">
            Hapus
          </div>
        </SwipeAction>
      </TrailingActions>
    );

    return (
      <SwipeableList>
        <SwipeableListItem trailingActions={trailingActions()}>
          <TransactionCard
            title={title}
            icon={icon}
            date={date}
            amount={amount}
            type={type}
            hideDeletBtn={true}
          />
        </SwipeableListItem>
      </SwipeableList>
    );
  }

  return (
    <TransactionCard
      title={title}
      icon={icon}
      date={date}
      amount={amount}
      type={type}
      hideDeletBtn={false}
      onDelete={onRequestDelete}
    />
  );
};

export default TransactionItem;
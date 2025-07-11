
import {
  SwipeableList,
  SwipeableListItem,
  TrailingActions,
  SwipeAction,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import TransactionCard from "../Cards/TransactionCard";
import { isMobile } from "../../utils/isMobile";
import { useSettings } from "../../context/settingsContext";
import dayjs from "dayjs";
import 'dayjs/locale/id';
import { useEffect } from "react";
interface Props {
  title?: string;
  category?: string;
  date: string;
  amount: number;
  type: string;
  onRequestDelete: () => void
}

const TransactionItem = ({ title, category, date, amount, type, onRequestDelete }: Props) => {
  const mobile = isMobile();
  const { t,language } = useSettings();
  useEffect(() => {
    dayjs.locale(language === 'id' ? 'id' : 'en');
  }, [language]);
  if (mobile) {
    const trailingActions = () => (
      <TrailingActions>
        <SwipeAction destructive={false} onClick={onRequestDelete}>
          <div className="bg-red-100 text-red-600 p-3 flex items-center justify-end pr-5 font-medium">
            {t('delete_transaction')}
          </div>
        </SwipeAction>
      </TrailingActions>
    );

    return (
      <SwipeableList>
        <SwipeableListItem trailingActions={trailingActions()}>
          <TransactionCard
            title={title}
            category={category || "other"}
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
      category={category || "other"}
      date={date}
      amount={amount}
      type={type}
      hideDeletBtn={false}
      onDelete={onRequestDelete}
    />
  );
};

export default TransactionItem;
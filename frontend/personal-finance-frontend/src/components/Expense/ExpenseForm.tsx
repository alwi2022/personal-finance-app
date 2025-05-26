import { useState } from "react";
import EmojiPickerPopup from "../layouts/EmojiPickerPopup";
import Input from "../Inputs/Input";
import { parseFormattedNumber } from "../../utils/helper";
type ExpenseFormInput = {
    category: string;
    amount: string;
    date: string;
    icon: string;
};

type ExpenseFormPayload = {
    category: string;
    amount: number;
    date: string;
    icon: string;
};

const AddExpenseForm = ({
    onAddExpense,
}: {
    onAddExpense: (expense: ExpenseFormPayload) => void;
}) => {
    const [expense, setExpense] = useState<ExpenseFormInput>({
        category: "",
        amount: "",
        date: "",
        icon: "",
    });

    const handleChange = (key: keyof ExpenseFormInput, value: string) => {
        setExpense({ ...expense, [key]: value });
      };

    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Icon</label>
                <EmojiPickerPopup
                    icon={expense.icon}
                    onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
                />
            </div>

            <Input
                value={expense.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="Rent, Grocery, etc"
                type="text"
                label="Category"
            />

<Input
  value={expense.amount}
  onChange={(e) => handleChange("amount", e.target.value)}
  label="Amount"
  placeholder="1.000.000"
  formatNumber
/>

            <Input
                value={expense.date}
                onChange={(e) => handleChange("date", e.target.value)}
                placeholder="Select date"
                type="date"
                label="Date"
            />

            <div className="flex justify-end">
                <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition text-sm"
                    onClick={() =>
                        onAddExpense({
                          ...expense,
                          amount: parseFormattedNumber(expense.amount),
                        })
                    }
                >
                    Add Expense
                </button>
            </div>
        </div>
    );
};

export default AddExpenseForm;

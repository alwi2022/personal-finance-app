import { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../layouts/EmojiPickerPopup";

type IncomeFormInput = {
    amount: number;
    date: string;
    source: string;
    icon: string;
  };
      
const AddIncomeForm = ({
  onAddIncome,
}: {
  onAddIncome: (income: IncomeFormInput) => void;
}) => {
  const [income, setIncome] = useState<IncomeFormInput>({
    amount: 0,
    source: "",
    icon: "",
    date: "",
  });

  const handleChange = (key: keyof IncomeFormInput, value: string) => {
    setIncome({ ...income, [key]: value });
  };

  console.log(income.icon , "income");    
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Icon
        </label>
        <EmojiPickerPopup
          icon={income.icon}
          onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
        />
      </div>

      <Input
        value={income.source}
        onChange={(e) => handleChange("source", e.target.value)}
        label="Income Source"
        placeholder="Freelance, salary, etc"
      />
      <Input
        value={income.amount.toString()}
        onChange={(e) => handleChange("amount", e.target.value)}
        label="Amount"
        placeholder="1000"
        type="number"
      />
      <Input
        value={income.date}
        onChange={(e) => handleChange("date", e.target.value)}
        label="Date"
        placeholder="2025-01-01"
        type="date"
      />

      <div className="flex justify-end">
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition"
          onClick={() => onAddIncome(income)}
        >
          Add Income
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;

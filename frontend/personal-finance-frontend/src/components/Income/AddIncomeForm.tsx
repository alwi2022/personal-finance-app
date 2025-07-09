import { useState } from "react";
import { DollarSign, Calendar, Building, Plus, X,  Briefcase, CreditCard, TrendingUp, Award, Gift, Home, CircleHelp   } from "lucide-react";
import { parseFormattedNumber } from "../../utils/helper";

type IncomeFormInput = {
  amount: string;
  date: string;
  source: string;
  category: string;
};

type IncomeFormPayload = {
  amount: number;
  date: string;
  source: string;
  category: string;
};

interface AddIncomeFormProps {
  onAddIncome: (income: IncomeFormPayload) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Professional predefined categories with icons
const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Salary', icon: Briefcase, color: 'bg-blue-500' },
  { id: 'freelance', label: 'Freelance', icon: TrendingUp, color: 'bg-green-500' },
  { id: 'business', label: 'Business', icon: Building, color: 'bg-purple-500' },
  { id: 'investment', label: 'Investment', icon: CreditCard, color: 'bg-orange-500' },
  { id: 'bonus', label: 'Bonus', icon: Award, color: 'bg-yellow-500' },
  { id: 'gift', label: 'Gift', icon: Gift, color: 'bg-pink-500' },
  { id: 'rental', label: 'Rental', icon: Home, color: 'bg-indigo-500' },
  { id: 'other', label: 'Other', icon: CircleHelp, color: 'bg-gray-500' },
];

const AddIncomeForm = ({
  onAddIncome,
  onCancel,
  isLoading = false,
}: AddIncomeFormProps) => {
  const [income, setIncome] = useState<IncomeFormInput>({
    amount: "",
    source: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Partial<IncomeFormInput>>({});

  const handleChange = (key: keyof IncomeFormInput, value: string) => {
    setIncome({ ...income, [key]: value });
    
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors({ ...errors, [key]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<IncomeFormInput> = {};

    if (!income.source.trim()) {
      newErrors.source = "Income source is required";
    }

    if (!income.category) {
      newErrors.category = "Please select a category";
    }

    if (!income.amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (parseFormattedNumber(income.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!income.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onAddIncome({
      ...income,
      amount: parseFormattedNumber(income.amount),
    });
  };

  const handleReset = () => {
    setIncome({
      amount: "",
      source: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
  };

  const selectedCategory = INCOME_CATEGORIES.find(cat => cat.id === income.category);
  const isFormValid = income.source && income.category && income.amount && income.date;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Add New Income</h3>
        <p className="card-subtitle">
          Record your income with professional categorization
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-content">
        <div className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="input-label">
              <Building size={16} className="inline mr-2" />
              Income Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {INCOME_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleChange("category", category.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    income.category === category.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center`}>
                      <category.icon size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium">{category.label}</span>
                  </div>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="input-error">{errors.category}</p>
            )}
          </div>

          {/* Income Source */}
          <div>
            <label className="input-label">
              <Briefcase size={16} className="inline mr-2" />
              Income Source
            </label>
            <input
              type="text"
              value={income.source}
              onChange={(e) => handleChange("source", e.target.value)}
              placeholder="e.g., Google Inc, Client ABC, Rental Property"
              className={`input-box ${errors.source ? 'error' : ''}`}
              disabled={isLoading}
            />
            {errors.source && (
              <p className="input-error">{errors.source}</p>
            )}
            <p className="input-help">
              Enter the specific source of this income
            </p>
          </div>

          {/* Amount */}
          <div>
            <label className="input-label">
              <DollarSign size={16} className="inline mr-2" />
              Amount
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                $
              </div>
              <input
                type="text"
                value={income.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="0.00"
                className={`input-box pl-8 ${errors.amount ? 'error' : ''}`}
                disabled={isLoading}
              />
            </div>
            {errors.amount && (
              <p className="input-error">{errors.amount}</p>
            )}
            <p className="input-help">
              Enter the income amount (numbers only)
            </p>
          </div>

          {/* Date */}
          <div>
            <label className="input-label">
              <Calendar size={16} className="inline mr-2" />
              Date Received
            </label>
            <input
              type="date"
              value={income.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className={`input-box ${errors.date ? 'error' : ''}`}
              disabled={isLoading}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && (
              <p className="input-error">{errors.date}</p>
            )}
            <p className="input-help">
              Select the date when you received this income
            </p>
          </div>

          {/* Preview */}
          {isFormValid && selectedCategory && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="text-sm font-medium text-green-800 mb-2">Preview</h4>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${selectedCategory.color} flex items-center justify-center`}>
                  <selectedCategory.icon size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{income.source}</p>
                  <p className="text-sm text-gray-500">{selectedCategory.label} • {income.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    +${parseFormattedNumber(income.amount || "0").toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Actions */}
      <div className="card-footer">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="btn-ghost btn-sm"
            disabled={isLoading}
          >
            <X size={16} />
            Reset
          </button>
          
          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary btn-sm"
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
            
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className="btn-primary btn-sm"
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <Plus size={16} />
                  Add Income
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddIncomeForm;
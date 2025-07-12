//src/components/Expense/ExpenseForm.tsx
import { useState } from "react";
import { DollarSign, Calendar, Tag, Plus, X, ShoppingBag, Car, Utensils, Home, Gamepad2, Heart, GraduationCap, Plane, FileText, Wallet } from "lucide-react";
import { useSettings } from "../../context/settingsContext";
import { useTransactionForm } from "../../hooks/useTransactionForm";

type ExpenseFormInput = {
  amount: string;
  date: string;
  source: string;
  category: string;
};

interface AddExpenseFormProps {
  onAddExpense?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Professional predefined expense categories with icons
const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: Utensils, color: 'bg-orange-500' },
  { id: 'transport', label: 'Transportation', icon: Car, color: 'bg-blue-500' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'bg-purple-500' },
  { id: 'entertainment', label: 'Entertainment', icon: Gamepad2, color: 'bg-pink-500' },
  { id: 'bills', label: 'Bills & Utilities', icon: FileText, color: 'bg-gray-500' },
  { id: 'health', label: 'Healthcare', icon: Heart, color: 'bg-red-500' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: 'bg-green-500' },
  { id: 'travel', label: 'Travel', icon: Plane, color: 'bg-indigo-500' },
  { id: 'rent', label: 'Rent & Housing', icon: Home, color: 'bg-yellow-500' },
  { id: 'other', label: 'Other', icon: Wallet, color: 'bg-teal-500' },
];

const AddExpenseForm = ({
  onAddExpense,
  onCancel,
  isLoading: propIsLoading = false,
}: AddExpenseFormProps) => {
  const { t, currency, formatCurrency } = useSettings();
  
  // Use the transaction form hook
  const {
    isLoading: hookIsLoading,
    submitTransaction,
    getCurrencySymbol,
    getAmountPlaceholder,
    currentCurrency
  } = useTransactionForm({
    type: 'expense',
    onSuccess: () => {
      handleReset();
      if (onAddExpense) {
        onAddExpense();
      }
    }
  });

  const [expense, setExpense] = useState<ExpenseFormInput>({
    amount: "",
    source: "",
    category: "",
    date: new Date().toISOString().split('T')[0], // Default to today
  });

  const [errors, setErrors] = useState<Partial<ExpenseFormInput>>({});

  const isLoading = propIsLoading || hookIsLoading;

  const handleChange = (key: keyof ExpenseFormInput, value: string) => {
    setExpense({ ...expense, [key]: value });

    // Clear error when user starts typing
    if (errors[key]) {
      setErrors({ ...errors, [key]: "" });
    }
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers, dots, and commas
    const cleanValue = value.replace(/[^\d.,]/g, '');
    handleChange('amount', cleanValue);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ExpenseFormInput> = {};

    if (!expense.source.trim()) {
      newErrors.source = t('source_required') || "Source is required";
    }

    if (!expense.category.trim()) {
      newErrors.category = t('category_required') || "Category is required";
    }

    if (!expense.amount.trim()) {
      newErrors.amount = t('amount_required') || "Amount is required";
    } else {
      const numAmount = parseFloat(expense.amount.replace(/[,\s]/g, ''));
      if (isNaN(numAmount) || numAmount <= 0) {
        newErrors.amount = t('amount_must_be_positive') || "Amount must be greater than 0";
      }
    }

    if (!expense.date) {
      newErrors.date = t('date_required') || "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await submitTransaction(expense);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleReset = () => {
    setExpense({
      amount: "",
      source: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
  };

  const selectedCategory = EXPENSE_CATEGORIES.find(cat => cat.id === expense.category);
  const isFormValid = expense.source && expense.category && expense.amount && expense.date;

  // Parse amount for preview
  const getPreviewAmount = (): number => {
    const cleanAmount = expense.amount.replace(/[,\s]/g, '');
    const numAmount = parseFloat(cleanAmount);
    return isNaN(numAmount) ? 0 : numAmount;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{t('add_new_expense') || 'Add New Expense'}</h3>
        <p className="card-subtitle">
          {t('track_spending_professional') || 'Track your spending with professional categorization'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-content">
        <div className="space-y-6">
          {/* Currency Display */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-red-600" />
              <span className="text-sm font-medium text-red-800">
                {t('current_currency') || 'Current Currency'}: {currentCurrency} ({getCurrencySymbol()})
              </span>
            </div>
          </div>

          {/* Category Type Selection */}
          <div>
            <label className="input-label">
              <Tag size={16} className="inline mr-2" />
              {t('expense_category') || 'Expense Category'}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {EXPENSE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleChange("category", category.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${expense.category === category.id
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

          {/* Category Description */}
          <div>
            <label className="input-label">
              <Tag size={16} className="inline mr-2" />
              {t('description') || 'Description'}
            </label>
            <input
              type="text"
              value={expense.source}
              onChange={(e) => handleChange("source", e.target.value)}
              placeholder={t('expense_description_placeholder') || "e.g., Lunch at restaurant, Gas for car, Groceries, etc."}
              className={`input-box ${errors.source ? 'error' : ''}`}
              disabled={isLoading}
            />
            {errors.source && (
              <p className="input-error">{errors.source}</p>
            )}
            <p className="input-help">
              {t('expense_description_help') || 'Enter a specific description for this expense'}
            </p>
          </div>

          {/* Amount */}
          <div>
            <label className="input-label">
              <DollarSign size={16} className="inline mr-2" />
              {t('amount') || 'Amount'} ({currentCurrency})
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {getCurrencySymbol()}
              </div>
              <input
                type="text"
                value={expense.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder={getAmountPlaceholder()}
                className={`input-box ${errors.amount ? 'error' : ''}`}
                style={{paddingLeft:"2.3rem"}}
                disabled={isLoading}
              />
            </div>
            {errors.amount && (
              <p className="input-error">{errors.amount}</p>
            )}
            <p className="input-help">
              {t('amount_help') || `Enter the expense amount in ${currentCurrency}`}
            </p>
          </div>

          {/* Date */}
          <div>
            <label className="input-label">
              <Calendar size={16} className="inline mr-2" />
              {t('date') || 'Date'}
            </label>
            <input
              type="date"
              value={expense.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className={`input-box ${errors.date ? 'error' : ''}`}
              disabled={isLoading}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && (
              <p className="input-error">{errors.date}</p>
            )}
            <p className="input-help">
              {t('expense_date_help') || 'Select the date when this expense occurred'}
            </p>
          </div>

          {/* Preview */}
          {isFormValid && selectedCategory && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="text-sm font-medium text-red-800 mb-2">
                {t('preview') || 'Preview'}
              </h4>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${selectedCategory.color} flex items-center justify-center`}>
                  <selectedCategory.icon size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{expense.source}</p>
                  <p className="text-sm text-gray-500">{selectedCategory.label} • {expense.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">
                    {formatCurrency(getPreviewAmount(), currentCurrency)}
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
            {t('reset') || 'Reset'}
          </button>

          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary btn-sm"
                disabled={isLoading}
              >
                {t('cancel') || 'Cancel'}
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
                  {t('add_expense') || 'Add Expense'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseForm;
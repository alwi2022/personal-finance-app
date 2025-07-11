import { useState } from "react";
import { DollarSign, Calendar, Building, Plus, X, Briefcase, CreditCard, TrendingUp, Award, Gift, Home, CircleHelp } from "lucide-react";
import { parseFormattedNumber } from "../../utils/helper";
import { useSettings } from "../../context/settingsContext";
import { useTransactionForm } from "../../hooks/useTransactionForm";

type IncomeFormInput = {
  amount: string;
  date: string;
  source: string;
  category: string;
};

interface AddIncomeFormProps {
  onAddIncome?: (success: boolean) => void; // Changed to just success callback
  onCancel?: () => void;
  isLoading?: boolean;
}

// Professional predefined categories with icons - using translation keys
const INCOME_CATEGORIES = [
  { id: 'salary', labelKey: 'category_salary', icon: Briefcase, color: 'bg-blue-500' },
  { id: 'freelance', labelKey: 'category_freelance', icon: TrendingUp, color: 'bg-green-500' },
  { id: 'business', labelKey: 'category_business', icon: Building, color: 'bg-purple-500' },
  { id: 'investment', labelKey: 'category_investment', icon: CreditCard, color: 'bg-orange-500' },
  { id: 'bonus', labelKey: 'category_bonus', icon: Award, color: 'bg-yellow-500' },
  { id: 'gift', labelKey: 'category_gift', icon: Gift, color: 'bg-pink-500' },
  { id: 'rental', labelKey: 'category_rental', icon: Home, color: 'bg-indigo-500' },
  { id: 'other', labelKey: 'category_other', icon: CircleHelp, color: 'bg-gray-500' },
];

const AddIncomeForm = ({
  onAddIncome,
  onCancel,
  isLoading: externalLoading = false,
}: AddIncomeFormProps) => {
  const { t, currency } = useSettings();
  const { submitIncome, previewInOtherCurrency, isSubmitting } = useTransactionForm();
  
  const [income, setIncome] = useState<IncomeFormInput>({
    amount: "",
    source: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Partial<IncomeFormInput>>({});
  const isLoading = externalLoading || isSubmitting;

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
      newErrors.source = t('income_source_required') || "Income source is required";
    }

    if (!income.category) {
      newErrors.category = t('please_select_category') || "Please select a category";
    }

    if (!income.amount.trim()) {
      newErrors.amount = t('amount_required') || "Amount is required";
    } else if (parseFormattedNumber(income.amount) <= 0) {
      newErrors.amount = t('amount_must_be_positive') || "Amount must be greater than 0";
    }

    if (!income.date) {
      newErrors.date = t('date_required') || "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const success = await submitIncome({
      amount: parseFormattedNumber(income.amount),
      source: income.source,
      category: income.category,
      date: income.date,
    });

    if (success) {
      // Reset form
      setIncome({
        amount: "",
        source: "",
        category: "",
        date: new Date().toISOString().split('T')[0],
      });
      setErrors({});
      
      // Notify parent
      onAddIncome?.(true);
    }
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
  const currencySymbol = currency === 'USD' ? '$' : 'Rp';
  const placeholderAmount = currency === 'USD' ? '1000.00' : '1000000';

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{t('add_new_income') || 'Add New Income'}</h3>
        <p className="card-subtitle">
          {t('record_income_with_categorization') || 'Record your income with professional categorization'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-content">
        <div className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="input-label">
              <Building size={16} className="inline mr-2" />
              {t('income_category') || 'Income Category'}
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
                    <span className="text-sm font-medium">{t(category.labelKey)}</span>
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
              {t('income_source') || 'Income Source'}
            </label>
            <input
              type="text"
              value={income.source}
              onChange={(e) => handleChange("source", e.target.value)}
              placeholder={t('income_source_placeholder') || "e.g., Google Inc, Client ABC, Rental Property"}
              className={`input-box ${errors.source ? 'error' : ''}`}
              disabled={isLoading}
            />
            {errors.source && (
              <p className="input-error">{errors.source}</p>
            )}
            <p className="input-help">
              {t('enter_income_source_help') || 'Enter the specific source of this income'}
            </p>
          </div>

          {/* Amount */}
          <div>
            <label className="input-label">
              <DollarSign size={16} className="inline mr-2" />
              {t('amount')} ({currency})
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {currencySymbol}
              </div>
              <input
                type="text"
                value={income.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder={placeholderAmount}
                className={`input-box pl-8 ${errors.amount ? 'error' : ''}`}
                disabled={isLoading}
              />
            </div>
            {errors.amount && (
              <p className="input-error">{errors.amount}</p>
            )}
            
            {/* Currency conversion preview */}
            {income.amount && parseFormattedNumber(income.amount) > 0 && (
              <p className="input-help text-blue-600 font-medium">
                {previewInOtherCurrency(parseFormattedNumber(income.amount))}
              </p>
            )}
            
            <p className="input-help">
              {t('enter_amount_help') || 'Enter the income amount (numbers only)'}
            </p>
          </div>

          {/* Date */}
          <div>
            <label className="input-label">
              <Calendar size={16} className="inline mr-2" />
              {t('date_received') || 'Date Received'}
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
              {t('select_income_date_help') || 'Select the date when you received this income'}
            </p>
          </div>

          {/* Preview */}
          {isFormValid && selectedCategory && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="text-sm font-medium text-green-800 mb-2">{t('preview') || 'Preview'}</h4>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${selectedCategory.color} flex items-center justify-center`}>
                  <selectedCategory.icon size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{income.source}</p>
                  <p className="text-sm text-gray-500">{t(selectedCategory.labelKey)} • {income.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    +{currencySymbol}{parseFormattedNumber(income.amount || "0").toLocaleString()}
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
                  {t('add_income') || 'Add Income'}
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
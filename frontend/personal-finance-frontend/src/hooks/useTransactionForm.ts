// hooks/useTransactionForm.ts
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSettings } from '../context/settingsContext';
import { TransactionService } from '../services/transactionService';

export const useTransactionForm = () => {
  const { currency, exchangeRate, t } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitIncome = async (formData: {
    amount: number;
    source: string;
    category: string;
    date: string;
  }) => {
    setIsSubmitting(true);
    try {
      await TransactionService.addIncome({
        ...formData,
        currency,
        exchangeRate,
      });
      
      toast.success(t('income_added_successfully') || 'Income added successfully!');
      return true;
    } catch (error: any) {
      console.error('Failed to add income:', error);
      toast.error(t('failed_to_add_income') || 'Failed to add income');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitExpense = async (formData: {
    amount: number;
    source: string;
    category: string;
    date: string;
  }) => {
    setIsSubmitting(true);
    try {
      await TransactionService.addExpense({
        ...formData,
        currency,
        exchangeRate,
      });
      
      toast.success(t('expense_added_successfully') || 'Expense added successfully!');
      return true;
    } catch (error: any) {
      console.error('Failed to add expense:', error);
      toast.error(t('failed_to_add_expense') || 'Failed to add expense');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview conversion for user
  const previewInOtherCurrency = (amount: number) => {
    if (!amount || amount <= 0) return '';
    
    if (currency === 'USD') {
      const idrAmount = amount * exchangeRate;
      return `≈ Rp ${idrAmount.toLocaleString('id-ID')}`;
    } else {
      const usdAmount = amount / exchangeRate;
      return `≈ $${usdAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  return {
    submitIncome,
    submitExpense,
    previewInOtherCurrency,
    isSubmitting,
    currentCurrency: currency,
  };
};
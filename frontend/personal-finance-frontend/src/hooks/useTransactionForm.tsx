// src/hooks/useTransactionForm.ts
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSettings } from '../context/settingsContext';
import { TransactionService } from '../services/transactionService';

interface TransactionFormData {
  amount: string;
  source: string;
  category: string;
  date: string;
}

interface UseTransactionFormOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  type: 'income' | 'expense';
}

export const useTransactionForm = ({ onSuccess, onError, type }: UseTransactionFormOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const { currency, exchangeRate, t, formatCurrency } = useSettings();

  const submitTransaction = async (formData: TransactionFormData) => {
    setIsLoading(true);
    
    try {
      // Parse amount from string input
      const amount = parseFloat(formData.amount.replace(/[,$\s]/g, ''));
      
      if (isNaN(amount) || amount <= 0) {
        throw new Error(t('invalid_amount'));
      }

      // Prepare transaction data with current user's currency preference
      const transactionData = {
        amount: amount,
        source: formData.source.trim(),
        category: formData.category,
        date: formData.date,
        currency: currency, // Use user's current currency preference
        exchangeRate: exchangeRate
      };

      // Call appropriate service method
      let response;
      if (type === 'income') {
        response = await TransactionService.addIncome(transactionData);
      } else {
        response = await TransactionService.addExpense(transactionData);
      }

      // Show success message with formatted amount
      const displayAmount = formatCurrency(amount, currency);
      const successMessage = type === 'income' 
        ? t('income_added_success', { amount: displayAmount })
        : t('expense_added_success', { amount: displayAmount });
      
      toast.success(successMessage);
      
      if (onSuccess) {
        onSuccess();
      }

      return response;
    } catch (error: any) {
      console.error(`Failed to add ${type}:`, error);
      
      const errorMessage = error.message || 
        (type === 'income' ? t('failed_add_income') : t('failed_add_expense'));
      
      toast.error(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format input amount display
  const formatInputDisplay = (value: string): string => {
    // Remove any existing formatting
    const cleanValue = value.replace(/[^\d.]/g, '');
    const numValue = parseFloat(cleanValue);
    
    if (isNaN(numValue)) return '';
    
    // Format based on current currency
    if (currency === 'IDR') {
      return new Intl.NumberFormat('id-ID').format(numValue);
    } else {
      return new Intl.NumberFormat('en-US').format(numValue);
    }
  };

  // Helper function to get currency symbol for input
  const getCurrencySymbol = (): string => {
    return currency === 'IDR' ? 'Rp' : '$';
  };

  // Helper function to get placeholder based on currency
  const getAmountPlaceholder = (): string => {
    return currency === 'IDR' ? '0' : '0.00';
  };

  return {
    isLoading,
    submitTransaction,
    formatInputDisplay,
    getCurrencySymbol,
    getAmountPlaceholder,
    currentCurrency: currency,
    exchangeRate
  };
};
// services/transactionService.ts
import axiosInstance from '../utils/axios-instance';
import { API_PATH } from '../utils/api';
import { type CreateTransactionRequest, type LegacyTransactionRequest, type TypeTransaction } from '../types/type';

export class TransactionService {
  // Add Income with enhanced currency support
  static async addIncome(data: {
    amount: number;
    source: string;
    category: string;
    date: string;
    currency: 'USD' | 'IDR';
    exchangeRate: number;
  }) {
    // Calculate USD equivalent for storage/compatibility
    const amountUSD = data.currency === 'USD' ? data.amount : data.amount / data.exchangeRate;

    // Primary payload with full currency information
    const payload: CreateTransactionRequest = {
      amount: data.amount,           // Original amount in user's selected currency
      currency: data.currency,       // User's selected currency
      amountUSD: amountUSD,          // Calculated USD equivalent
      exchangeRate: data.exchangeRate,
      source: data.source,
      category: data.category,
      date: data.date,
    };

    try {
      const response = await axiosInstance.post(API_PATH.INCOME.ADD_INCOME, payload);
      console.log('Income added successfully:', {
        originalAmount: data.amount,
        currency: data.currency,
        usdEquivalent: amountUSD,
        exchangeRate: data.exchangeRate
      });
      return response;
    } catch (error: any) {
      console.warn('Backend might not support currency fields, falling back to legacy format');
      
      // Fallback: send USD amount for backward compatibility
      const legacyPayload: LegacyTransactionRequest = {
        amount: amountUSD,
        source: data.source,
        category: data.category,
        date: data.date,
      };
      
      console.log('Using legacy payload:', legacyPayload);
      return await axiosInstance.post(API_PATH.INCOME.ADD_INCOME, legacyPayload);
    }
  }

  // Add Expense with enhanced currency support
  static async addExpense(data: {
    amount: number;
    source: string;
    category: string;
    date: string;
    currency: 'USD' | 'IDR';
    exchangeRate: number;
  }) {
    // Calculate USD equivalent for storage/compatibility
    const amountUSD = data.currency === 'USD' ? data.amount : data.amount / data.exchangeRate;

    // Primary payload with full currency information
    const payload: CreateTransactionRequest = {
      amount: data.amount,           // Original amount in user's selected currency
      currency: data.currency,       // User's selected currency
      amountUSD: amountUSD,          // Calculated USD equivalent
      exchangeRate: data.exchangeRate,
      source: data.source,
      category: data.category,
      date: data.date,
    };

    try {
      const response = await axiosInstance.post(API_PATH.EXPENSE.ADD_EXPENSE, payload);
      console.log('Expense added successfully:', {
        originalAmount: data.amount,
        currency: data.currency,
        usdEquivalent: amountUSD,
        exchangeRate: data.exchangeRate
      });
      return response;
    } catch (error: any) {
      console.warn('Backend might not support currency fields, falling back to legacy format');
      
      // Fallback: send USD amount for backward compatibility
      const legacyPayload: LegacyTransactionRequest = {
        amount: amountUSD,
        source: data.source,
        category: data.category,
        date: data.date,
      };
      
      console.log('Using legacy payload:', legacyPayload);
      return await axiosInstance.post(API_PATH.EXPENSE.ADD_EXPENSE, legacyPayload);
    }
  }

  // Get all transactions
  static async getAllIncome(): Promise<TypeTransaction[]> {
    const response = await axiosInstance.get(API_PATH.INCOME.GET_ALL_INCOME);
    return response.data;
  }

  static async getAllExpenses(): Promise<TypeTransaction[]> {
    const response = await axiosInstance.get(API_PATH.EXPENSE.GET_ALL_EXPENSE);
    return response.data;
  }

  // Delete transactions
  static async deleteIncome(id: string) {
    return await axiosInstance.delete(API_PATH.INCOME.DELETE_INCOME.replace(':id', id));
  }

  static async deleteExpense(id: string) {
    return await axiosInstance.delete(API_PATH.EXPENSE.DELETE_EXPENSE.replace(':id', id));
  }

  // Download Excel
  static async downloadIncomeExcel() {
    return await axiosInstance.get(API_PATH.INCOME.DOWNLOAD_EXCEL, { responseType: 'blob' });
  }

  static async downloadExpenseExcel() {
    return await axiosInstance.get(API_PATH.EXPENSE.DOWNLOAD_EXCEL, { responseType: 'blob' });
  }

  // Dashboard data
  static async getDashboardData() {
    return await axiosInstance.get(API_PATH.DASHBOARD.GET_DASHBOARD_DATA);
  }

  // Enhanced helper to get display amount with proper currency handling
  static getDisplayAmount(transaction: TypeTransaction, targetCurrency: 'USD' | 'IDR' = 'USD', exchangeRate: number = 16245): number {
    // If transaction has native currency data, use it
    if (transaction.currency && transaction.amountUSD !== undefined) {
      // Convert from stored data to target currency
      if (targetCurrency === 'USD') {
        return transaction.amountUSD;
      } else {
        return transaction.amountUSD * exchangeRate;
      }
    }
    
    // Fallback: assume legacy data is in USD
    if (targetCurrency === 'USD') {
      return transaction.amount;
    } else {
      return transaction.amount * exchangeRate;
    }
  }

  // New helper: Get original amount in its stored currency
  static getOriginalAmount(transaction: TypeTransaction): { amount: number; currency: 'USD' | 'IDR' } {
    if (transaction.currency) {
      return {
        amount: transaction.amount,
        currency: transaction.currency
      };
    }
    
    // Legacy data - assume USD
    return {
      amount: transaction.amount,
      currency: 'USD'
    };
  }

  // Helper to calculate totals with mixed currencies
  static calculateTotalInUSD(transactions: TypeTransaction[], exchangeRate: number = 16245): number {
    return transactions.reduce((total, transaction) => {
      if (transaction.amountUSD !== undefined) {
        return total + transaction.amountUSD;
      }
      
      // Legacy data - assume it's already in USD
      return total + transaction.amount;
    }, 0);
  }

  // Helper to convert array of transactions to target currency
  static convertTransactionsToTargetCurrency(
    transactions: TypeTransaction[], 
    targetCurrency: 'USD' | 'IDR', 
    exchangeRate: number = 16245
  ): Array<TypeTransaction & { displayAmount: number }> {
    return transactions.map(transaction => ({
      ...transaction,
      displayAmount: this.getDisplayAmount(transaction, targetCurrency, exchangeRate)
    }));
  }
}
// services/transactionService.ts
import axiosInstance from '../utils/axios-instance';
import { API_PATH } from '../utils/api';
import type { CreateTransactionRequest, LegacyTransactionRequest } from '../types/type';

export class TransactionService {
  // Add Income with currency support
  static async addIncome(data: {
    amount: number;
    source: string;
    category: string;
    date: string;
    currency: 'USD' | 'IDR';
    exchangeRate: number;
  }) {
    // Calculate USD amount for normalization
    const amountUSD = data.currency === 'USD' 
      ? data.amount 
      : data.amount / data.exchangeRate;

    // Prepare payload - try new format first, fallback to legacy
    const payload: CreateTransactionRequest = {
      amount: data.amount,
      currency: data.currency,
      amountUSD: amountUSD,
      exchangeRate: data.exchangeRate,
      source: data.source,
      category: data.category,
      date: data.date,
    };

    try {
      // Try new API format first
      return await axiosInstance.post(API_PATH.INCOME.ADD_INCOME, payload);
    } catch (error: any) {
      // If backend doesn't support new format, use legacy
      console.warn('Backend might not support currency fields, using legacy format');
      const legacyPayload: LegacyTransactionRequest = {
        amount: amountUSD, // Save as USD for now
        source: data.source,
        category: data.category,
        date: data.date,
      };
      return await axiosInstance.post(API_PATH.INCOME.ADD_INCOME, legacyPayload);
    }
  }

  // Add Expense with currency support
  static async addExpense(data: {
    amount: number;
    source: string;
    category: string;
    date: string;
    currency: 'USD' | 'IDR';
    exchangeRate: number;
  }) {
    const amountUSD = data.currency === 'USD' 
      ? data.amount 
      : data.amount / data.exchangeRate;

    const payload: CreateTransactionRequest = {
      amount: data.amount,
      currency: data.currency,
      amountUSD: amountUSD,
      exchangeRate: data.exchangeRate,
      source: data.source,
      category: data.category,
      date: data.date,
    };

    try {
      return await axiosInstance.post(API_PATH.EXPENSE.ADD_EXPENSE, payload);
    } catch (error: any) {
      console.warn('Backend might not support currency fields, using legacy format');
      const legacyPayload: LegacyTransactionRequest = {
        amount: amountUSD,
        source: data.source,
        category: data.category,
        date: data.date,
      };
      return await axiosInstance.post(API_PATH.EXPENSE.ADD_EXPENSE, legacyPayload);
    }
  }

  // Get all income
  static async getAllIncome() {
    return await axiosInstance.get(API_PATH.INCOME.GET_ALL_INCOME);
  }

  // Get all expenses
  static async getAllExpenses() {
    return await axiosInstance.get(API_PATH.EXPENSE.GET_ALL_EXPENSE);
  }

  // Delete income
  static async deleteIncome(id: string) {
    return await axiosInstance.delete(API_PATH.INCOME.DELETE_INCOME.replace(':id', id));
  }

  // Delete expense
  static async deleteExpense(id: string) {
    return await axiosInstance.delete(API_PATH.EXPENSE.DELETE_EXPENSE.replace(':id', id));
  }

  // Download Excel
  static async downloadIncomeExcel() {
    return await axiosInstance.get(API_PATH.INCOME.DOWNLOAD_EXCEL, {
      responseType: 'blob'
    });
  }

  static async downloadExpenseExcel() {
    return await axiosInstance.get(API_PATH.EXPENSE.DOWNLOAD_EXCEL, {
      responseType: 'blob'
    });
  }
}
import { type ReactNode } from "react";

export interface AuthLayoutProps {
  children: ReactNode;
}


export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  profileImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface UserContextType {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}


// Untuk Login response dari backend
export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface UploadImageResponse {
  imageUrl: string;
}




export interface TypeTransaction {
  _id: string;
  amount: number;           
  currency?: 'USD' | 'IDR'; 
  amountUSD?: number;       
  exchangeRate?: number;    
  source: string;
  category: string;
  date: string;
  type?: 'income' | 'expense';
  userId?: string;
  createdAt?: string;
  updatedAt?: string;

}



// For API requests
export interface CreateTransactionRequest {
  amount: number;
  currency: 'USD' | 'IDR';
  amountUSD: number;
  exchangeRate: number;
  source: string;
  category: string;
  date: string;
}

// For backward compatibility with existing API
export interface LegacyTransactionRequest {
  amount: number;
  source: string;
  category: string;
  date: string;
}

export interface DashboardData {
  totalIncome: number;
  totalExpanse: number;
  recentTransactions: Transaction[];
  incomeLast60Days: {
    transactions: Transaction[];
    total: number;
  };
  expanseLast60Days: {
    transactions: Transaction[];
    total: number;
  };
}



export interface Transaction {
  _id: string;
  userId: string;
  icon: string;
  category?: string;
  source?: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  type: "income" | "expense";
}

export interface DashboardData {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  recentTransactions: Transaction[];
  expenseLast30Days: {
    total: number;
    transactions: Transaction[];
  };
  incomeLast60Days: {
    total: number;
    transactions: Transaction[];
  };
}



export interface RecentTransactionsProps {
  transactions: TypeTransaction[];
  onSeeMore: () => void;
}
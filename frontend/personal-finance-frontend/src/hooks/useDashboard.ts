// ========================================
// TYPES & INTERFACES
// ========================================

export interface Transaction {
    _id: string;
    userId: string;
    source: string;
    category: string;
    amount: number;
    date: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    type?: 'income' | 'expense';
}

export interface DashboardData {
    totalBalance: number;
    totalIncome: number;
    totalExpense: number;
    expenseLast30Days: {
        total: number;
        transactions: Transaction[];
    };
    incomeLast60Days: {
        total: number;
        transactions: Transaction[];
    };
    recentTransactions: Transaction[];
}

// ========================================
// DASHBOARD HOOK
// ========================================

import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios-instance';
import { API_PATH } from '../utils/api';

interface UseDashboardReturn {
    data: DashboardData | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useDashboard = (): UseDashboardReturn => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.get<DashboardData>(API_PATH.DASHBOARD.GET_DASHBOARD_DATA);
            setData(response.data);
        } catch (err: any) {
            console.error('Failed to fetch dashboard data:', err);
            setError(err?.response?.data?.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return {
        data,
        loading,
        error,
        refetch: fetchDashboardData,
    };
};



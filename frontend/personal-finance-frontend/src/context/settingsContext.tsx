import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../data/lang";

export type Language = 'en' | 'id';
export type Currency = 'USD' | 'IDR';

export interface SettingsContextType {
    language: Language;
    currency: Currency; // Display currency yang dipilih user
    baseCurrency: Currency; // Base currency untuk data (biasanya USD)
    setLanguage: (lang: Language) => void;
    setCurrency: (curr: Currency) => void;
    formatCurrency: (amount: number, sourceCurrency?: Currency) => string;
    formatUSDAmount: (amount: number) => string;
    formatIDRAmount: (amount: number) => string;
    convertCurrency: (amount: number, from: Currency, to: Currency) => number;
    t: (key: string, params?: { [key: string]: string | number }) => string;
    exchangeRate: number;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('en');
    const [currency, setCurrencyState] = useState<Currency>('USD'); // Display currency
    const [baseCurrency] = useState<Currency>('USD'); // Base currency untuk data
    
    // Fixed exchange rate - update manual when needed
    const exchangeRate = 16245; // 1 USD = 16,245 IDR

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem('app_language') as Language;
        const savedCurrency = localStorage.getItem('app_currency') as Currency;

        if (savedLanguage && ['en', 'id'].includes(savedLanguage)) {
            setLanguageState(savedLanguage);
        }

        if (savedCurrency && ['USD', 'IDR'].includes(savedCurrency)) {
            setCurrencyState(savedCurrency);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('app_language', lang);
    };

    const setCurrency = (curr: Currency) => {
        setCurrencyState(curr);
        localStorage.setItem('app_currency', curr);
    };

    // Convert between currencies
    const convertCurrency = (amount: number, from: Currency, to: Currency): number => {
        if (from === to) return amount;
        
        if (from === 'USD' && to === 'IDR') {
            return amount * exchangeRate;
        } else if (from === 'IDR' && to === 'USD') {
            return amount / exchangeRate;
        }
        
        return amount;
    };

    // Main format function with automatic conversion
    const formatCurrency = (amount: number, sourceCurrency: Currency = baseCurrency): string => {
        // Convert amount to display currency if different
        const convertedAmount = convertCurrency(amount, sourceCurrency, currency);
        const absAmount = Math.abs(convertedAmount);

        if (currency === 'IDR') {
            if (absAmount >= 1000000000) {
                return `Rp ${(convertedAmount / 1000000000).toFixed(1)}M`;
            } else if (absAmount >= 1000000) {
                return `Rp ${(convertedAmount / 1000000).toFixed(1)}jt`;
            } else if (absAmount >= 1000) {
                return `Rp ${(convertedAmount / 1000).toFixed(1)}rb`;
            }
            return `Rp ${Math.round(convertedAmount).toLocaleString('id-ID')}`;
        } else {
            if (absAmount >= 1000000) {
                return `$${(convertedAmount / 1000000).toFixed(1)}M`;
            } else if (absAmount >= 1000) {
                return `$${(convertedAmount / 1000).toFixed(1)}K`;
            }
            return `$${Math.round(convertedAmount).toLocaleString('en-US')}`;
        }
    };

    // Helper functions untuk specific currencies
    const formatUSDAmount = (amount: number): string => {
        return formatCurrency(amount, 'USD');
    };

    const formatIDRAmount = (amount: number): string => {
        return formatCurrency(amount, 'IDR');
    };

    const t = (key: string, params?: { [key: string]: string | number }): string => {
        let translation = translations[language][key as keyof typeof translations['en']] || key;

        // Handle parameter substitution
        if (params) {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
                translation = translation.replace(`{${paramKey}}`, paramValue.toString());
            });
        }

        return translation;
    };

    return (
        <SettingsContext.Provider value={{
            language,
            currency,
            baseCurrency,
            setLanguage,
            setCurrency,
            formatCurrency,
            formatUSDAmount,
            formatIDRAmount,
            convertCurrency,
            t,
            exchangeRate,
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
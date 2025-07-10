import { createContext, useContext, useEffect, useState } from "react";

export type Language = 'en' | 'id';
export type Currency = 'USD' | 'IDR';

export interface SettingsContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  formatCurrency: (amount: number) => string;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);


 const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    income: 'Income',
    expense: 'Expense',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    
    // Auth
    login: 'Login',
    signup: 'Sign Up',
    welcome_back: 'Welcome back',
    create_account: 'Create Account',
    email: 'Email',
    password: 'Password',
    confirm_password: 'Confirm Password',
    full_name: 'Full Name',
    remember_me: 'Remember me',
    forgot_password: 'Forgot password?',
    sign_in: 'Sign in',
    sign_up: 'Sign up',
    
    // Dashboard
    total_balance: 'Total Balance',
    monthly_income: 'Monthly Income',
    monthly_expense: 'Monthly Expense',
    recent_transactions: 'Recent Transactions',
    
    // Statistics
    total: 'Total',
    average: 'Average',
    highest: 'Highest',
    lowest: 'Lowest',
    peak: 'Peak',
    minimum: 'Minimum',
    
    // Chart
    amount: 'Amount',
    category: 'Category',
    month: 'Month',
    showing_data_points: 'Showing {count} data points',
    range: 'Range',
    
    // Profile & Settings
    language_settings: 'Language Settings',
    currency_settings: 'Currency Settings',
    save_changes: 'Save Changes',
    profile_updated: 'Profile updated successfully',
    
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    date: 'Date',
    description: 'Description',
    
    // Months
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
    
    // Short months
    jan: 'Jan',
    feb: 'Feb',
    mar: 'Mar',
    apr: 'Apr',
    may_short: 'May',
    jun: 'Jun',
    jul: 'Jul',
    aug: 'Aug',
    sep: 'Sep',
    oct: 'Oct',
    nov: 'Nov',
    dec: 'Dec',
  },
  id: {
    // Navigation
    dashboard: 'Dasbor',
    income: 'Pemasukan',
    expense: 'Pengeluaran',
    profile: 'Profil',
    settings: 'Pengaturan',
    logout: 'Keluar',
    
    // Auth
    login: 'Masuk',
    signup: 'Daftar',
    welcome_back: 'Selamat datang kembali',
    create_account: 'Buat Akun',
    email: 'Email',
    password: 'Kata Sandi',
    confirm_password: 'Konfirmasi Kata Sandi',
    full_name: 'Nama Lengkap',
    remember_me: 'Ingat saya',
    forgot_password: 'Lupa kata sandi?',
    sign_in: 'Masuk',
    sign_up: 'Daftar',
    
    // Dashboard
    total_balance: 'Total Saldo',
    monthly_income: 'Pemasukan Bulanan',
    monthly_expense: 'Pengeluaran Bulanan',
    recent_transactions: 'Transaksi Terkini',
    
    // Statistics
    total: 'Total',
    average: 'Rata-rata',
    highest: 'Tertinggi',
    lowest: 'Terendah',
    peak: 'Puncak',
    minimum: 'Minimum',
    
    // Chart
    amount: 'Jumlah',
    category: 'Kategori',
    month: 'Bulan',
    showing_data_points: 'Menampilkan {count} titik data',
    range: 'Rentang',
    
    // Profile & Settings
    language_settings: 'Pengaturan Bahasa',
    currency_settings: 'Pengaturan Mata Uang',
    save_changes: 'Simpan Perubahan',
    profile_updated: 'Profil berhasil diperbarui',
    
    // Common
    loading: 'Memuat...',
    save: 'Simpan',
    cancel: 'Batal',
    edit: 'Edit',
    delete: 'Hapus',
    add: 'Tambah',
    search: 'Cari',
    filter: 'Filter',
    date: 'Tanggal',
    description: 'Deskripsi',
    
    // Months
    january: 'Januari',
    february: 'Februari',
    march: 'Maret',
    april: 'April',
    may: 'Mei',
    june: 'Juni',
    july: 'Juli',
    august: 'Agustus',
    september: 'September',
    october: 'Oktober',
    november: 'November',
    december: 'Desember',
    
    // Short months
    jan: 'Jan',
    feb: 'Feb',
    mar: 'Mar',
    apr: 'Apr',
    may_short: 'Mei',
    jun: 'Jun',
    jul: 'Jul',
    aug: 'Agu',
    sep: 'Sep',
    oct: 'Okt',
    nov: 'Nov',
    dec: 'Des',
  },
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('en');
    const [currency, setCurrencyState] = useState<Currency>('USD');
  
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
  
    const formatCurrency = (amount: number): string => {
      const absAmount = Math.abs(amount);
      
      if (currency === 'IDR') {
        if (absAmount >= 1000000000) {
          return `Rp ${(amount / 1000000000).toFixed(1)}M`;
        } else if (absAmount >= 1000000) {
          return `Rp ${(amount / 1000000).toFixed(1)}jt`;
        } else if (absAmount >= 1000) {
          return `Rp ${(amount / 1000).toFixed(1)}rb`;
        }
        return `Rp ${amount.toLocaleString('id-ID')}`;
      } else {
        if (absAmount >= 1000000) {
          return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (absAmount >= 1000) {
          return `$${(amount / 1000).toFixed(1)}K`;
        }
        return `$${amount.toLocaleString('en-US')}`;
      }
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
        setLanguage,
        setCurrency,
        formatCurrency,
        t,
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
      
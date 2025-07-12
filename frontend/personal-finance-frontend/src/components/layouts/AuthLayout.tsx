import { TrendingUp } from "lucide-react";
import CARD_2 from "../../assets/chartThum.png";
import type { AuthLayoutProps } from "../../types/type";
import { LuTrendingUpDown } from "react-icons/lu";
import LanguageToggle from "../common/LanguageToggle"
import { useSettings } from "../../context/settingsContext";

// Enhanced interface with variants
interface EnhancedAuthLayoutProps extends AuthLayoutProps {
  variant?: 'split' | 'fullscreen' | 'minimal';
  showLanguageToggle?: boolean;
}

const AuthLayout = ({
  children,
  variant = 'split',
  showLanguageToggle = true
}: EnhancedAuthLayoutProps) => {
  const { t } = useSettings();

  if (variant === 'split') {
    return (
      <div className="flex relative">
        {/* Language Toggle - Enhanced Visibility */}
        {showLanguageToggle && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-2">
              <LanguageToggle variant="header" />
            </div>
          </div>
        )}

        {/* Kiri: Form login */}
        <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12 bg-white">
          {/* Header with Logo */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('app_name') || 'Personal Finance'}
              </h1>
            </div>
            
            {/* Language Toggle for Mobile - Visible on small screens */}
            {showLanguageToggle && (
              <div className="md:hidden">
                <LanguageToggle variant="minimal" />
              </div>
            )}
          </div>

         

          {children}
        </div>

        {/* Kanan: Ilustrasi dan dekorasi */}
        <div className="hidden md:block w-[40vw] h-screen bg-violet-50 bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
          {/* Kotak dekorasi */}
          <div className="w-48 h-48 bg-purple-600 rounded-[40px] absolute -top-7 -left-5" />
          <div className="w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-10" />
          <div className="w-48 h-48 bg-violet-500 rounded-[40px] absolute -bottom-7 -right-5" />
          
          {/* Stats Card */}
          <div className="grid grid-cols-1 mt-12 z-10 relative">
            <StatsInfoCard
              icons={<LuTrendingUpDown />}
              label={t('track_income_expenses') || "Track Your income and expenses"}
              value="430.000"
              color="bg-primary"
            />
          </div>
          
          {/* Gambar utama */}
          <img
            src={CARD_2}
            className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15"
            alt={t('expense_tracker_illustration') || "Expense tracker illustration"}
          />
        </div>
      </div>
    );
  }

  // Fullscreen Layout (Terms, Privacy Policy, Legal Pages)
  if (variant === 'fullscreen') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header dengan Language Toggle */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {t('app_name') || 'Personal Finance'}
                </h1>
              </div>

              {/* Language Toggle - More Prominent */}
              {showLanguageToggle && (
                <div className="flex items-center gap-4">
                  <LanguageToggle variant="header" />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white mt-12">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <p className="text-center text-sm text-gray-500">
              © 2025 {t('app_name') || 'Personal Finance'}. {t('all_rights_reserved') || 'All rights reserved'}.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Minimal Layout (Simple pages, standalone forms)
  if (variant === 'minimal') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
        {/* Language Toggle - Enhanced Card Style */}
        {showLanguageToggle && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
              <LanguageToggle variant="header" />
            </div>
          </div>
        )}

        <div className="w-full max-w-md">
          {/* Logo */}
          {/* <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('app_name') || 'Personal Finance'}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {t('app_tagline') || 'Take control of your financial future'}
            </p>
          </div> */}

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {children}
          </div>
          
     
        </div>
      </div>
    );
  }

  // Default to split layout
  return null;
};

interface StatsInfoCardProps {
  icons: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const StatsInfoCard = ({ icons, label, value, color }: StatsInfoCardProps) => {
  return (
    <div className="flex gap-6 bg-white rounded-xl p-4 shadow-md shadow-purple-400/10 border border-gray-400/20 z-10 relative">
      <div className={`w-12 h-12 flex items-center justify-center text-[26px] text-white rounded-full ${color} drop-shadow-xl`}>
        {icons}
      </div>
      <div className="flex flex-col gap-1">
        <h6 className="text-xs mb-1 text-gray-500">{label}</h6>
        <p className="text-[20px]">{value}</p>
      </div>
    </div>
  );
};

export default AuthLayout;
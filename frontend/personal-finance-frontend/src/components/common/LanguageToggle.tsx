
import { Globe } from "lucide-react";
import { useSettings } from "../../context/settingsContext";

interface LanguageToggleProps {
  variant?: 'header' | 'auth' | 'minimal';
  className?: string;
}

const LanguageToggle = ({ variant = 'header', className = '' }: LanguageToggleProps) => {
  const { language, setLanguage } = useSettings();

  const handleLanguageChange = (lang: 'en' | 'id') => {
    setLanguage(lang);
  };

  // Header variant (for authenticated pages)
  if (variant === 'header') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Globe size={16} className="text-gray-500" />
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              language === 'en'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => handleLanguageChange('id')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              language === 'id'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ID
          </button>
        </div>
      </div>
    );
  }

  // Auth variant (for login/signup pages)
  if (variant === 'auth') {
    return (
      <div className={`flex items-center justify-center gap-3 ${className}`}>
        <button
          onClick={() => handleLanguageChange('en')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
            language === 'en'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <span className="text-sm font-medium">🇺🇸 English</span>
        </button>
        <button
          onClick={() => handleLanguageChange('id')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
            language === 'id'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <span className="text-sm font-medium">🇮🇩 Indonesia</span>
        </button>
      </div>
    );
  }

  // Minimal variant (top corner)
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Globe size={14} className="text-gray-400" />
      <button
        onClick={() => handleLanguageChange(language === 'en' ? 'id' : 'en')}
        className="text-sm text-gray-600 hover:text-gray-900 font-medium"
      >
        {language === 'en' ? 'ID' : 'EN'}
      </button>
    </div>
  );
};

export default LanguageToggle;
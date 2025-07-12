import { Menu, X, TrendingUp, Bell, Search, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { useSettings } from "../../context/settingsContext";
import { UserContext } from "../../context/userContext";
interface NavbarProps {
  activeMenu: string;
  toggleSideMenu: () => void;
  isSideMenuOpen: boolean;
}

const Navbar = ({ toggleSideMenu, isSideMenuOpen }: NavbarProps) => {
  const navigate = useNavigate();
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const { t } = useSettings();

  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used inside a UserProvider");
  }

  const { user } = userContext;
  const handleNotificationClick = () => {
    if (user?.email?.includes("bunga@")) {
      alert("🎉 Fitur khusus tersedia untuk pengguna 'bunga@'");

    }
  };






  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSettingsDropdown(false);
      }
    };

    if (showSettingsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettingsDropdown]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
    setShowSettingsDropdown(false);
  };

  return (
    <nav className="dashboard-header">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSideMenu}
          className="btn-icon"
          aria-label="Toggle navigation"
        >
          {isSideMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp size={18} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            <button className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/')}>
              {t('app_name')}
            </button>
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="btn-icon desktop-only" aria-label="Search">
          <Search size={18} />
        </button>

        <button className="btn-icon relative"
          onClick={handleNotificationClick}
          aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          </span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            className="btn-icon desktop-only hover:bg-gray-100 transition-colors"
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>

          {showSettingsDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                onClick={() => {
                  navigate("/dashboard/profile");
                  setShowSettingsDropdown(false);
                }}
              >
                <Settings size={16} />
                {t('profile_settings')}
              </button>




              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                onClick={handleLogout}
              >
                <X size={16} />
                {t('logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
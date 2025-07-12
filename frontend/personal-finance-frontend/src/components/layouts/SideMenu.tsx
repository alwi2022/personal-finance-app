import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, LogOut, X } from "lucide-react";
import { UserContext } from "../../context/userContext";
import { useSettings } from "../../context/settingsContext";
import { SIDE_MENU_DATA } from "../../utils/data";
import CharacterAvatar from "../Cards/CharAvatar";
import { useDashboard } from "../../hooks/useDashboard";

interface SideMenuProps {
  activeMenu: string;
  isOpen: boolean;
  onClose?: () => void;
}

const SideMenu = ({ activeMenu, isOpen, onClose }: SideMenuProps) => {
  const userContext = useContext(UserContext);
  const { t, formatCurrency, currency } = useSettings();
  const { data: dashboardData, loading: dashboardLoading } = useDashboard();
  
  if (!userContext) {
    throw new Error("UserContext must be used inside a UserProvider");
  }

  const { user, clearUser } = userContext;
  const navigate = useNavigate();

  const handleClick = (route: string) => {
    if (route === "/logout") {
      handleLogout();
    } else {
      navigate(route);
    }
    onClose?.();
  };

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  // Calculate this month's data (last 30 days expense vs last 60 days income)
  const getThisMonthData = () => {
    if (!dashboardData) return { balance: 0, change: 0, isPositive: false };
    
    const monthlyIncome = dashboardData.incomeLast60Days.total;
    const monthlyExpense = dashboardData.expenseLast30Days.total;
    const monthlyBalance = monthlyIncome - monthlyExpense;
    
    return {
      balance: dashboardData.totalBalance,
      change: monthlyBalance,
      isPositive: monthlyBalance >= 0
    };
  };

  const monthlyData = getThisMonthData();

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="dashboard-sidebar h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              FinanceTracker
            </h2>
          </div>

          <button
            onClick={onClose}
            className="btn-icon"
            aria-label={t('close_navigation')}
          >
            <X size={18} />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Profile Picture */}
            <div className="relative">
              {user?.profileImageUrl ? (
                <img
                  src={encodeURI(user.profileImageUrl)}
                  alt={t('profile_picture')}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                />
              ) : (
                <CharacterAvatar
                  fullName={user?.fullName}
                  width="w-16"
                  height="h-16"
                  style="text-lg"
                />
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {/* User Info */}
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900 text-sm">
                {user?.fullName || t('user_default_name')}
              </h3>
              <p className="text-xs text-gray-500">
                {user?.email || "user@example.com"}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              <div className="text-center">
                <p className="text-xs text-gray-500">{t('balance')}</p>
                {dashboardLoading ? (
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
                ) : (
                  <p className={`text-sm font-semibold ${
                    monthlyData.balance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(monthlyData.balance, currency)}
                  </p>
                )}
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">{t('this_month')}</p>
                {dashboardLoading ? (
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
                ) : (
                  <p className={`text-sm font-semibold ${
                    monthlyData.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                 {formatCurrency(monthlyData.balance, currency)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {SIDE_MENU_DATA.map((item, index) => (
            <button
              key={`menu_${index}`}
              className={`nav-item w-full ${activeMenu === item.label ? "active" : ""}`}
              onClick={() => handleClick(item.path)}
            >
              <item.icon className="nav-item-icon" />
              <span className="flex-1 text-left">
                {t(item.translationKey || item.label.toLowerCase())}
              </span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleLogout}
            className="nav-item w-full text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="nav-item-icon" />
            <span className="flex-1 text-left">{t('logout')}</span>
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-400">v1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideMenu;
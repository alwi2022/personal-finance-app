import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, LogOut, X } from "lucide-react";
import { UserContext } from "../../context/userContext";
import { SIDE_MENU_DATA } from "../../utils/data";
import CharacterAvatar from "../Cards/CharAvatar";

interface SideMenuProps {
  activeMenu: string;
  onClose?: () => void;
}

const SideMenu = ({ activeMenu, onClose }: SideMenuProps) => {
  const userContext = useContext(UserContext);

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
    onClose?.(); // Close mobile sidebar after navigation
  };

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="dashboard-sidebar">
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
        
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="btn-icon lg:hidden"
          aria-label="Close navigation"
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
                alt="Profile"
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
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          {/* User Info */}
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 text-sm">
              {user?.fullName || "User"}
            </h3>
            <p className="text-xs text-gray-500">
              {user?.email || "user@example.com"}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Balance</p>
              <p className="text-sm font-semibold text-gray-900">$12,450</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">This Month</p>
              <p className="text-sm font-semibold text-green-600">+$2,340</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {SIDE_MENU_DATA.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`nav-item w-full ${
              activeMenu === item.label ? "active" : ""
            }`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className="nav-item-icon" />
            <span className="flex-1 text-left">{item.label}</span>
            
            {/* Badge for notifications or counts */}
            {item.label === "Dashboard" && (
              <span className="badge badge-primary text-xs">3</span>
            )}
            {item.label === "Income" && (
              <span className="badge badge-success text-xs">New</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="nav-item w-full text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="nav-item-icon" />
          <span className="flex-1 text-left">Logout</span>
        </button>

        {/* Version Info */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-400">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
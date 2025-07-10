import { Menu, X, TrendingUp, Bell, Search, Settings } from "lucide-react";

interface NavbarProps {
  activeMenu: string;
  toggleSideMenu: () => void;
  isSideMenuOpen: boolean;
}

const Navbar = ({ toggleSideMenu, isSideMenuOpen }: NavbarProps) => {
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
            FinanceTracker
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="btn-icon desktop-only">
          <Search size={18} />
        </button>
        <button className="btn-icon relative">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          </span>
        </button>
        <button className="btn-icon desktop-only">
          <Settings size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

import { useState } from "react";
import { Menu, X, TrendingUp, Bell, Search, Settings } from "lucide-react";
import SideMenu from "./SideMenu";

interface NavbarProps {
  activeMenu: string;
}

const Navbar = ({ activeMenu }: NavbarProps) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  const toggleSideMenu = () => {
    setOpenSideMenu(!openSideMenu);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {openSideMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSideMenu}
        />
      )}

      {/* Navbar */}
      <nav className="dashboard-header">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSideMenu}
            className="btn-icon lg:hidden"
            aria-label="Toggle navigation"
          >
            {openSideMenu ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              FinanceTracker
            </h2>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Search Button - Desktop Only */}
          <button className="btn-icon desktop-only">
            <Search size={18} />
          </button>

          {/* Notifications */}
          <button className="btn-icon relative">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
          </button>

          {/* Settings */}
          <button className="btn-icon desktop-only">
            <Settings size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile SideMenu */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 
        transform transition-transform duration-300 ease-in-out lg:hidden
        ${openSideMenu ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SideMenu
          activeMenu={activeMenu}
          onClose={toggleSideMenu}
        />
      </div>
    </>
  );
};

export default Navbar;
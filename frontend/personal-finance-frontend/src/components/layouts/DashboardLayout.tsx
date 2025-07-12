import { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeMenu: string;
}

const DashboardLayout = ({ children, activeMenu }: DashboardLayoutProps) => {
  const userContext = useContext(UserContext);
  const [openSideMenu, setOpenSideMenu] = useState(true);

  if (!userContext) {
    throw new Error("UserContext must be used inside a UserProvider");
  }

  const { user } = userContext;

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="loading-spinner w-8 h-8 mx-auto"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container relative min-h-screen">
      <Navbar
        activeMenu={activeMenu}
        toggleSideMenu={() => setOpenSideMenu(prev => !prev)}
        isSideMenuOpen={openSideMenu}
      />

      <SideMenu
        activeMenu={activeMenu}
        isOpen={openSideMenu}
        onClose={() => setOpenSideMenu(false)}
      />

      <div className="flex">
        <main
          className={`dashboard-main transition-all duration-300 ${
            openSideMenu ? "ml-64" : "ml-0"
          } flex-1`}
        >
          <div className="dashboard-content">
            <div className="fade-in">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

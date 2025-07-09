import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeMenu: string;
}

const DashboardLayout = ({ children, activeMenu }: DashboardLayoutProps) => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext must be used inside a UserProvider");
  }

  const { user } = userContext;

  // Loading state
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
    <div className="dashboard-container">
      {/* Top Navigation */}
      <Navbar activeMenu={activeMenu} />

      {/* Layout Container */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="desktop-only">
          <SideMenu activeMenu={activeMenu} />
        </div>

        {/* Main Content */}
        <main className="dashboard-main">
          

          {/* Page Content */}
          <div className="dashboard-content">
            <div className="fade-in">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
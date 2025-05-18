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

  return (
    <div>
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          {/* SideMenu hanya tampil di layar besar */}
          <div className="hidden max-[1000px]:hidden lg:block">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="p-4">
            <h1 className="text-xl font-medium mb-4">Welcome {user.fullName}</h1>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { SIDE_MENU_DATA } from "../../utils/data";
import CharacterAvatar from "../Cards/CharAvatar";

interface SideMenuProps {
  activeMenu: string;
}

const SideMenu = ({ activeMenu }: SideMenuProps) => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext must be used inside a UserProvider");
  }

  const { user, clearUser } = userContext;
  console.log(user?.profileImageUrl, "user profile image");


  const navigate = useNavigate();

  const handleClick = (route: string) => {
    if (route === "/logout") {
      handleLogout();
    } else {
      navigate(route);
    }
  };

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.profileImageUrl ? (
          <img
          src={encodeURI(user.profileImageUrl)}
        
            alt="profile"
            className="w-20 h-20 rounded-full object-cover bg-slate-400"
          />
        ) : (
          <CharacterAvatar
            fullName={user?.fullName}
            width="w-20"
            height="h-20"
            style="text-xl"
          />

        )}

        <h5 className="text-gray-950 font-medium leading-6">
          {user?.fullName || "hai"}
        </h5>
      </div>

      <div>
        {SIDE_MENU_DATA.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px] ${activeMenu === item.label
                ? "text-white bg-primary"
                : "text-gray-500 hover:bg-gray-100"
              } py-3 px-6 rounded-lg mb-3 transition-all`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className="text-xl" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;

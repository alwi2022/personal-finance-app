//src/utils/data.ts
import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
    LuUserCog,
  } from "react-icons/lu";
  
  export const SIDE_MENU_DATA = [
    {
      id: 1,
      label: "Dashboard",
      icon: LuLayoutDashboard,
      path: "/dashboard",
    },
    {
      id: 2,
      label: "Income",
      icon: LuWalletMinimal,
      path: "/dashboard/income", 
    },
    {
      id: 3,
      label: "Expenses",
      icon: LuHandCoins,
      path: "/dashboard/expense", 
    },
    {
      id: 4,
      label: "Profile", 
      icon: LuUserCog,
      path: "/dashboard/profile", 
    },
   
  ];
  
//src/utils/data.ts
import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuUserCog,
  } from "react-icons/lu";
  
export const SIDE_MENU_DATA = [
    {
      id: 1,
      label: "Dashboard",
      icon: LuLayoutDashboard,
        translationKey: "dashboard",
      path: "/dashboard",
    },
    {
      id: 2,
      label: "Income",
      icon: LuWalletMinimal,
      translationKey: "income",
      path: "/dashboard/income", 
      
    },
    {
      id: 3,
      label: "Expenses",
      icon: LuHandCoins,
      translationKey: "expense",
      path: "/dashboard/expense", 
    },
    {
      id: 4,
      label: "Profile", 
      icon: LuUserCog,
      translationKey: "profile",
      path: "/dashboard/profile", 
    },
   
  ];
  
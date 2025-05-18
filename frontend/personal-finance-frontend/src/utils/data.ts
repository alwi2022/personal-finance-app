import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
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
      path: "/dashboard/income", // ✅ sesuaikan dengan route
    },
    {
      id: 3,
      label: "Expenses",
      icon: LuHandCoins,
      path: "/dashboard/expense", // ✅ sesuaikan juga
    },
    {
      id: 4,
      label: "Logout",
      icon: LuLogOut,
      path: "/logout",
    },
  ];
  
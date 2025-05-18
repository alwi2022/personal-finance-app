import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axiosInstance from "../utils/axios-instance";
import { API_PATH } from "../utils/api";

export const useUserAuth = () => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext must be used inside a UserProvider");
  }

  const { user, updateUser, clearUser } = userContext;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) return;

    let isMounted = true;

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATH.AUTH.GET_USER_INFO);

        if (isMounted) {
          const actualUser = response.data.user ?? response.data; // antisipasi response nested
          updateUser(actualUser);
          console.log(actualUser, "user di auth");
        }
      } catch (error) {
        if (isMounted) {
          clearUser();
          navigate("/login");
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [user, updateUser, clearUser, navigate]);
};

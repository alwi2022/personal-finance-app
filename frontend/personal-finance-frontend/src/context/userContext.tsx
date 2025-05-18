import { createContext, useState } from "react";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  profileImageUrl?: string;
}

interface UserContextType {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

  const updateUser = (userData: User) => {
    setUser(userData); 
  };

  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

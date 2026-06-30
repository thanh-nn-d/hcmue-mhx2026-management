import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // Lấy user từ localStorage khi mở lại web
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("mhx_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Đăng nhập và lưu vào localStorage
  const login = (account) => {
    setUser(account);
    localStorage.setItem("mhx_user", JSON.stringify(account));
  };

  // Đăng xuất và xóa localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("mhx_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // ✅ localStorage fi sessionStorage lammiin check godhi
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    // Yoo localStorage keessaa badde — sessionStorage irraa restore godhi
    if (!stored || !token) {
      const sessionUser = sessionStorage.getItem("pre_payment_user");
      const sessionToken = sessionStorage.getItem("pre_payment_token");
      if (sessionUser && sessionToken) {
        localStorage.setItem("user", sessionUser);
        localStorage.setItem("token", sessionToken);
        sessionStorage.removeItem("pre_payment_user");
        sessionStorage.removeItem("pre_payment_token");
        return JSON.parse(sessionUser);
      }
      return null;
    }

    return JSON.parse(stored);
  });

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("pre_payment_user");
    sessionStorage.removeItem("pre_payment_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

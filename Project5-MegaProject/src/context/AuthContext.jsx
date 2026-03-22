import { createContext, useContext, useState } from "react";
import { getEmailFromToken } from "../utils/tokenUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }

    if (token) {
      const email = getEmailFromToken(token);
      if (email) {
        return { email };
      }
    }

    return null;
  });

  const login = (token, userInfo) => {
    localStorage.setItem("token", token);
    localStorage.setItem("idToken", token); // Store as idToken for API interceptor
    const finalUserInfo = userInfo || { email: getEmailFromToken(token) };
    localStorage.setItem("user", JSON.stringify(finalUserInfo));
    setIsAuthenticated(true);
    setUser(finalUserInfo);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
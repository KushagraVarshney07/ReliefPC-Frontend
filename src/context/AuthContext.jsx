import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
          const stored = localStorage.getItem("user");
          return stored ? JSON.parse(stored) : null;
        } catch (err) {
          console.error("Error parsing user from localStorage:", err);
          localStorage.removeItem("user"); // Clean up corrupted data
          return null;
        }
      });

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

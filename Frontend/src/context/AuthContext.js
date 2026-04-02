import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .status()
      .then(({ isLoggedIn, username }) => {
        setIsLoggedIn(Boolean(isLoggedIn));
        setUsername(username || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((uname) => {
    setIsLoggedIn(true);
    setUsername(uname || "");
  }, []);

  const logout = useCallback(() => {
    authApi.logout().finally(() => {
      setIsLoggedIn(false);
      setUsername("");
    });
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

import { createContext, useContext, useEffect, useState } from "react";
import { getMe, logout as logoutService } from "@/services/authService";

const AuthContext = createContext({
  user: null,
  loading: true,
  setUser: () => {},
  checkAuth: async () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await getMe();
      if (res.status === 200) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
      // Clear extension token so Chrome extension loses auth
      localStorage.removeItem("mindfolio_token");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, postJson } from "../services/api.js";
import { disconnectSocket } from "../services/socket.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("disaster_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await api("/auth/me");
      setUser(data.user);
    } catch {
      localStorage.removeItem("disaster_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const sendOtp = (phone) => postJson("/auth/send-otp", { phone });

  const verifyOtp = async (payload) => {
    const data = await postJson("/auth/verify-otp", payload);
    localStorage.setItem("disaster_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("disaster_token");
    disconnectSocket();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, sendOtp, verifyOtp, logout, refreshUser }),
    [user, loading, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

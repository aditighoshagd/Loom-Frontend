import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { TOKEN_KEY, USER_ID_KEY } from "../api/client";
import { getUserIdFromToken } from "../api/jwt";
import * as authApi from "../api/auth";
import { rememberWriter } from "../../components/loom/writer-name-cache";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = window.localStorage.getItem(TOKEN_KEY);
    if (t) {
      setToken(t);
      setUserId(getUserIdFromToken(t));
    }
    setReady(true);
  }, []);

  const setSession = useCallback((t) => {
    window.localStorage.setItem(TOKEN_KEY, t);
    const uid = getUserIdFromToken(t);
    if (uid != null) window.localStorage.setItem(USER_ID_KEY, String(uid));
    setToken(t);
    setUserId(uid);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const t = await authApi.login({ email, password });
      setSession(t.trim().replace(/^"|"$/g, ""));
    },
    [setSession],
  );

  const signup = useCallback(
    async (name, email, password) => {
      const user = await authApi.signup({ name, email, password });
      const t = await authApi.login({ email, password });
      setSession(t.trim().replace(/^"|"$/g, ""));
      if (user && user.id) {
        rememberWriter(user.id, user.name);
      }
    },
    [setSession],
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_ID_KEY);
    setToken(null);
    setUserId(null);
    navigate("/login");
  }, [navigate]);

  const value = useMemo(
    () => ({ token, userId, ready, login, signup, logout, setSession }),
    [token, userId, ready, login, signup, logout, setSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function useRequireAuth() {
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.ready && !auth.token) {
      navigate("/login");
    }
  }, [auth.ready, auth.token, navigate]);
  return auth;
}

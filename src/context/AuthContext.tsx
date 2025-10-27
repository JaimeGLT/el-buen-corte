import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { isTokenValid, getDecodedToken } from "../utlis/auth";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  role?: string;
  firstName?: string;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<string | undefined>();
  const [firstName, setFirstName] = useState<string | undefined>();

  useEffect(() => {
    if (token && isTokenValid(token)) {
      const decoded = getDecodedToken(token);
      setRole(decoded?.role);
      setFirstName(decoded?.firstName);
    } else {
      logout();
    }
  }, [token]);

  const login = (jwt: string) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    const decoded = getDecodedToken(jwt);
    setRole(decoded?.role);
    setFirstName(decoded?.firstName);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setRole(undefined);
    setFirstName(undefined);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, role, firstName, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

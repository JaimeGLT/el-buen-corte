// context/AuthContext.tsx
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
  // Inicializa token desde localStorage
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [role, setRole] = useState<string | undefined>();
  const [firstName, setFirstName] = useState<string | undefined>();

  // Actualiza información de usuario si el token cambia
  useEffect(() => {
    if (token && isTokenValid(token)) {
      const decoded = getDecodedToken(token);
      setRole(decoded?.role);
      setFirstName(decoded?.firstName);
    } else {
      // Si el token es inválido, limpia estado sin recargar la página
      setToken(null);
      setRole(undefined);
      setFirstName(undefined);
    }
  }, [token]);

  // Función para iniciar sesión
  const login = (jwt: string) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    const decoded = getDecodedToken(jwt);
    setRole(decoded?.role);
    setFirstName(decoded?.firstName);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setRole(undefined);
    setFirstName(undefined);
    // NO se recarga la página; ProtectedRoute se encarga de redirigir
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, role, firstName, login, logout }}
    >
      {children} {/* Renderiza todos los componentes hijos */}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

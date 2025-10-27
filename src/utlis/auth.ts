// src/utils/auth.ts
import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  exp: number;       // expiración
  sub: string;       // username o email
  role?: string;
  firstName?: string;
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 > Date.now(); // valida expiración
  } catch {
    return false;
  }
}

export function getDecodedToken(token: string | null): JwtPayload | null {
  if (!token) return null;
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

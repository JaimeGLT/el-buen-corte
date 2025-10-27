import axios from "axios";
import type {InternalAxiosRequestConfig} from 'axios'
import { isTokenValid } from "./auth";

const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// 🔹 Interceptor de request
axiosApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (!config.headers) {
      config.headers = {}; // evita error de tipo
    }

    if (token && isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }

    // 🔻 Si el token no existe o está vencido
    localStorage.removeItem("token");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    // 🚫 Cancela la petición
    throw new axios.Cancel("Token inválido o expirado");
  },
  (error) => Promise.reject(error)
);

// 🔹 Interceptor de response
axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosApi;

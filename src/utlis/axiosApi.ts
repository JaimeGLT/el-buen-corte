import axios, { AxiosHeaders } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// 🔹 Interceptor de request: agrega token si existe
axiosApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Interceptor de response: solo devuelve el error
axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosApi;

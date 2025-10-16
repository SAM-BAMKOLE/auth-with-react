import axios from "axios";
import { useAuthStore } from "@/store/auth";

const baseURL = import.meta.env.PROD
  ? import.meta.env.VITE_SERVER_BASE_URL
  : // : "https://auth-with-express.onrender.com";
    "http://localhost:3550";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // accessToken is stored as a value on the zustand store (string | null), not a function
    const accessToken = (
      useAuthStore.getState() as { accessToken?: string | null }
    ).accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${baseURL}/api/auth/access-token/new`
        );
        const { accessToken } = response.data;

        (
          useAuthStore.getState() as { setAccessToken: (token: string) => void }
        ).setAccessToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log user out
        (useAuthStore.getState() as { logout: () => void }).logout();
        return Promise.reject(refreshError);
      }
    }
    // For all other errors, make sure we reject so callers hit their catch blocks
    return Promise.reject(error);
  }
);

export default axiosInstance;

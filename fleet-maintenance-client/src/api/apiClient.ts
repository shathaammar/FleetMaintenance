import axios, {
  type AxiosError,
} from "axios";

import { ROUTES } from "../constants/routes";
import { STORAGE_KEYS } from "../constants/storage";
import type {
  ApiErrorResponse,
} from "../types/api";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error(
    "VITE_API_BASE_URL is not configured.",
  );
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      STORAGE_KEYS.ACCESS_TOKEN,
    );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (
    error: AxiosError<ApiErrorResponse>,
  ) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(
        STORAGE_KEYS.ACCESS_TOKEN,
      );

      localStorage.removeItem(
        STORAGE_KEYS.USER,
      );

      const isLoginPage =
        window.location.pathname ===
        ROUTES.LOGIN;

      if (!isLoginPage) {
        window.location.href = ROUTES.LOGIN;
      }
    }

    return Promise.reject(error);
  },
);
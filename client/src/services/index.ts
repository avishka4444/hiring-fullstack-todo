import Axios from "axios";

import {
  commonHeaders,
  handleResponseError,
  requestInterceptor,
  responseInterceptor,
  validateStatus,
} from "./interceptors";

// Get API base URL from environment variable or use default
const getApiBaseUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;

  // In development, use proxy path (Vite proxy handles /api)
  // In production, use the full URL from env
  if (import.meta.env.DEV) {
    // Development mode - use proxy path
    return "/api";
  }

  // Production mode - use full URL from env or fallback to /api
  return apiUrl ? `${apiUrl}/api` : "/api";
};

export const axios = Axios.create({
  baseURL: getApiBaseUrl(),
  headers: commonHeaders,
  validateStatus,
});

// Add request interceptor
axios.interceptors.request.use(requestInterceptor);

// Add response interceptor
axios.interceptors.response.use(responseInterceptor, handleResponseError);

export const isAxiosError = Axios.isAxiosError;

/**
 * API layer exports
 */
export * from "./interceptors";


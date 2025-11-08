import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export interface ErrorResponse {
  code?: string | number;
  status?: number;
  message: string | string[];
}

/**
 * Common headers for all API requests
 */
export const commonHeaders = {
  "Content-Type": "application/json",
};

/**
 * Validate status function for Axios
 * Only treats 200-299 as success
 */
export const validateStatus = (status: number): boolean => {
  return status >= 200 && status < 300;
};

/**
 * Request interceptor - adds authorization token and stringifies data
 */
export const requestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  // Get auth token from localStorage
  const token = localStorage.getItem("auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Stringify data for JSON requests (skip FormData, URLSearchParams, etc.)
  if (
    config.data &&
    typeof config.data === "object" &&
    !(config.data instanceof FormData) &&
    !(config.data instanceof URLSearchParams) &&
    !(config.data instanceof Blob) &&
    !(config.data instanceof ArrayBuffer)
  ) {
    // Only stringify if Content-Type is JSON (default)
    const contentType = config.headers?.["Content-Type"] || config.headers?.["content-type"];
    if (!contentType || contentType.includes("application/json")) {
      try {
        config.data = JSON.stringify(config.data);
      } catch (error) {
        console.error("Error stringifying request data:", error);
      }
    }
  }

  return config;
};

/**
 * Response interceptor - parses JSON response data
 */
export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  try {
    if (typeof response.data === "string") {
      response.data = JSON.parse(response.data);
    }
    return response;
  } catch {
    return response;
  }
};

/**
 * Error handler - formats error responses consistently
 */
export const handleResponseError = async (
  error: AxiosError<ErrorResponse | string>
): Promise<ErrorResponse> => {
  let data: ErrorResponse | string | unknown = error.response?.data ?? {};

  // Parse string responses
  if (typeof data === "string") {
    try {
      data = JSON.parse(data) as ErrorResponse;
    } catch {
      data = { message: data };
    }
  }

  // Ensure data is an object
  const errorData: Partial<ErrorResponse> = typeof data === "object" && data !== null
    ? (data as ErrorResponse)
    : {};

  // Handle 401 Unauthorized - redirect to login if needed
  // if (error.response?.status === 401) {
  //   // Handle logout/redirect
  // }

  const reject: ErrorResponse = {
    ...errorData,
    status: error.response?.status,
    message:
      errorData.message ??
      error.response?.statusText ??
      error.message ??
      "An error occurred",
    code: errorData.code ?? error.response?.status,
  };

  return Promise.reject(reject);
};


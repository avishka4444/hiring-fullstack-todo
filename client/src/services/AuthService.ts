import { axios } from "./index";
import type { LoginCredentials, RegisterCredentials, TokenResponse, User } from "../types/User";

export const login = async (credentials: LoginCredentials): Promise<TokenResponse> => {
  const response = await axios.post<TokenResponse>("/auth/login", credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<void> => {
  await axios.post("/auth/register", credentials);
};

export const getCurrentUser = async (): Promise<User> => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // JWT payload contains: { sub: userId, username: username }
    return { username: payload.username || payload.sub };
  } catch {
    throw new Error("Invalid token");
  }
};

export const logout = async (): Promise<void> => {
  // Stateless JWT logout handled on client
};


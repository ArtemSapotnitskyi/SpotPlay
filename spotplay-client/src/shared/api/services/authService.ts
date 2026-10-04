import { apiClient } from "../api";

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  user?: User;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post("/users/login", { email, password });
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;
  },

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const response = await apiClient.post("/users/register", {
      username,
      email,
      password,
    });
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<any>("/users/me");
    return response.data.user || response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/users/logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("spotplay_user");
  },
};

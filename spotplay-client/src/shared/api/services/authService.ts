import { apiClient } from "../api";

export const authService = {
  async login(email: string, password: string): Promise<void> {
    const response = await apiClient.post("/users/login", { email, password });
    localStorage.setItem("accessToken", response.data.accessToken);
  },

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<void> {
    const response = await apiClient.post("/users/register", {
      username,
      email,
      password,
    });
    localStorage.setItem("accessToken", response.data.accessToken);
  },

  async logout(): Promise<void> {
    await apiClient.post("/users/logout");
    localStorage.removeItem("accessToken");
  },
};

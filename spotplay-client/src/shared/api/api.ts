import axios, { AxiosError } from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, //ALLOWS the browser to send the refreshToken in cookies
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Any response returned from the backend (whether successful or an error) must pass through this block of code before reaching your React components
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // To avoid getting caught in an endless cycle
      try {
        // axios.post(url, data, config)
        const refreshResponse = await axios.post(
          `${BASE_URL}/users/refresh`,
          {},
          { withCredentials: true },
        );

        // New token from request
        const newAccessToken = refreshResponse.data.accessToken;
        // Save new token in memory
        localStorage.setItem("accessToken", newAccessToken);
        // Updating Header in original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register"
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

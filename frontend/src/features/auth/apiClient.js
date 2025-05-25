import axios from "axios";
import AUTH_ROUTES from "../../utils/constants";

const api = axios.create({
  baseURL: AUTH_ROUTES,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // For session/cookie auth
});

// Add JWT interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest.url !== "/token/refresh/"
    ) {
      try {
        const refresh = localStorage.getItem("refreshToken");
        if (refresh) {
          const { data } = await api.post("/token/refresh/", { refresh });
          localStorage.setItem("accessToken", data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
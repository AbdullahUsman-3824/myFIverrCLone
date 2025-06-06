import axios from "axios";
import { API_URL } from "./constants";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Get/Set/Clear Tokens
const getToken = (key) => localStorage.getItem(key);
const setTokens = (access, refresh) => {
  access && localStorage.setItem("accessToken", access);
  refresh && localStorage.setItem("refreshToken", refresh);
};
const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// Add access token to each request
api.interceptors.request.use((config) => {
  const token = getToken("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle responses and token refresh
api.interceptors.response.use(
  (res) => {
    const { access, refresh } = res.data || {};
    if (access) setTokens(access, refresh);
    return res;
  },
  async (err) => {
    const original = err.config;
    const refresh = getToken("refreshToken");

    // Refresh token if 401 and not already retried
    if (
      err.response?.status === 401 &&
      refresh &&
      !original._retry &&
      original.url !== "/token/refresh/"
    ) {
      original._retry = true;
      try {
        const { data } = await axios.post(`${API_URL}/token/refresh/`, {
          refresh,
        });
        setTokens(data.access, data.refresh);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        clearTokens();
        window.location.href = "/auth/login?session_expired=true";
      }
    }

    // Format error
    const msg =
      err.response?.data?.detail ||
      err.response?.data?.non_field_errors?.[0] ||
      err.response?.data?.message ||
      "Unexpected error";
    return Promise.reject({ ...err, message: msg });
  }
);

export default api;

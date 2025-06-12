import axios from "axios";
import { TOKEN_REFRESH, API_URL } from "./constants";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
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

// Attach access token
api.interceptors.request.use((config) => {
  const token = getToken("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb);
const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

const handleTokenRefresh = async () => {
  const refreshToken = getToken("refreshToken");
  if (!refreshToken) throw new Error("No refresh token found");

  try {
    const response = await axios.post(
      TOKEN_REFRESH,
      { refresh: refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Token refresh failed");
  }
};

api.interceptors.response.use(
  (response) => {
    const { access, refresh } = response.data || {};
    if (access) setTokens(access, refresh);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== TOKEN_REFRESH
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const { access, refresh } = await handleTokenRefresh();

        if (access) {
          setTokens(access, refresh);
          onRefreshed(access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } else {
          throw new Error("Token refresh failed: no new token");
        }
      } catch (refreshError) {
        console.error("Token refresh error:", refreshError);
        clearTokens();

        if (window.location.pathname !== "/") {
          window.location.href = "/?sessionExpired=true";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

import axios from "axios";
import { TOKEN_REFRESH } from "./constants";
import { Cookies } from "react-cookie";
import { API_URL } from "./constants";

const isDevelopment = process.env.NODE_ENV === "development";
const cookies = new Cookies();

const api = axios.create({
  baseURL:API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token
api.interceptors.request.use((config) => {
  const token = cookies.get("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token refresh control
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
  return () => {
    refreshSubscribers = refreshSubscribers.filter((fn) => fn !== cb);
  };
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if this is a 401 error and not a token refresh request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== TOKEN_REFRESH
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          const unsubscribe = subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
          
          // Add timeout to prevent hanging if refresh fails
          const timeout = setTimeout(() => {
            unsubscribe();
            reject(new Error("Token refresh timeout"));
          }, 30000);
          
          // Clean up on resolution
          Promise.resolve().then(() => {
            clearTimeout(timeout);
            unsubscribe();
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          TOKEN_REFRESH,
          {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        const newToken = response.data.access;

        if (newToken) {
          cookies.set("jwt", newToken, {
            path: "/",
            secure: !isDevelopment,
            sameSite: isDevelopment ? "lax" : "strict",
            expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiration
          });

          onRefreshed(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          throw new Error("No new token received");
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        
        // Clear tokens
        cookies.remove("jwt", { path: "/" });
        cookies.remove("jwt-refresh", { path: "/" });
        
        if (window.location.pathname !== "/") {
          window.location.href = "/?sessionExpired=true";
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors or if we've already retried
    return Promise.reject(error);
  }
);

export default api;
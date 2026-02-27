import axios from "axios";
import toast from "react-hot-toast";

export const BASE_URL = "https://api.hikemove.in";

export const api = axios.create({
  baseURL: BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor for catching errors globally and formatting tokens
api.interceptors.response.use(
  (response) => {
    const { status, message } = response.data || {};
    if (message) {
      if (status === true && response.config.method !== "get") {
        toast.success(message);
      } else if (status === false) {
        if (Array.isArray(message)) {
          message.forEach((msg: string) => toast.error(msg));
        } else if (typeof message === "string") {
          toast.error(message);
        }
      }
    }
    return response;
  },
  async (error) => {
    const data = error.response?.data;

    // Global Error Toaster
    if (data && data.message) {
      if (Array.isArray(data.message)) {
        data.message.forEach((msg: string) => toast.error(msg));
      } else if (typeof data.message === "string") {
        toast.error(data.message);
      }
    } else if (error.message && error.response?.status !== 401) {
      // Avoid generic "Network Error" overriding actual 401 handled by interceptor below
      toast.error(error.message);
    }

    const originalRequest = error.config;

    // Avoid infinite loops for login and refresh endpoints
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url === "/admin/login" ||
        originalRequest.url === "/admin/refresh"
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token using the existing access token
        const res = await axios.post(
          `${BASE_URL}/admin/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );

        if (res.data?.status === true && res.data?.data?.accessToken) {
          const newToken = res.data.data.accessToken;
          localStorage.setItem("accessToken", newToken);
          api.defaults.headers.common["Authorization"] = "Bearer " + newToken;
          originalRequest.headers["Authorization"] = "Bearer " + newToken;

          processQueue(null, newToken);

          // Retry original request with new token
          return api(originalRequest);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear auth state
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");

        // Redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

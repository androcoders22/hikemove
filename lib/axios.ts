import axios from "axios";
import toast from "react-hot-toast";

export const BASE_URL = "https://api.hikemove.in";

export const api = axios.create({
  baseURL: BASE_URL,
});

// Add token to requests
const skipAuthPrefixes = [
  "/admin/login",
  "/admin/refresh",
  "/admin/forgot-password",
  "/admin/reset-password",
  "/admin/verify-otp",
  "/member/login",
  "/member/refresh",
  "/member/forgot-password",
  "/member/reset-password",
  "/member/check-member-id",
];

const skipAuthExact = ["/member"];

const shouldSkipAuth = (requestUrl: string, method?: string) => {
  const normalizedMethod = (method || "").toLowerCase();
  if (skipAuthExact.includes(requestUrl) && normalizedMethod === "post") {
    return true;
  }
  return skipAuthPrefixes.some((prefix) => requestUrl.startsWith(prefix));
};

api.interceptors.request.use((config) => {
  const requestUrl = config.url || "";
  if (shouldSkipAuth(requestUrl, config.method)) {
    return config;
  }

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
    const isAppSetting = response.config?.url?.includes("/app-setting");
    if (message && status === false && !isAppSetting) {
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else if (typeof message === "string") {
        toast.error(message);
      }
    }
    return response;
  },
  async (error) => {
    const data = error.response?.data;

    // Check if we should skip error toast for specific endpoints (like app-setting 404)
    const skipToast =
      error.response?.status === 404 &&
      error.config?.url?.includes("/app-setting");

    // Global Error Toaster
    if (data && data.message && !skipToast) {
      if (Array.isArray(data.message)) {
        data.message.forEach((msg: string) => toast.error(msg));
      } else if (typeof data.message === "string") {
        toast.error(data.message);
      }
    } else if (
      error.message &&
      error.response?.status !== 401 &&
      error.response?.status !== 403 &&
      !skipToast
    ) {
      toast.error(error.message);
    }

    // Determine login path based on current window location or stored userType
    let loginPath = "/member-login";
    let userType = "member";
    if (typeof window !== "undefined") {
      const isCurrentlyOnAdminRoute = window.location.pathname.startsWith("/admin");
      const storedUserType = localStorage.getItem("userType");
      
      if (isCurrentlyOnAdminRoute || storedUserType === "admin") {
        loginPath = "/admin-login";
        userType = "admin";
      }
    }

    const originalRequest = error.config;

    // Handle 403 Forbidden — auto logout
    if (error.response?.status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
        localStorage.removeItem("memberId");
        window.location.href = loginPath;
      }
      return Promise.reject(error);
    }

    // Avoid infinite loops for login and refresh endpoints
    const skipUrls = [
      "/admin/login",
      "/admin/refresh",
      "/admin/forgot-password",
      "/admin/reset-password",
      "/admin/verify-otp",
      "/member/login",
      "/member/refresh",
      "/member/forgot-password",
      "/member/reset-password",
      "/member/check-member-id",
    ];
    const skipExactUrls = ["/member"];
    if (error.response?.status === 401 && !originalRequest._retry) {
      const originalUrl = originalRequest.url || "";
      const originalMethod = (originalRequest.method || "").toLowerCase();
      if (skipExactUrls.includes(originalUrl) && originalMethod === "post") {
        return Promise.reject(error);
      }
      if (skipUrls.some((prefix) => originalUrl.startsWith(prefix))) {
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
        // Determine refresh endpoint based on user type
        const refreshUrl =
          userType === "member"
            ? `${BASE_URL}/member/refresh`
            : `${BASE_URL}/admin/refresh`;

        // Use raw axios (not `api`) to avoid interceptor loops
        const res = await axios.post(
          refreshUrl,
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
        // Clear all auth state
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
        localStorage.removeItem("memberId");

        // Redirect to correct login
        if (typeof window !== "undefined") {
          window.location.href = loginPath;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

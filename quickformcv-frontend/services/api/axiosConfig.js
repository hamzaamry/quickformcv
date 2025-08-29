import axios from "axios";
import { authService } from "./auth";

// Check if we're on localhost, otherwise use environment variable
const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";
const API_BASE_URL = isLocalhost ? "http://localhost:8000/api/v0" : process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = authService.getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Don't try to refresh token for authentication endpoints
        const authEndpoints = ["/auth/login", "/auth/refresh", "/users/signup", "/auth/google/login"];
        const isAuthEndpoint = authEndpoints.some(endpoint =>
            originalRequest.url?.includes(endpoint)
        );

        // Only attempt token refresh for 401 errors on protected routes
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isAuthEndpoint &&
            typeof window !== "undefined"
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = authService.getRefreshToken();
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                const response = await api.post("/auth/refresh", {
                    refresh_token: refreshToken,
                });

                const { access_token, refresh_token: newRefreshToken } = response.data;
                await authService.storeTokens(access_token, newRefreshToken || refreshToken);
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                processQueue(null, access_token);
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                processQueue(refreshError, null);
                authService.removeTokens();
                if (window.location.pathname !== "/auth/login") {
                    window.location.href = "/auth/login";
                }
                return Promise.reject(new Error("Session expired. Please login again."));
            } finally {
                isRefreshing = false;
            }
        }

        if (error.response?.status === 401 && isAuthEndpoint) {
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default api;
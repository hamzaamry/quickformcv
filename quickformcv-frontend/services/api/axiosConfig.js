import axios from "axios";
import { authService } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// DEBUGGING: Log everything
console.log("=== AXIOS CONFIG DEBUG ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("API_BASE_URL:", API_BASE_URL);
console.log("typeof window:", typeof window);
console.log("==========================");

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor with more debugging
api.interceptors.request.use(
    (config) => {
        console.log("=== AXIOS REQUEST DEBUG ===");
        console.log("config.baseURL:", config.baseURL);
        console.log("config.url:", config.url);
        console.log("Full URL:", (config.baseURL || '') + (config.url || ''));
        console.log("============================");

        if (typeof window !== "undefined") {
            const token = authService.getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        console.error("Axios request interceptor error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log("=== AXIOS RESPONSE DEBUG ===");
        console.log("Response URL:", response.config.url);
        console.log("Response Status:", response.status);
        console.log("============================");
        return response;
    },
    async (error) => {
        console.error("=== AXIOS ERROR DEBUG ===");
        console.error("Error URL:", error.config?.url);
        console.error("Error Status:", error.response?.status);
        console.error("Error Message:", error.message);
        console.error("==========================");

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
            originalRequest._retry = true;

            try {
                const refreshToken = authService.getRefreshToken();
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                const response = await api.post("/auth/refresh", {
                    refresh_token: refreshToken,
                });

                const { access_token, refresh_token } = response.data;
                await authService.storeTokens(access_token, refresh_token);
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                authService.removeTokens();
                window.location.href = "/auth/login";
                return Promise.reject(new Error("Session expired. Please login again."));
            }
        }

        return Promise.reject(error);
    }
);

export default api;
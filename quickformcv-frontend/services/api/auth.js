import api from "./axiosConfig";

const isBrowser = typeof window !== "undefined";

export const authService = {
  login: async (email, password, rememberMe) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        remember_me: rememberMe,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  signup: async (username, email, password) => {
    try {
      const response = await api.post("/users/signup", {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  googleSignIn: async () => {
    try {
      const response = await api.get("/auth/google/login");
      return response.data.authorization_url;
    } catch (error) {
      throw error;
    }
  },

  storeTokens: async (accessToken, refreshToken) => {
    if (!isBrowser) return;

    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setTimeout(() => {
          const storedAccess = localStorage.getItem("accessToken");
          const storedRefresh = localStorage.getItem("refreshToken");

          if (storedAccess === accessToken && storedRefresh === refreshToken) {
            resolve();
          } else {
            reject(new Error("Failed to verify token storage"));
          }
        }, 50);
      } catch (error) {
        console.error("Failed to store tokens:", error);
        reject(new Error("Failed to save login session"));
      }
    });
  },

  removeTokens: () => {
    if (!isBrowser) return;
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } catch (error) {
      console.error("Failed to remove tokens:", error);
    }
  },

  getAccessToken: () => {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem("accessToken");
    } catch (error) {
      console.error("Failed to get access token:", error);
      return null;
    }
  },

  getRefreshToken: () => {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem("refreshToken");
    } catch (error) {
      console.error("Failed to get refresh token:", error);
      return null;
    }
  },

  isAuthenticated: () => {
    if (!isBrowser) return false;
    const token = authService.getAccessToken();
    return !!token;
  },
};

import api from "./axiosConfig";

const isBrowser = typeof window !== "undefined";

export const authService = {
  login: async (email, password, rememberMe) => {
    const response = await api.post("/auth/login", {
      email,
      password,
      remember_me: rememberMe,
    });
    return response.data;
  },

  signup: async (username, email, password) => {
    const response = await api.post("/users/signup", {
      username,
      email,
      password,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  googleSignIn: async () => {
    const response = await api.get("/auth/google/login");
    return response.data.authorization_url;
  },

  storeTokens: (accessToken, refreshToken) => {
    if (!isBrowser) return;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  removeTokens: () => {
    if (!isBrowser) return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  getAccessToken: () => {
    if (!isBrowser) return null;
    return localStorage.getItem("accessToken");
  },

  getRefreshToken: () => {
    if (!isBrowser) return null;
    return localStorage.getItem("refreshToken");
  },
};

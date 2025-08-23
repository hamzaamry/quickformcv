import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/api/auth";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, password, rememberMe }) => {
      try {
        return await authService.login(email, password, rememberMe);
      } catch (error) {
        if (error.response?.data?.detail) {
          throw new Error(error.response.data.detail);
        } else if (error.response?.status === 401) {
          throw new Error("Incorrect email or password");
        } else if (error.response?.status === 400) {
          throw new Error("Please check your email and password");
        } else if (error.response?.status >= 500) {
          throw new Error("Server error. Please try again later");
        } else if (error.message) {
          throw new Error(error.message);
        } else {
          throw new Error("An unexpected error occurred. Please try again");
        }
      }
    },
    onSuccess: async (data) => {
      try {
        await authService.storeTokens(data.access_token, data.refresh_token);
        router.push("/resumes");
      } catch (error) {
        console.error("Token storage failed:", error);
        throw new Error("Login successful but failed to save session");
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ username, email, password }) => {
      try {
        return await authService.signup(username, email, password);
      } catch (error) {
        if (error.response?.data?.detail) {
          throw new Error(error.response.data.detail);
        } else if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        } else if (error.response?.status === 400) {
          throw new Error("Please check your information and try again");
        } else if (error.response?.status === 409) {
          throw new Error("An account with this email already exists");
        } else if (error.response?.status >= 500) {
          throw new Error("Server error. Please try again later");
        } else if (error.message) {
          throw new Error(error.message);
        } else {
          throw new Error("An unexpected error occurred. Please try again");
        }
      }
    },
    onSuccess: async (data, variables) => {
      try {
        if (data?.access_token && data?.refresh_token) {
          await authService.storeTokens(data.access_token, data.refresh_token);
          router.push("/resumes");
        } else {
          const loginResponse = await authService.login(variables.email, variables.password, false);
          await authService.storeTokens(loginResponse.access_token, loginResponse.refresh_token);
          router.push("/resumes");
        }
      } catch (error) {
        console.error("Auto-login failed after signup:", error);
        router.push("/auth/login?message=Account created successfully. Please login.");
      }
    },
    onError: (error) => {
      console.error("Signup failed:", error);
    },
  });
};

export const useGoogleSignIn = () => {
  return useMutation({
    mutationFn: async () => {
      try {
        return await authService.googleSignIn()
      } catch (error) {
        if (error.response?.data?.detail) {
          throw new Error(error.response.data.detail);
        } else if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        } else if (error.response?.status >= 500) {
          throw new Error("Server error. Please try again later");
        } else if (error.message) {
          throw new Error(error.message);
        } else {
          throw new Error("Google sign-in failed. Please try again");
        }
      }
    },
    onSuccess: (authorizationUrl) => {
      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      }
    },
    onError: (error) => {
      console.error("Google signin failed:", error);
    },
  });
};

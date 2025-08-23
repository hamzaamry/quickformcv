import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/api/auth";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password, rememberMe }) =>
      authService.login(email, password, rememberMe),
    onSuccess: (data) => {
      authService.storeTokens(data.access_token, data.refresh_token);
      router.push("/resumes");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      return error;
    },
  });
};

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ username, email, password }) =>
      authService.signup(username, email, password),
    onSuccess: () => {
      router.push("resumes");
    },
    onError: (error) => {
      console.error("Signup failed:", error);
      return error;
    },
  });
};

export const useGoogleSignIn = () => {
  return useMutation({
    mutationFn: () => authService.googleSignIn(),
    onSuccess: (authorizationUrl) => {
      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      }
    },
    onError: (error) => {
      console.error("Google signin failed:", error);
      return error;
    },
  });
};

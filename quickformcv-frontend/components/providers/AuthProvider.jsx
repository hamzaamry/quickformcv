"use client";
import { createContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { authService } from "@/services/api/auth";

const AuthContext = createContext({});

const publicRoutes = ["/", "/auth/login", "/auth/signup", "/blog"];

const isPublicRoute = (pathname) => {
  if (publicRoutes.includes(pathname)) {
    return true;
  }

  if (pathname.startsWith("/blog/")) {
    return true;
  }

  if (pathname.startsWith("/builder/print-preview/")) {
    return true;
  }

  return false;
};

const hasOAuthTokensInURL = () => {
  if (typeof window === "undefined") return false;

  const url = new URL(window.location.href);
  return url.searchParams.has("access_token") && url.searchParams.has("refresh_token");
};

const processOAuthTokens = async () => {
  if (typeof window === "undefined") return false;

  const url = new URL(window.location.href);
  const accessToken = url.searchParams.get("access_token");
  const refreshToken = url.searchParams.get("refresh_token");

  if (accessToken && refreshToken) {
    try {
      await authService.storeTokens(accessToken, refreshToken);

      // Clean URL by removing query parameters
      url.searchParams.delete("access_token");
      url.searchParams.delete("refresh_token");
      window.history.replaceState({}, document.title, url.toString());

      return true;
    } catch (error) {
      console.error("Failed to store tokens from URL:", error);
    }
  }

  return false;
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessingTokens, setIsProcessingTokens] = useState(false);
  const { data: user, isLoading, isError } = useUser();

  useEffect(() => {
    const initializeAuth = async () => {
      if (hasOAuthTokensInURL()) {
        setIsProcessingTokens(true);

        const tokensProcessed = await processOAuthTokens();

        if (tokensProcessed) {
          // Redirect to resumes after successful token processing
          router.push("/resumes");
          setIsProcessingTokens(false);
          setIsInitialized(true);
          return;
        }

        setIsProcessingTokens(false);
      }

      // Continue with normal auth flow
      const accessToken = authService.getAccessToken();
      const isPublic = isPublicRoute(pathname);

      if (!accessToken && !isPublic) {
        router.push("/auth/login");
      } else if (accessToken && (pathname === "/auth/login" || pathname === "/auth/signup")) {
        router.push("/resumes");
      }

      setIsInitialized(true);
    };

    initializeAuth();
  }, [pathname, router]);

  if (!isInitialized || isProcessingTokens) {
    return (
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    );
  }

  if (isLoading && !isPublicRoute(pathname) && authService.isAuthenticated()) {
    return (
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
      <AuthContext.Provider value={{ user, isLoading, isError }}>
        {children}
      </AuthContext.Provider>
  );
}
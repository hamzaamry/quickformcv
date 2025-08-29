"use client";


import { createContext, useEffect, useState, useRef } from "react";
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
  const initializationRef = useRef(false);

  // Only call useUser if we have a token and are on a protected route
  const shouldFetchUser = !isPublicRoute(pathname);
  const { data: user, isLoading, isError, refetch } = useUser({
    enabled: shouldFetchUser
  });

  useEffect(() => {
    // Prevent multiple initializations
    if (initializationRef.current) return;
    initializationRef.current = true;

    const initializeAuth = async () => {
      try {
        // Handle OAuth tokens in URL first
        if (hasOAuthTokensInURL()) {
          setIsProcessingTokens(true);

          const tokensProcessed = await processOAuthTokens();

          if (tokensProcessed) {
            setIsProcessingTokens(false);
            setIsInitialized(true);
            router.push("/resumes");
            return;
          }

          setIsProcessingTokens(false);
        }

        // Check authentication status
        const isAuthenticated = authService.isAuthenticated();
        const isPublic = isPublicRoute(pathname);

        // Handle unauthenticated users on protected routes
        if (!isAuthenticated && !isPublic) {
          router.push("/auth/login");
          setIsInitialized(true);
          return;
        }

        // Handle authenticated users on auth pages
        if (isAuthenticated && (pathname === "/auth/login" || pathname === "/auth/signup")) {
          router.push("/resumes");
          setIsInitialized(true);
          return;
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []); // Remove dependencies to prevent re-runs

  // Handle route changes after initialization
  useEffect(() => {
    if (!isInitialized || isProcessingTokens) return;

    const isAuthenticated = authService.isAuthenticated();
    const isPublic = isPublicRoute(pathname);

    // Only redirect if there's a mismatch
    if (!isAuthenticated && !isPublic) {
      router.push("/auth/login");
    } else if (isAuthenticated && (pathname === "/auth/login" || pathname === "/auth/signup")) {
      router.push("/resumes");
    }
  }, [pathname, isInitialized, isProcessingTokens, router]);

  // Handle user fetch errors
  useEffect(() => {
    if (isError && shouldFetchUser) {
      console.error("User fetch failed");

      // Check if the error is due to invalid/expired token
      if (!authService.isAuthenticated()) {
        console.log("Token invalid/expired, redirecting to login");
        authService.removeTokens();
        if (!isPublicRoute(pathname)) {
          router.push("/auth/login");
        }
      }
    }
  }, [isError, shouldFetchUser, pathname, router]);

  // Show loading during initialization
  if (!isInitialized || isProcessingTokens) {
    return (
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    );
  }

  // Show loading for user data on protected routes (only if we should be fetching user data)
  if (isLoading && shouldFetchUser && authService.isAuthenticated()) {
    return (
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
      <AuthContext.Provider value={{ user, isLoading, isError, refetch }}>
        {children}
      </AuthContext.Provider>
  );
}
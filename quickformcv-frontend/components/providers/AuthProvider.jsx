"use client";
import { createContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { authService } from "@/services/api/auth";

const AuthContext = createContext({});

const publicRoutes = ["/", "/auth/login", "/auth/signup"];

const isPublicRoute = (pathname) => {
  if (publicRoutes.includes(pathname)) {
    return true;
  }
  if (pathname.startsWith("/builder/print-preview/")) {
    return true;
  }
  return false;
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: user, isLoading, isError } = useUser();

  useEffect(() => {
    const knownRoutes = ["/", "/auth/login", "/auth/signup", "/resumes"];
    const isDynamicRoute = pathname.startsWith("/builder/");

    if (!knownRoutes.includes(pathname) && !isDynamicRoute) {
      setIsInitialized(true);
      return;
    }

    const accessToken = authService.getAccessToken();
    const isPublic = isPublicRoute(pathname);

    if (!accessToken && !isPublic) {
      router.push("/auth/login");
    } else if (
      accessToken &&
      (pathname === "/auth/login" || pathname === "/auth/signup")
    ) {
      router.push("/resumes");
    }
    setIsInitialized(true);
  }, [pathname, router]);

  if (!isInitialized) {
    return null;
  }

  // Only show loading state for protected routes
  if (isLoading && !isPublicRoute(pathname)) {
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

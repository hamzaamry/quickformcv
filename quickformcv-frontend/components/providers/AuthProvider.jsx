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
    const accessToken = authService.getAccessToken();
    const isPublic = isPublicRoute(pathname);

    if (!accessToken && !isPublic) {
      router.push("/auth/login");
      setIsInitialized(true);
      return;
    }

    if (accessToken && (pathname === "/auth/login" || pathname === "/auth/signup")) {
      router.push("/resumes");
      setIsInitialized(true);
      return;
    }
    setIsInitialized(true);
  }, [pathname, router]);

  if (!isInitialized) {
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

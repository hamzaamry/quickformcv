"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/api/auth";
import { useRouter } from "next/navigation";

export const useUser = () => {
  const router = useRouter();
  const accessToken = authService.getAccessToken();

  return useQuery({
    queryKey: ["user"],
    queryFn: authService.getCurrentUser,
    enabled: !!accessToken, // Only run the query if we have an access token
    retry: false,
    onError: (error) => {
      if (error?.response?.status === 401) {
        authService.removeTokens();
        router.push("/auth/login");
      }
    },
  });
};

"use client";

import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "@/services/api/subscription";

export function useSubscription() {
    return useQuery({
        queryKey: ["subscription-status"],
        queryFn: async () => {
            const response = await subscriptionService.getStatus();
            return response?.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
}

"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/hooks/useUser";
import { useSubscription } from "@/hooks/useSubscription";
import { useRouter } from "next/navigation";
import { authService } from "@/services/api/auth";
import { subscriptionService } from "@/services/api/subscription";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserDropdownMenu } from "@/components/profile/UserDropdownMenu";

export function UserProfile({ showUserInfo = false }) {
  const { data: user } = useUser();
  const { data: subscription } = useSubscription();
  const router = useRouter();

  const handleLogout = () => {
    authService.removeTokens();
    router.push("/auth/login");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  if (!user) return null;

  const initials = user.username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const tierInfo = subscriptionService.getTierInfo(subscription);
  const usage = subscriptionService.getUsage(subscription);
  const permissions = subscriptionService.getPermissions(subscription);

  return (
      <DropdownMenu>
        <DropdownMenuTrigger className={`flex items-center gap-2 rounded-full outline-none ${showUserInfo ? '' : 'p-0'}`}>
          {showUserInfo && (
              <div className="hidden text-right md:block">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
          )}
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <UserDropdownMenu
            tierInfo={tierInfo}
            usage={usage}
            permissions={permissions}
            onSettings={handleSettings}
            onLogout={handleLogout}
        />
      </DropdownMenu>
  );
}
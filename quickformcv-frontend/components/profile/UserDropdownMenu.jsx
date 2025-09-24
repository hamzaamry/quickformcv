import { LogOut, Settings } from "lucide-react";
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { TierBadge } from "./TierBadge";
import { UsageOverview } from "./UsageOverview";

export function UserDropdownMenu({
                                     tierInfo,
                                     usage,
                                     permissions,
                                     onSettings,
                                     onLogout
                                 }) {
    return (
        <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>
                <div className="flex flex-col space-y-3">
                    <span className="font-semibold">My Account</span>
                    {tierInfo && <TierBadge tierInfo={tierInfo} />}
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Usage Overview */}
            {usage && (
                <>
                    <UsageOverview usage={usage} permissions={permissions} />
                    <DropdownMenuSeparator />
                </>
            )}

            <DropdownMenuItem onClick={onSettings}>
                <Settings className="mr-2 h-4 w-4" />
                Settings & Billing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
            </DropdownMenuItem>
        </DropdownMenuContent>
    );
}
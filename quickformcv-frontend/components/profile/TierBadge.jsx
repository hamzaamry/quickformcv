import { Badge } from "@/components/ui/badge";
import { getTierColor, getTierIcon, getDisplayName } from "@/lib/utils";

export function TierBadge({ tierInfo }) {
    return (
        <div className="flex items-center gap-2">
            <Badge className={`text-white text-xs ${getTierColor(tierInfo?.tier)}`}>
                <span className="mr-2">{getTierIcon(tierInfo?.tier)}</span>
                {getDisplayName(tierInfo?.tier)} Plan
            </Badge>
            {tierInfo?.days_until_reset && (
                <span className="text-xs text-muted-foreground">
                    Resets in {tierInfo?.days_until_reset} days
                </span>
            )}
        </div>
    );
}
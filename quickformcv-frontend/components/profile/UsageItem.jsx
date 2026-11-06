import { AlertTriangle } from "lucide-react";
import { getUsageIcon, getUsageDisplay } from "@/lib/utils";

export function UsageItem({ type, label, usage, hasPermission }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                {getUsageIcon(type)}
                <span className="text-sm text-gray-700">{label}</span>
                {!hasPermission && (
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                )}
            </div>
            {getUsageDisplay(usage)}
        </div>
    );
}
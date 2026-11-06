import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

export const UsageCard = ({ title, icon, usage: usageData, warning }) => {
    const percentage = usageData?.unlimited ? 0 : (usageData?.used / usageData?.limit) * 100

    return (
        <div className="space-y-4 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
                        {icon}
                    </div>
                    <div>
                        <span className="text-sm font-medium text-gray-700">{title}</span>
                        {warning && (
                            <div className="flex items-center gap-1 mt-1">
                                <AlertCircle className="h-3 w-3 text-red-500" />
                                <span className="text-xs text-red-600">Limit reached</span>
                            </div>
                        )}
                    </div>
                </div>
                <Badge
                    variant={warning ? "destructive" : "outline"}
                    className={`text-xs font-medium px-3 py-1.5 shadow-sm ${
                        warning
                            ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                            : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                    }`}
                >
                    {usageData?.unlimited
                        ? "∞ Unlimited"
                        : `${usageData?.remaining}/${usageData?.limit} left`}
                </Badge>
            </div>

            {!usageData?.unlimited && (
                <div className="space-y-2">
                    <Progress
                        value={percentage}
                        className="h-2.5 bg-gray-100 rounded-full overflow-hidden"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Used: {usageData?.used}</span>
                        <span>{Math.round(percentage)}% used</span>
                    </div>
                </div>
            )}
        </div>
    )
}
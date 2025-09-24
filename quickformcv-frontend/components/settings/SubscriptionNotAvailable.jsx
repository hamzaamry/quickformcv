import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export const SubscriptionNotAvailable = ({
                                             message = "Subscription information is not available at the moment."
                                         }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50/30">
            <div className="px-3 py-4 sm:px-6 sm:py-6 max-w-7xl mx-auto">
                    <Alert className="shadow-lg bg-white/80 backdrop-blur-sm border-blue-200">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                        <AlertDescription className="text-blue-700">
                            {message}
                        </AlertDescription>
                    </Alert>
            </div>
        </div>
    )
}
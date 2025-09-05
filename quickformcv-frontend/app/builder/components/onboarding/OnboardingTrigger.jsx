"use client"

import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { useOnboarding } from "./OnboardingProvider"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function OnboardingTrigger() {
    const { startOnboarding } = useOnboarding()

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={startOnboarding}
                        className="flex items-center justify-center p-2 text-muted-foreground hover:text-foreground bg-transparent border-gray-200/60 hover:border-gray-300 hover:bg-gray-50/50 transition-colors"
                    >
                        <HelpCircle className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-900 text-white text-xs px-2 py-1">
                    <p>Take Tour</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
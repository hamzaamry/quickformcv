"use client"

import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { useOnboarding } from "./OnboardingProvider"

export function OnboardingTrigger() {
    const { startOnboarding } = useOnboarding()

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={startOnboarding}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground bg-transparent"
        >
            <HelpCircle className="h-4 w-4" />
            Take Tour
        </Button>
    )
}
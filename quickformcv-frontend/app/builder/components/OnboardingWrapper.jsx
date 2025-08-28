"use client"

import { OnboardingProvider } from "@/app/builder/components/onboarding/OnboardingProvider"
import { OnboardingOverlay } from "@/app/builder/components/onboarding/OnboardingOverlay"

export function OnboardingWrapper({ children }) {
    return (
        <OnboardingProvider>
            {children}
            <OnboardingOverlay />
        </OnboardingProvider>
    )
}
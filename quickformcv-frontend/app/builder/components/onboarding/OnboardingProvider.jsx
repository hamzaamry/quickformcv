"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { ONBOARDING_STEPS } from "@/app/builder/constants/constants"
const OnboardingContext = createContext(undefined)

export function OnboardingProvider({ children }) {
    const [isActive, setIsActive] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)

    useEffect(() => {
        const seen = localStorage.getItem("quickform-onboarding-completed")
        if (!seen) {
            const timer = setTimeout(() => {
                setIsActive(true)
            }, 1000)
            return () => clearTimeout(timer)
        } else {
            setHasSeenOnboarding(true)
        }
    }, [])

    const startOnboarding = () => {
        setIsActive(true)
        setCurrentStep(0)
    }

    const nextStep = () => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            completeOnboarding()
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const skipOnboarding = () => {
        setIsActive(false)
        localStorage.setItem("quickform-onboarding-completed", "true")
        setHasSeenOnboarding(true)
    }

    const completeOnboarding = () => {
        setIsActive(false)
        localStorage.setItem("quickform-onboarding-completed", "true")
        setHasSeenOnboarding(true)
    }

    return (
        <OnboardingContext.Provider
            value={{
                isActive,
                currentStep,
                steps: ONBOARDING_STEPS,
                startOnboarding,
                nextStep,
                prevStep,
                skipOnboarding,
                completeOnboarding,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    )
}

export function useOnboarding() {
    const context = useContext(OnboardingContext)
    if (context === undefined) {
        throw new Error("useOnboarding must be used within an OnboardingProvider")
    }
    return context
}
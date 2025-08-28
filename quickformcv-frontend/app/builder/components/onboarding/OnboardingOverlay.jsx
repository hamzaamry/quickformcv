"use client"

import { useEffect, useState } from "react"
import { useOnboarding } from "./OnboardingProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, ArrowLeft, ArrowRight, Sparkles } from "lucide-react"

export function OnboardingOverlay() {
    const { isActive, currentStep, steps, nextStep, prevStep, skipOnboarding } = useOnboarding()
    const [spotlightPosition, setSpotlightPosition] = useState(null)
    const [tooltipPosition, setTooltipPosition] = useState(null)

    const currentStepData = steps[currentStep]
    const progress = ((currentStep + 1) / steps.length) * 100

    useEffect(() => {
        if (!isActive || !currentStepData) return

        const updatePositions = () => {
            const targetElement = document.querySelector(currentStepData.target)

            if (targetElement && currentStepData.target !== "body") {
                const rect = targetElement.getBoundingClientRect()
                const padding = 8

                setSpotlightPosition({
                    top: rect.top - padding,
                    left: rect.left - padding,
                    width: rect.width + padding * 2,
                    height: rect.height + padding * 2,
                })

                // Calculate tooltip position
                let tooltipTop = rect.top
                let tooltipLeft = rect.left

                switch (currentStepData.position) {
                    case "right":
                        tooltipTop = rect.top + rect.height / 2 - 100
                        tooltipLeft = rect.right + 20
                        break
                    case "left":
                        tooltipTop = rect.top + rect.height / 2 - 100
                        tooltipLeft = rect.left - 320
                        break
                    case "bottom":
                        tooltipTop = rect.bottom + 20
                        tooltipLeft = rect.left + rect.width / 2 - 150
                        break
                    case "top":
                        tooltipTop = rect.top - 220
                        tooltipLeft = rect.left + rect.width / 2 - 150
                        break
                    default:
                        tooltipTop = window.innerHeight / 2 - 100
                        tooltipLeft = window.innerWidth / 2 - 150
                }

                // Ensure tooltip stays within viewport
                const viewportWidth = window.innerWidth
                const viewportHeight = window.innerHeight

                if (tooltipLeft < 20) tooltipLeft = 20
                if (tooltipLeft + 300 > viewportWidth) tooltipLeft = viewportWidth - 320
                if (tooltipTop < 20) tooltipTop = 20
                if (tooltipTop + 200 > viewportHeight) tooltipTop = viewportHeight - 220

                setTooltipPosition({ top: tooltipTop, left: tooltipLeft })
            } else {
                setSpotlightPosition(null)
                setTooltipPosition({
                    top: window.innerHeight / 2 - 100,
                    left: window.innerWidth / 2 - 150,
                })
            }
        }

        updatePositions()
        window.addEventListener("resize", updatePositions)

        return () => window.removeEventListener("resize", updatePositions)
    }, [isActive, currentStep, currentStepData])

    if (!isActive || !currentStepData || !tooltipPosition) return null

    return (
        <>
            {/* Overlay */}
            <div className="onboarding-overlay" />

            {/* Spotlight */}
            {spotlightPosition && (
                <div
                    className="onboarding-spotlight"
                    style={{
                        top: spotlightPosition.top,
                        left: spotlightPosition.left,
                        width: spotlightPosition.width,
                        height: spotlightPosition.height,
                    }}
                />
            )}

            {/* Tooltip */}
            <Card
                className="fixed z-[1002] w-80 shadow-2xl border-2 border-blue-200/50 bg-white/95 backdrop-blur-sm"
                style={{
                    top: tooltipPosition.top,
                    left: tooltipPosition.left,
                }}
            >
                <CardContent className="p-6">
                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={skipOnboarding}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <Progress value={progress} className="h-2 bg-gray-100 [&>div]:bg-blue-600" />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center border border-blue-200/50">
                                <Sparkles className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-900 mb-2">{currentStepData.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{currentStepData.description}</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className="flex items-center gap-2 bg-transparent border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowLeft className="h-3 w-3" />
                                Previous
                            </Button>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={skipOnboarding}
                                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                >
                                    Skip Tour
                                </Button>
                                <Button
                                    onClick={nextStep}
                                    size="sm"
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                >
                                    {currentStep === steps.length - 1 ? "Finish" : "Next"}
                                    <ArrowRight className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
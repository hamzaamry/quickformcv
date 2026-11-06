"use client"

import { useState, useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { LeftSidebar, RightSidebar } from "../components/sidebar"
import { TopBar } from "../components/topbar"
import { PageProvider } from "../provider/PageProvider"
import { OnboardingWrapper } from "../components/OnboardingWrapper"
import { useBuilderAnalytics } from "@/app/builder/hooks/useBuilderAnalytics"
import { JobSearchButton } from "../components/jobSearchFeature/JobSearchButton"
import { useResumeData } from "@/hooks/useResumeData"
import { useResumeCompleteness } from "@/hooks/useResumeCompleteness"

export default function BuilderLayout({ children }) {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false)
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false)
  const [lastPathname, setLastPathname] = useState(null)

  const params = useParams()
  const pathname = usePathname()
  const resumeId = params?.id
  const { trackTimeSpent } = useBuilderAnalytics(resumeId)

  // Track time spent when user leaves the builder
  useEffect(() => {
    const handleBeforeUnload = () => {
      trackTimeSpent()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [trackTimeSpent])

  // Track route changes using pathname comparison
  useEffect(() => {
    if (lastPathname && !pathname.includes('/builder/')) {
      trackTimeSpent()
    }
    setLastPathname(pathname)
  }, [pathname, lastPathname, trackTimeSpent])

  const [isDismissed, setIsDismissed] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const {
    resumeData,
    isLoading: isResumeLoading,
    error: resumeError
  } = useResumeData(resumeId)

  const {
    isJobSearchReady,
    missingFields,
    completionPercentage
  } = useResumeCompleteness(resumeData)

  // Auto-hide after some time, but show again if completion changes
  useEffect(() => {
    if (completionPercentage > 0 && completionPercentage < 100) {
      const timer = setTimeout(() => {
        setIsMinimized(true)
      }, 8000) // Auto-minimize after 8 seconds

      return () => clearTimeout(timer)
    }
  }, [completionPercentage])

  // Reset dismissal when resume changes significantly
  useEffect(() => {
    setIsDismissed(false)
    setIsMinimized(false)
  }, [resumeId])

  const shouldShowIndicator = !isJobSearchReady && resumeData && !isResumeLoading && !isDismissed

  return (
      <PageProvider>
        <OnboardingWrapper>
          <div className="fixed inset-0 h-screen w-screen bg-gray-50 flex flex-col">
            <div className="h-16 flex-shrink-0">
              <TopBar
                  completenessData={
                    resumeData && !isResumeLoading ? {
                      isJobSearchReady,
                      missingFields,
                      completionPercentage
                    } : null
                  }
              />
            </div>
            <div className="flex flex-1 overflow-hidden">
              <div data-onboarding="left-sidebar" className="h-full">
                <LeftSidebar
                    isCollapsed={isLeftSidebarCollapsed}
                    onToggle={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
                />
              </div>
              <div
                  className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100/50 relative overflow-hidden"
                  data-onboarding="resume-preview"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]" />
                <div className="relative z-10 h-full overflow-auto">{children}</div>
              </div>
              <div data-onboarding="right-sidebar" className="h-full">
                <RightSidebar
                    isCollapsed={isRightSidebarCollapsed}
                    onToggle={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
                />
              </div>
            </div>

            {/* Job Search Button */}
            {resumeData && !resumeError && (
                <JobSearchButton
                    resumeData={resumeData}
                    resumeComplete={isJobSearchReady}
                />
            )}
          </div>
        </OnboardingWrapper>
      </PageProvider>
  )
}
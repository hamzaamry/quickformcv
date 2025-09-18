"use client"

import React, { useState, useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { LeftSidebar, RightSidebar } from "../components/sidebar"
import { TopBar } from "../components/topbar"
import { PageProvider } from "../provider/PageProvider"
import { OnboardingWrapper } from "../components/OnboardingWrapper"
import { useBuilderAnalytics } from "@/app/builder/hooks/useBuilderAnalytics"

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

  return (
      <PageProvider>
        <OnboardingWrapper>
          <div className="fixed inset-0 h-screen w-screen bg-gray-50">
            <TopBar />
            <div className="h-[calc(100vh-4rem)] flex">
              <div data-onboarding="left-sidebar">
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
                <div className="relative z-10 h-full">
                  {children}
                </div>
              </div>
              <div data-onboarding="right-sidebar">
                <RightSidebar
                    isCollapsed={isRightSidebarCollapsed}
                    onToggle={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
                />
              </div>
            </div>
          </div>
        </OnboardingWrapper>
      </PageProvider>
  )
}
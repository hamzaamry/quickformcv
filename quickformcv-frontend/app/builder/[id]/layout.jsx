"use client"

import { useState } from "react"
import { LeftSidebar, RightSidebar } from "../components/sidebar"
import { TopBar } from "../components/topbar"
import { PageProvider } from "../provider/PageProvider"
import { OnboardingWrapper } from "../components/OnboardingWrapper"

export default function BuilderLayout({ children }) {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false)
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false)

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
                <div className="relative z-10 h-full">{children}</div>
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

"use client"

import React from "react"
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { LEFT_SIDEBAR_SECTIONS } from "@/app/builder/constants/constants";
import { Separator } from "@/components/ui/separator"

export function LeftSidebar({ isCollapsed, onToggle }) {
    return (
        <div
            className={cn(
                "relative bg-gradient-to-b from-white to-gray-50/50 border-r border-gray-200/80 overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out shadow-sm",
                isCollapsed ? "w-[60px]" : "w-[420px]",
            )}
        >
            {/* Enhanced Toggle Button */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-20">
                <div className="flex items-center justify-between p-3">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span className="text-md font-semibold text-gray-700">Resume Content</span>
                        </div>
                    )}
                    <button
                        onClick={onToggle}
                        className={cn(
                            "group relative flex items-center justify-center rounded-lg p-2 transition-all duration-200 hover:bg-gray-100 hover:shadow-sm",
                            isCollapsed ? "ml-auto" : "",
                        )}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <div className="relative">
                            {isCollapsed ? (
                                <PanelLeftOpen className="h-4 w-4 text-gray-600 transition-colors group-hover:text-blue-600" />
                            ) : (
                                <PanelLeftClose className="h-4 w-4 text-gray-600 transition-colors group-hover:text-blue-600" />
                            )}
                        </div>

                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                            <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                Expand sidebar
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* Sidebar Content */}
            <div className="pb-6">
                {isCollapsed ? (
                    // Enhanced Collapsed State
                    <div className="p-3 space-y-3">
                        {LEFT_SIDEBAR_SECTIONS.map(({ icon: Icon, title }, index) => (
                            <div key={index} className="group relative flex justify-center">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-200">
                                    <Icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                                </div>

                                {/* Enhanced Tooltip */}
                                <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-3 h-3" />
                                        {title}
                                    </div>
                                    {/* Tooltip arrow */}
                                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Enhanced Expanded State
                    <div className="space-y-1">
                        {LEFT_SIDEBAR_SECTIONS.map(({ Component, showSeparator, icon: Icon, title }, index) => (
                            <React.Fragment key={Component.name || index}>
                                <div className="group">
                                    <div
                                        className="mx-3 mb-2 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                                        data-onboarding={title === "Basics" ? "basics-section" : undefined}
                                    >
                                        <Component />
                                    </div>
                                </div>
                                {showSeparator && (
                                    <div className="px-6 py-2">
                                        <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

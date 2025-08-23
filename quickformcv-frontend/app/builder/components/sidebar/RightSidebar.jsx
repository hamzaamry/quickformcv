"use client";

import React from "react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RIGHT_SIDEBAR_SECTIONS } from "@/app/builder/constants/constants";
import { cn } from "@/lib/utils";

export function RightSidebar({ isCollapsed, onToggle }) {
  return (
    <div
      className={cn(
        "relative bg-gradient-to-b from-white to-gray-50/50 border-l border-gray-200/80 overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out shadow-sm",
        isCollapsed ? "w-[60px]" : "w-[380px]",
      )}
    >
      {/* Enhanced Toggle Button */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-gray-100 z-20">
        <div className="flex items-center justify-between p-3">
          <button
            onClick={onToggle}
            className={cn(
              "group relative flex items-center justify-center rounded-lg p-2 transition-all duration-200 hover:bg-gray-100 hover:shadow-sm",
              isCollapsed ? "mr-auto" : "",
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <div className="relative">
              {isCollapsed ? (
                <PanelRightOpen className="h-4 w-4 text-gray-600 transition-colors group-hover:text-purple-600" />
              ) : (
                <PanelRightClose className="h-4 w-4 text-gray-600 transition-colors group-hover:text-purple-600" />
              )}
            </div>

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute right-full mr-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                Expand sidebar
              </div>
            )}
          </button>

          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <span className="text-md font-semibold text-gray-700">
                Customization
              </span>
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="pb-6">
        {isCollapsed ? (
          // Enhanced Collapsed State
          <div className="p-3 space-y-3">
            {RIGHT_SIDEBAR_SECTIONS.map(({ icon: Icon, title }, index) => (
              <div key={index} className="group relative flex justify-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-200">
                  <Icon className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
                </div>

                {/* Enhanced Tooltip */}
                <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3 h-3" />
                    {title}
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Enhanced Expanded State
          <div className="space-y-1">
            {RIGHT_SIDEBAR_SECTIONS.map(
              ({ Component, showSeparator, icon: Icon, title }, index) => (
                <React.Fragment key={Component.name || index}>
                  <div className="group">
                    <div className="mx-3 mb-2 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                      <Component />
                    </div>
                  </div>
                  {showSeparator && (
                    <div className="px-6 py-2">
                      <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    </div>
                  )}
                </React.Fragment>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

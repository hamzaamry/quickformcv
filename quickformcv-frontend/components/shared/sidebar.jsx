"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FileScan,
  FileUser,
  PanelLeft,
  PanelLeftClose,
  Settings,
  User,
} from "lucide-react";

export function Sidebar({ className, isCollapsed, setIsCollapsed }) {
  const currentPath = usePathname();

  const navigation = [
    {
      name: "Resume builder",
      href: "/resumes",
      icon: FileUser,
    },
    {
      name: "Resume scan",
      href: "/resume-scan",
      icon: FileScan,
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (href, exact = false) => {
    if (exact) {
      return (
        currentPath === href || (href === "/overview" && currentPath === "/")
      );
    }
    return currentPath.startsWith(href);
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-shrink-0 flex-col bg-white transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[80px]" : "w-[280px]",
        className,
      )}
      style={{
        boxShadow: "0px 0px 30px 5px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="flex items-center justify-between p-6">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">QuickForm CV</span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="ml-auto hover:bg-gray-100 rounded-md p-2 transition-colors"
        >
          {isCollapsed ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeft className="h-5 w-5" />
          )}
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navigation.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "nav-link flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                isCollapsed ? "justify-center" : "",
                active
                  ? "bg-gray-100 text-primary active-link"
                  : "text-muted-foreground hover:bg-gray-100 hover:text-primary",
              )}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && item.name}
            </Link>
          );
        })}
      </nav>

      {/* Profile and Settings Section */}
      <div className="p-4 border-t">
        <div className="space-y-2">
          <Link
            href="/settings"
            className={cn(
              "nav-link flex text-sm items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-gray-100 hover:text-primary transition-colors",
              isCollapsed ? "justify-center" : "",
              currentPath === "/settings" && "bg-gray-100 text-primary",
            )}
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && "Settings"}
          </Link>
          <Link
            href="/profile"
            className={cn(
              "nav-link text-sm flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-gray-100 hover:text-primary transition-colors",
              isCollapsed ? "justify-center" : "",
              currentPath === "/profile" && "bg-gray-100 text-primary",
            )}
          >
            <User className="h-4 w-4" />
            {!isCollapsed && "Profile"}
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { UserProfile } from "./userProfile";

export function Navbar() {
  const currentPath = usePathname();

  const pagetitles = {
    "/resumes": "Resumes",
  };

  const pageTitle = pagetitles[currentPath] || "QuickForm CV";

  return (
    <header className="flex h-16 items-center border-b bg-[#FBFBFB] px-4">
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-xl font-semibold">{pageTitle}</h1>
        <div className="flex items-center gap-4">
          <UserProfile />
        </div>
      </div>
    </header>
  );
}

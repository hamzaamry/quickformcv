"use client";

import { usePathname } from "next/navigation";
import { UserProfile } from "./userProfile";
import { QuickFormLogoBlue } from "@/components/icons/QuickFormLogoBlue";
import Link from "next/link";

export function Navbar() {
  const currentPath = usePathname();

  const pagetitles = {
    "/resumes": "Resumes",
  };

  const pageTitle = pagetitles[currentPath] || null;

  return (
      <header className="flex h-16 items-center border-b bg-[#FBFBFB] px-4 shadow-sm">
        <div className="flex flex-1 items-center justify-between">
          <Link href="/resumes" className="flex items-center gap-2">
            <QuickFormLogoBlue className="h-6 w-auto" />{" "}
            {pageTitle && (
                <span className="hidden sm:inline text-lg font-semibold text-gray-900">
              {pageTitle}
            </span>
            )}
          </Link>
          <div className="flex items-center gap-4">
            <UserProfile />
          </div>
        </div>
      </header>
  );
}
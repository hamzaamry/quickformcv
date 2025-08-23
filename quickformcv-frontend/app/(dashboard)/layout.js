"use client";

import { Navbar } from "@/components/shared/navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#FBFBFB]">
      <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out">
        <Navbar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

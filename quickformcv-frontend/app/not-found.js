"use client";

import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* 404 Content */}
      <main className="relative flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        {/* Background decorative elements */}
        <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 h-32 w-32 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-500/20 blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 h-24 w-24 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20 blur-2xl"></div>

        <div className="w-full max-w-2xl text-center">
          <div className="relative">
            <div>
              <div className="mb-8">
                <h1 className="text-8xl sm:text-9xl font-bold text-gray-200 select-none">
                  404
                </h1>
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-6">
                Oops! This page seems to be{" "}
                <span className="relative whitespace-nowrap text-blue-600">
                  <span className="relative">missing</span>
                </span>
              </h2>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Link href="/">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 w-full sm:w-auto"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

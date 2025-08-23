"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  EmptyState,
  LoadingSkeleton,
  NoSearchResults,
  ResumeGrid,
} from "./components";
import { CreateResumeDialog } from "@/app/(dashboard)/resumes/components/Dialogs/CreateResumeDialog";
import { useResumes } from "@/hooks/useResume";
import { authService } from "@/services/api/auth";
import { motion } from "framer-motion";

export default function Resumes() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading } = useResumes();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("Latest First");
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleTokensFromURL = async () => {
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");

      if (accessToken && refreshToken) {
        try {
          await authService.storeTokens(accessToken, refreshToken);
          // Clean URL by removing query parameters without page reload
          const url = new URL(window.location);
          url.searchParams.delete("access_token");
          url.searchParams.delete("refresh_token");
          window.history.replaceState({}, document.title, url.toString());
        } catch (error) {
          console.error("Failed to store tokens from URL:", error);
        }
      }
    };
    handleTokensFromURL();
  }, [searchParams]);

  const filteredAndSortedResumes = useMemo(() => {
    if (!data?.data) return [];

    return data.data
      .filter((resume) =>
        resume.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => {
        return sortOrder === "Latest First"
          ? new Date(b.updated_at) - new Date(a.updated_at)
          : new Date(a.updated_at) - new Date(b.updated_at);
      });
  }, [data?.data, searchQuery, sortOrder]);

  const handleCreateClick = () => setDialogOpen(true);

  const renderContent = () => {
    if (isLoading) return <LoadingSkeleton />;

    if (filteredAndSortedResumes.length === 0) {
      return searchQuery ? (
        <NoSearchResults />
      ) : (
        <EmptyState onCreateClick={handleCreateClick} />
      );
    }
    return (
      <ResumeGrid
        resumes={filteredAndSortedResumes}
        onCreateClick={handleCreateClick}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10" />

      <div className="p-2 sm:p-6 max-w-7xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-1 sm:mb-2">
            Build Your Resume With QuickForm CV
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base">
            Let's build something that gets you hired
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6"
        >
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200"
            />
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 w-full sm:w-auto">
            <Clock size={14} />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent border-none focus:ring-0 cursor-pointer w-full sm:w-auto"
            >
              <option value="Latest First">Latest First</option>
              <option value="Oldest First">Oldest First</option>
            </select>
          </div>
        </motion.div>

        {renderContent()}

        <CreateResumeDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </div>
    </div>
  );
}

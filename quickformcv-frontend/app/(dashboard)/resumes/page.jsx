"use client";

import { useMemo, useState } from "react";
import { Clock, Search } from "lucide-react";
import {
  EmptyState,
  LoadingSkeleton,
  NoSearchResults,
  ResumeGrid,
} from "./components";
import { CreateResumeDialog } from "@/app/(dashboard)/resumes/components/Dialogs/CreateResumeDialog";
import { useResumes } from "@/hooks/useResume";
import { motion } from "framer-motion";

export default function Resumes() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading } = useResumes();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("Latest First");

  const filteredAndSortedResumes = useMemo(() => {
    if (!data?.data) return [];

    return data.data
      .filter((resume) =>
        resume.title.toLowerCase().includes(searchQuery.toLowerCase())
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
      <div className="min-h-screen bg-[#fbfbfb]">
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10" />

        <div className="px-3 py-4 sm:px-6 sm:py-6 max-w-7xl mx-auto">
          <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 sm:mb-6 text-center sm:text-left"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900 mb-2 leading-tight">
              Build Your Resume With{" "}
              <span className="relative whitespace-nowrap text-blue-600">
                <svg
                    aria-hidden="true"
                    viewBox="0 0 418 42"
                    className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70"
                    preserveAspectRatio="none"
                >
                  <path d="m203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                </svg>
                <span className="relative">QuickForm CV</span>
              </span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Let's build something that gets you hired
            </p>
          </motion.div>

          {/* Search + Sort Controls */}
          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6"
          >
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
              <input
                  type="text"
                  placeholder="Search resumes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-gray-400 shadow-sm"
                  aria-label="Search resumes"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600 bg-white rounded-lg border border-gray-200 px-3 py-2.5 sm:py-3 shadow-sm">
              <Clock size={16} className="flex-shrink-0 text-blue-500" />
              <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 focus:outline-none cursor-pointer text-sm min-w-0 flex-1 sm:flex-initial"
                  aria-label="Sort order"
              >
                <option value="Latest First">Latest First</option>
                <option value="Oldest First">Oldest First</option>
              </select>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
          >
            {renderContent()}
          </motion.div>

          {/* Create Resume Dialog */}
          <CreateResumeDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </div>
      </div>
  );
}
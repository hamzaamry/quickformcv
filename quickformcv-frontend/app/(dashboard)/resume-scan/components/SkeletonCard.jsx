"use client";

import { motion } from "framer-motion";

export const SkeletonCard = ({ delay = 0, count = 1 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="w-full"
    >
      <div className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse">
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </motion.div>
  );
};

export const SkeletonCardGrid = ({ items = 5 }) => {
  return (
    <>
      {Array(items)
        .fill(0)
        .map((_, index) => (
          <SkeletonCard key={index} delay={0.2 + index * 0.05} />
        ))}
    </>
  );
};

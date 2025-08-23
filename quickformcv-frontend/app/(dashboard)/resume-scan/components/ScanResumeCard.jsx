"use client";

import { ArrowRight, Plus } from "lucide-react";

export const ScanResumeCard = ({ onClick }) => {
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg h-full p-6 hover:shadow-md transition-shadow duration-300 group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center text-center h-full py-6">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
          <Plus size={24} className="text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          Scan New Resume
        </h3>
        <p className="text-gray-500 text-sm mb-5">
          Upload your resume for instant analysis and feedback
        </p>
        <div className="inline-flex items-center text-black font-medium text-sm group-hover:underline cursor-pointer">
          Upload Resume{" "}
          <ArrowRight
            size={16}
            className="ml-1 transform group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </div>
  );
};

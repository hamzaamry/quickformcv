"use client"

export const EmptyState = ({ onCreateClick }) => (
  <div className="flex flex-col items-center justify-center w-full py-16 sm:py-20">
    <p className="text-gray-600 text-center mb-3 sm:mb-4 text-sm sm:text-base">
      You don't have any resumes yet
    </p>
    <button
      onClick={onCreateClick}
      className="inline-flex h-10 overflow-hidden rounded-md bg-black text-white px-4 py-2 text-sm font-medium transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
    >
      Create Your First Resume
    </button>
  </div>
);


// education : date and year not scrollable
// update this : © 2024 QuickForm CV. All rights reserved.
//Free Resume Builder Online - Professional ATS Templates 2025 | ClaraHire (pdf)
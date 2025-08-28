"use client"

export const EmptyState = ({ onCreateClick }) => (
<div className="flex flex-col items-center justify-center w-full py-16 sm:py-20">
    <div className="mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
        </div>
    </div>
    <p className="text-gray-600 text-center mb-3 sm:mb-4 text-sm sm:text-base">
        You don't have any resumes yet
    </p>
    <button
        onClick={onCreateClick}
        className="inline-flex items-center justify-center h-10 overflow-hidden rounded-md bg-blue-600 text-white px-6 py-2 text-sm font-medium transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
        Create Your First Resume
    </button>
</div>
);
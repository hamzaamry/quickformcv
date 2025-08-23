import { Search } from "lucide-react";

export const NoSearchResults = () => (
  <div className="flex flex-col items-center justify-center w-full py-16 sm:py-20">
    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
      <Search size={20} className="text-gray-400" />
    </div>
    <p className="text-gray-600 text-center text-sm sm:text-base">
      No resumes match your search
    </p>
  </div>
);

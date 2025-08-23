"use client";

import { Search } from "lucide-react";

export const SearchInput = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="relative w-full md:w-64">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

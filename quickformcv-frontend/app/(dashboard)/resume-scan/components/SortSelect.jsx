"use client";

import { Clock } from "lucide-react";

export const SortSelect = ({ value, onChange, options }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Clock size={14} />
      <select
        value={value}
        onChange={onChange}
        className="bg-transparent border-none focus:ring-0 cursor-pointer"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

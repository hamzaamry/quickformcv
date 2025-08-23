import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

export const FileHeader = ({ data }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="flex items-center">
        <Link
          href="/resume-scan"
          className="mr-4 p-2 rounded-full hover:bg-white transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {data.title || "Untitled"}
            </h1>
            <span className="ml-3 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              PDF
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Calendar size={14} className="mr-1" />
            <span>Scanned on {data.created_at}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

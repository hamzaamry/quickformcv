"use client";

import {FileText} from "lucide-react";
import {Button} from "@/components/ui/button";
import {usePageContext} from "@/app/builder/context/PageContext";

export default function PageNavigationTabs() {
  const { pages, activePageId, setActivePageId } = usePageContext();

  // Don't show navigation if only one page
  if (pages.length <= 1) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-center gap-1.5 p-1 rounded-full bg-gray-100 mx-auto">
        {pages.map((page) => {
          const isActive = page.id === activePageId;

          return (
            <Button
              key={page.id}
              onClick={() => setActivePageId(page.id)}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={`rounded-full flex items-center gap-2 transition-all duration-200 ${
                isActive
                  ? "bg-black text-white shadow-sm hover:bg-gray-800 px-4"
                  : "text-gray-600 hover:bg-gray-200 px-3"
              }`}
            >
              <FileText
                size={14}
                className={isActive ? "text-white" : "text-gray-500"}
              />
              <span className="font-medium">{page.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

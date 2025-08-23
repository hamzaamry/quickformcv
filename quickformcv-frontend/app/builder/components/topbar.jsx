"use client";

import { ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QuickFormLogo } from "@/components/icons/QuickFormLogo";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { UserAvatar } from "@/components/shared/userAvatar";
import { PDFExportButton } from "@/app/builder/components/PDFExportButton";
import { useResume } from "@/hooks/useResume";

export function TopBar() {
  const params = useParams();
  const resumeId = params?.id;
  const { data, isLoading } = useResume(resumeId);

  return (
      <div className="sticky top-0 z-50 w-full">
        <div className="flex h-16 items-center justify-between border-b border-gray-200/80 bg-white/95 backdrop-blur-sm px-6 shadow-sm">
          <div className="flex items-center">
            <Link
                href="/resumes"
            >
              <div className="relative">
                <QuickFormLogo className="h-8 w-auto" />
              </div>
            </Link>
          </div>

          <div className="flex items-center justify-center">
            <div className="rounded-full bg-gray-50/80 px-4 py-2 backdrop-blur-sm">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                          href="/resumes"
                          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Resumes
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-gray-300 animate-pulse" />
                          <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse" />
                        </div>
                    ) : (
                        <span className="text-sm font-semibold text-gray-900 max-w-[200px] truncate">
                      {data?.data?.title || "Untitled Resume"}
                    </span>
                    )}
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-3">
            {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="h-9 w-28 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
                  <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse" />
                </div>
            ) : (
                <>
                  <div className="hidden sm:block">
                    <PDFExportButton resumeData={data?.data} />
                  </div>
                  <div className="relative">
                    <UserAvatar />
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500 shadow-sm" />
                  </div>
                </>
            )}
          </div>
        </div>
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
}

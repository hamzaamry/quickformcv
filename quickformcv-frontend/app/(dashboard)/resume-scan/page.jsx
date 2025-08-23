"use client";

import { useState, useEffect } from "react";
import UploadCVDialog from "@/components/dialogs/UploadCVDialog";
import { useResumeScans, useUploadResumeScan } from "@/hooks/useResumeScan";
import { useRouter } from "next/navigation";
import {
  ScanResumeCard,
  ResumeScanningLoader,
  SortSelect,
  ScannedResumeCard,
  AnimatedElement,
  SkeletonCardGrid,
  SearchInput,
} from "./components";

export default function ResumeScanPage() {
  const [sortOrder, setSortOrder] = useState("Latest First");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter();

  const { data: scansResponse = [], isLoading } = useResumeScans();

  const { mutate: uploadScan } = useUploadResumeScan();

  const scans = scansResponse?.data || [];
  const sortOptions = [
    "Latest First",
    "Oldest First",
    "Highest Score",
    "Lowest Score",
  ];

  const filteredResumes = scans.filter((resume) => {
    if (!searchQuery) return true;
    return resume.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedResumes = [...filteredResumes].sort((a, b) => {
    if (sortOrder === "Latest First") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortOrder === "Oldest First") {
      return new Date(a.created_at) - new Date(b.created_at);
    } else if (sortOrder === "Highest Score") {
      return b.overall_score - a.overall_score;
    } else {
      return a.overall_score - b.overall_score;
    }
  });

  const handleContinue = (file) => {
    setDialogOpen(false);
    setSelectedFile(file);
    setShowLoader(true);

    setTimeout(() => {
      uploadScan(file, {
        onSuccess: (response) => {
          // We'll keep the loader visible for a bit to ensure smooth transition
          const data = response.data || response;
          const scanId = data.id;

          // Show loader for at least 5 seconds total for a better UX
          setTimeout(() => {
            setShowLoader(false);
            router.push(`/resume-scan/${scanId}`);
          }, 1500); // Additional delay after success for smoother experience
        },
        onError: (error) => {
          console.error("Upload failed:", error);
          setShowLoader(false);
          // Could add error notification here
        },
      });
    }, 300); // Give the loader 3 seconds head start
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (selectedFile) {
        // Clean up any file references if needed
        setSelectedFile(null);
      }
    };
  }, []);

  return (
    <>
      <UploadCVDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onContinue={handleContinue}
      />

      {showLoader && <ResumeScanningLoader />}

      <div className="p-2 sm:p-6 max-w-7xl mx-auto z-10">
        <AnimatedElement direction="down" className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
            Scan your resume with Clara
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Analyze your resume, get detailed feedback, and improve your chances
            of landing your dream job
          </p>
        </AnimatedElement>

        <AnimatedElement
          delay={0.1}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
        >
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resumes"
          />

          <div className="flex items-center gap-4 w-full md:w-auto">
            <SortSelect
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              options={sortOptions}
            />
          </div>
        </AnimatedElement>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatedElement delay={0.2} className="w-full">
            <ScanResumeCard onClick={() => setDialogOpen(true)} />
          </AnimatedElement>

          {isLoading ? (
            <SkeletonCardGrid items={5} />
          ) : (
            sortedResumes.map((resume, index) => (
              <AnimatedElement
                key={resume.id}
                delay={0.2 + index * 0.05}
                className="w-full"
              >
                <ScannedResumeCard
                  resume={{
                    id: resume.id,
                    fileName: resume.title,
                    overallScore: resume.overall_score,
                    scanDate: resume.created_at,
                    sectionScores: resume.section_scores,
                  }}
                />
              </AnimatedElement>
            ))
          )}
        </div>
      </div>
    </>
  );
}

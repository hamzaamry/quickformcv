"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTemplateByName } from "@/app/builder/templates";

export default function PrintPreviewPage() {
  const params = useParams();
  const resumeId = params?.id;
  const [resumeData, setResumeData] = useState(null);
  const pages = resumeData?.metadata?.pages || [];
  const hasMultiplePages = pages.length > 0;

  useEffect(() => {
    const loadData = () => {
      try {
        const data = window.__RESUME_DATA__;
        if (data) {
          setResumeData(data);
          return true;
        }
      } catch (err) {
        console.error("Error loading ", err);
      }
      return false;
    };

    if (!loadData()) {
      const timeout = setTimeout(() => {
        if (!loadData()) {
          console.error("Could not load resume data. Please try again.");
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [resumeId]);

  if (!resumeData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume data...</p>
          <p className="text-sm text-gray-400 mt-2">Resume ID: {resumeId}</p>
        </div>
      </div>
    );
  }

  const Template = getTemplateByName(resumeData.metadata?.template)?.component;
  if (!Template) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center text-red-500">
          <h2 className="text-xl font-bold mb-2">Template Not Found</h2>
          <p>Template "{resumeData.metadata?.template}" could not be loaded</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: white;
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .print-container {
          background: white;
          min-height: ${hasMultiplePages ? "auto" : "100vh"};
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }

        .resume-page {
          background: white;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          margin: 0 auto 20px auto;
          width: 210mm;
          min-height: 297mm;
          page-break-inside: avoid;
        }

        @media print {
          .print-container {
            padding: 0;
            margin: 0;
          }

          .resume-page {
            box-shadow: none;
            margin: 0;
            width: 100% !important;
            min-height: 100vh;
            page-break-after: always;
          }

          .resume-page:last-child {
            page-break-after: avoid;
          }
        }

        @page {
          size: A4;
          margin: 0;
        }
      `}</style>
      <div className="print-container">
        {hasMultiplePages ? (
          pages.map((pageDef) => {
            return (
              <div key={pageDef.id} data-resume-page className="resume-page">
                <Template
                  resumeData={resumeData}
                  isPrintMode={true}
                  activePage={pageDef}
                />
              </div>
            );
          })
        ) : (
          // Fallback for resumes without defined pages (e.g., old data)
          <div data-resume-page className="resume-page">
            <Template resumeData={resumeData} isPrintMode={true} />
          </div>
        )}
      </div>
    </>
  );
}

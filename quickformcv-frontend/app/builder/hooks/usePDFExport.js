"use client";

import { useState } from "react";

export const usePDFExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  const exportToPDF = async (resumeData) => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/export/pdf/${resumeData.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Export failed: ${response.status}`);
      }

      const pdfBlob = await response.blob();
      if (pdfBlob.size === 0) {
        throw new Error("Generated PDF is empty");
      }

      // Download the PDF
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resumeData.basics?.firstName || "Resume"}_${resumeData.basics?.lastName || "Export"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      console.error("PDF export error:", err);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  const openPrintPreview = (resumeData) => {
    try {
      const previewUrl = `/builder/print-preview/${resumeData.id}`;
      window.open(previewUrl, "_blank");
      return true;
    } catch (err) {
      console.error("Print preview error:", err);
      setError(err.message);
      return false;
    }
  };

  return {
    exportToPDF,
    openPrintPreview,
    isExporting,
    error,
  };
};

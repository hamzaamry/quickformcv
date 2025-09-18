import { Download, Loader2 } from "lucide-react";
import { usePDFExport } from "../hooks/usePDFExport";
import { Button } from "@/components/ui/button";

export const PDFExportButton = ({ resumeData }) => {
  const { exportToPDF, isExporting } = usePDFExport();

  const handleExport = async () => {
    if (!resumeData?.metadata) {
      console.error("Resume data with metadata is required");
      return;
    }

    await exportToPDF(resumeData);
  };

  const isDisabled = isExporting || !resumeData?.metadata;

  return (
      <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={isDisabled}
          data-testid="pdf-export-button"
      >
        {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
            <Download className="w-4 h-4" />
        )}
        {isExporting ? "Generating PDF..." : "Export as PDF"}
      </Button>
  );
};
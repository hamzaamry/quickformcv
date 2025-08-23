"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useResumeScan } from "@/hooks/useResumeScan";
import {
  OverallScoreCard,
  ScoreBreakdown,
  FileHeader,
  KeyInsights,
  DetailedAnalysis,
} from "@/app/(dashboard)/resume-scan/components";

export default function ResumeScanDetailsPage() {
  const params = useParams();
  const { data: scansResponse, isLoading } = useResumeScan(params.id);

  const scanData = scansResponse?.data || {};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-10 w-64 bg-gray-200 rounded-lg mb-4 mx-auto"></div>
          <div className="h-4 w-48 bg-gray-200 rounded-lg mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!scanData || Object.keys(scanData).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Resume scan not found</h2>
          <p className="text-gray-600">
            The requested resume scan data could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 md:p-8"
    >
      <FileHeader data={scanData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Score Card */}
        <OverallScoreCard score={scanData.overall_score || 0} />

        {/* Score Breakdown */}
        <ScoreBreakdown data={scanData} />

        {/* Key Insights */}
        <div className="lg:col-span-3">
          <KeyInsights data={scanData} />
        </div>
      </div>

      <DetailedAnalysis data={scanData} />
    </motion.div>
  );
}

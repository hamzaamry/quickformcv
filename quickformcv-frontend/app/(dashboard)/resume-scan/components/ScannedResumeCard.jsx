"use client";

import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  getStatusFromScore,
  getStatusColor,
  getScoreEmoji,
  formatScore,
} from "@/app/(dashboard)/resume-scan/utils";
import { ScoreIndicator } from "./ScoreIndicator";
import { ProgressBar } from "./ProgressBar";

export const ScannedResumeCard = ({ resume }) => {
  const status = getStatusFromScore(resume.overallScore);
  const getBgColorClass = (statusString) => {
    return statusString.split(" ")[0];
  };
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className={`h-1 ${getBgColorClass(getStatusColor(status))}`} />
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}
          >
            {status}
          </span>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
            <span className="text-lg" role="img" aria-label="Score emoji">
              {getScoreEmoji(resume.overallScore)}
            </span>
          </div>
        </div>

        <h2 className="text-base font-bold text-gray-900 mb-1">
          {resume.fileName}
        </h2>
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <FileText size={14} className="mr-1 text-gray-400" />
          <span>Scanned on {resume.scanDate}</span>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Score</span>
            <span className="text-sm font-bold">
              {formatScore(resume.overallScore)}
            </span>
          </div>
          <ProgressBar percentage={resume.overallScore * 100} />
        </div>

        <div className="space-y-1 mb-4">
          <ScoreIndicator
            label="First Impression"
            score={resume.sectionScores?.first_impression}
          />
          <ScoreIndicator
            label="Appearance"
            score={resume.sectionScores?.appearance}
          />
          <ScoreIndicator
            label="Career Goals"
            score={resume.sectionScores?.career_goals}
          />
          <ScoreIndicator
            label="Writing Style"
            score={resume.sectionScores?.writing_style}
          />
        </div>

        <Link
          href={`/resume-scan/${resume.id}`}
          className="inline-flex items-center text-black hover:text-gray-700 text-xs font-medium group"
        >
          View detailed analysis
          <ArrowRight
            size={14}
            className="ml-1 transform group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </div>
  );
};

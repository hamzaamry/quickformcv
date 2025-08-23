"use client";

import { formatScore } from "@/app/(dashboard)/resume-scan/utils";
import { ProgressBar } from "./ProgressBar";

const categoryColors = {
  "First Impression": "bg-indigo-500",
  Appearance: "bg-teal-500",
  "Career Goals": "bg-amber-500",
  "Writing Style": "bg-rose-500",
  default: "bg-gray-700",
};

export const ScoreIndicator = ({ label, score }) => {
  const barColor = categoryColors[label] || categoryColors.default;

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{formatScore(score)}</span>
      </div>
      <ProgressBar
        percentage={score * 100}
        height={1}
        bgColor={barColor}
        bgTrack="bg-gray-100"
      />
    </div>
  );
};

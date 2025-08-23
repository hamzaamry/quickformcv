import { Zap, Eye, Target, PenTool } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import {
  getScoreColor,
  formatScore,
  getFeedbackText,
  getScoreProgressColor,
} from "@/app/(dashboard)/resume-scan/utils";

export const ScoreBreakdown = ({ data }) => {
  if (!data || !data.section_scores) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Score Breakdown
        </h2>
        <div className="py-4 text-gray-500 text-center">
          Score data is not available or still loading...
        </div>
      </div>
    );
  }

  const scoreItems = [
    {
      key: "first_impression",
      label: "First Impression",
      Icon: Zap,
    },
    {
      key: "appearance",
      label: "Appearance",
      Icon: Eye,
    },
    {
      key: "career_goals",
      label: "Career Goals",
      Icon: Target,
    },
    {
      key: "writing_style",
      label: "Writing Style",
      Icon: PenTool,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Score Breakdown</h2>
      {/* Main Score Breakdown */}
      <div className="space-y-5">
        {scoreItems.map(({ key, label, Icon }) => {
          // Check if this specific score exists
          const score = data.section_scores[key];
          if (score === undefined) {
            return (
              <div className="flex flex-col" key={key}>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="font-medium">{label}</span>
                  </div>
                  <span className="font-semibold text-gray-400">N/A</span>
                </div>
                <div className="mt-1 mb-2">
                  <ProgressBar
                    percentage={0}
                    height={10}
                    bgColor="bg-gray-200"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Data not available for this section
                </p>
              </div>
            );
          }

          return (
            <div className="flex flex-col" key={key}>
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <Icon className={`w-5 h-5 mr-2 ${getScoreColor(score)}`} />
                  <span className="font-medium">{label}</span>
                </div>
                <span className={`font-semibold ${getScoreColor(score)}`}>
                  {formatScore(score)}
                </span>
              </div>
              {/* New ProgressBar component */}
              <div className="mt-1 mb-2">
                <ProgressBar
                  percentage={score * 100}
                  height={10}
                  bgColor={getScoreProgressColor(score)}
                />
              </div>
              <p className="text-xs text-gray-500">{getFeedbackText(score)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

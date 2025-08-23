"use client";

import {
  formatScore,
  getIconBgColor,
  getScoreBgColor,
  getScoreColor,
  getSectionIcon,
} from "@/app/(dashboard)/resume-scan/utils";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export const SectionAnalysis = ({ title, data, sectionKey }) => {
  const icon = getSectionIcon(sectionKey);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 shadow-sm"
      >
        <div className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`w-14 h-14 rounded-lg ${getIconBgColor(data.overall_score)} flex items-center justify-center mr-5 shadow-md`}
          >
            {icon}
          </motion.div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <motion.span
          whileHover={{ scale: 1.1 }}
          className={`text-xl font-bold ${getScoreColor(data.overall_score)}`}
        >
          {formatScore(data.overall_score)}
        </motion.span>
      </motion.div>

      <div className="space-y-5">
        {Object.entries(data.metrics).map(([key, metric]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-800 capitalize">
                {key.replace(/_/g, " ")}
              </h4>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreBgColor(metric.score)} ${getScoreColor(metric.score)}`}
              >
                {formatScore(metric.score)}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-700 mb-1">
                <span className="font-medium">Analysis:</span>{" "}
                {metric.explanation}
              </div>
            </div>

            <div className="flex items-start bg-white p-4 rounded-xl border border-gray-200">
              <Lightbulb
                size={18}
                className="text-amber-500 mr-3 mt-0.5 flex-shrink-0"
              />
              <div className="text-sm text-gray-700">
                <span className="font-medium">Suggestion:</span>{" "}
                {metric.suggestion}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

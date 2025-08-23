"use client";

import { motion } from "framer-motion";
import {
  getScoreEmoji,
  getScoreColor,
  getScoreText,
  getScoreProgressColor,
} from "@/app/(dashboard)/resume-scan/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ScoreGauge } from "./ScoreGauge";

export const OverallScoreCard = ({ score = 0 }) => {
  const safeScore = typeof score === "number" ? score : 0;

  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col items-center p-8 pt-5">
          <h2 className="text-xl font-bold text-gray-900 mb-3 mt-3">
            Overall Score
          </h2>

          <div className="relative mb-5 mt-2">
            <ScoreGauge score={safeScore} size="lg" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="absolute -top-3 -right-3 text-2xl"
            >
              {getScoreEmoji(safeScore)}
            </motion.div>
          </div>

          <div className="mt-5 text-center px-2">
            <p className="text-gray-600 text-lg">
              Your resume is{" "}
              <span className={`font-semibold ${getScoreColor(safeScore)}`}>
                {getScoreText(safeScore)}
              </span>{" "}
              compared to industry standards
            </p>
          </div>
          <div
            className={`w-full mt-20 p-3 rounded-b-lg text-center ${getScoreProgressColor(safeScore)} text-white font-medium`}
          >
            {safeScore >= 0.8
              ? "Ready to impress!"
              : safeScore >= 0.7
                ? "Almost there!"
                : safeScore >= 0.6
                  ? "Keep improving"
                  : "Needs attention"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

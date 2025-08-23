"use client";

import { useState, useEffect } from "react";
import { Loader2, FileText } from "lucide-react";
import { motion } from "framer-motion";

export const ResumeScanningLoader = () => {
  const [structureProgress, setStructureProgress] = useState(0);
  const [contentProgress, setContentProgress] = useState(0);
  const [recommendationsProgress, setRecommendationsProgress] = useState(0);

  const [structureComplete, setStructureComplete] = useState(false);
  const [contentComplete, setContentComplete] = useState(false);

  const getStatusText = (progress) => {
    if (progress === 100) return "Complete";
    if (progress > 0) return `${progress}%`;
    return "Pending";
  };

  // Simulate the scanning process
  useEffect(() => {
    // Phase 1: Analyzing structure (fast)
    const structureInterval = setInterval(() => {
      setStructureProgress((prev) => {
        if (prev >= 100) {
          clearInterval(structureInterval);
          setStructureComplete(true);
          return 100;
        }
        return Math.min(prev + 2, 100); // Moves relatively fast
      });
    }, 200);

    // Phase 2: Evaluating content (starts after structure is 70% complete)
    const contentTimer = setTimeout(() => {
      const contentInterval = setInterval(() => {
        setContentProgress((prev) => {
          if (prev >= 100) {
            clearInterval(contentInterval);
            setContentComplete(true);
            return 100;
          }
          return Math.min(prev + 1.5, 100); // Slower than structure
        });
      }, 200);

      return () => clearInterval(contentInterval);
    }, 1800); // Start after 1.8 seconds

    // Phase 3: Generating recommendations (starts after content is 40% complete)
    const recommendationsTimer = setTimeout(() => {
      const recommendationsInterval = setInterval(() => {
        setRecommendationsProgress((prev) => {
          if (prev >= 100) {
            clearInterval(recommendationsInterval);
            return 100;
          }
          return Math.min(prev + 0.8, 100); // Slowest progress
        });
      }, 250);

      return () => clearInterval(recommendationsInterval);
    }, 4500); // Start after 3.5 seconds

    return () => {
      clearInterval(structureInterval);
      clearTimeout(contentTimer);
      clearTimeout(recommendationsTimer);
    };
  }, []);

  // Estimated time remaining
  const getTimeRemaining = () => {
    if (recommendationsProgress > 90) return "Almost done...";
    if (contentComplete) return "About 20 seconds remaining";
    if (structureComplete) return "This usually takes about 30 seconds";
    return "This usually takes about 40 seconds";
  };

  // Pulse animation
  const pulse = {
    animate: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity },
    },
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center text-center">
          <motion.div
            className="relative mb-6"
            variants={pulse}
            animate="animate"
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-gray-600 animate-spin" />
            </div>
            <div className="absolute -right-2 -top-2 w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
              <FileText className="w-4 h-4 text-sky-600" />
            </div>
          </motion.div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Analyzing Resume
          </h3>
          <p className="text-gray-600 mb-6">
            Our AI is scanning your resume for strengths and improvement
            opportunities
          </p>

          <div className="w-full space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Analyzing structure</span>
                <span
                  className={`${structureComplete ? "text-emerald-600 font-medium" : "text-gray-700"}`}
                >
                  {getStatusText(structureProgress)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-emerald-500 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${structureProgress}%` }}
                  transition={{ type: "spring", damping: 30 }}
                ></motion.div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Evaluating content</span>
                <span
                  className={`${contentComplete ? "text-sky-600 font-medium" : "text-gray-700"}`}
                >
                  {getStatusText(contentProgress)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-sky-500 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${contentProgress}%` }}
                  transition={{ type: "spring", damping: 30 }}
                ></motion.div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">
                  Generating recommendations
                </span>
                <span className="text-gray-700">
                  {getStatusText(recommendationsProgress)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-amber-500 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${recommendationsProgress}%` }}
                  transition={{ type: "spring", damping: 30 }}
                ></motion.div>
              </div>
            </div>
          </div>

          <motion.p
            className="text-sm text-gray-500 mt-6"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {getTimeRemaining()}
          </motion.p>
        </div>
      </div>
    </div>
  );
};

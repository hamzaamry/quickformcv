"use client";

import { motion } from "framer-motion";
import { Lightbulb, Zap, Target, PenTool, ChevronRight } from "lucide-react";
import { formatScore } from "@/app/(dashboard)/resume-scan/utils";

export const Recommendations = ({ data }) => {
  return (
    <motion.div
      key="recommendations"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex items-start">
          <div className="bg-sky-100 p-3 rounded-xl mr-5">
            <Lightbulb size={24} className="text-sky-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Recommended Actions
            </h3>
            <p className="text-gray-700 mb-6">
              Based on your resume analysis, here are the top recommended
              actions to improve your resume:
            </p>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center mb-3">
                  <div className="bg-rose-100 p-2 rounded-lg mr-3">
                    <Zap className="w-5 h-5 text-rose-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Improve First Impression
                  </h4>
                </div>
                <p className="text-gray-700 mb-3">
                  Your resume's first impression score is low at{" "}
                  {formatScore(data.section_scores.first_impression)}. This is
                  critical as recruiters typically spend only 6-7 seconds on
                  initial resume screening.
                </p>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="font-medium text-gray-800 mb-2">
                    Action Steps:
                  </h5>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <ChevronRight
                        size={16}
                        className="text-sky-600 mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm">
                        Increase line spacing to at least 1.5 for better
                        readability
                      </span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight
                        size={16}
                        className="text-sky-600 mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm">
                        Choose a consistent font family and size throughout
                      </span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight
                        size={16}
                        className="text-sky-600 mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm">
                        Add a clear, concise summary statement at the top
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center mb-3">
                  <div className="bg-amber-100 p-2 rounded-lg mr-3">
                    <Target className="w-5 h-5 text-amber-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Clarify Career Goals
                  </h4>
                </div>
                <p className="text-gray-700 mb-3">
                  Your resume doesn't clearly communicate your target role and
                  industry, making it difficult for recruiters to see how you
                  fit their needs.
                </p>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="font-medium text-gray-800 mb-2">
                    Action Steps:
                  </h5>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <ChevronRight
                        size={16}
                        className="text-sky-600 mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm">
                        Add a clear objective statement that specifies your
                        target role
                      </span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight
                        size={16}
                        className="text-sky-600 mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm">
                        Highlight specific skills and experiences that align
                        with your target industry
                      </span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight
                        size={16}
                        className="text-sky-600 mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm">
                        Use industry-specific keywords throughout your resume
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center mb-3">
                  <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                    <PenTool className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Enhance Writing Style
                  </h4>
                </div>
                <p className="text-gray-700 mb-3">
                  Your writing style is good but could be improved with more
                  personal voice and concise phrasing.
                </p>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="font-medium text-gray-800 mb-2">
                    Action Steps:
                  </h5>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <ChevronRight
                        size={16}
                        className="text-sky-600 mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm">
                        Add personal pronouns to make your tone more
                        conversational
                      </span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight
                        size={16}
                        className="text-sky-600 mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm">
                        Rephrase longer sentences to be more concise and
                        impactful
                      </span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight
                        size={16}
                        className="text-sky-600 mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm">
                        Use strong action verbs at the beginning of bullet
                        points
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

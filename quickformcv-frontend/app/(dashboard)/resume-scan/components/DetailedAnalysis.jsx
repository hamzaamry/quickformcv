"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { SectionAnalysis } from "./SectionAnalysis";

export const DetailedAnalysis = ({ data }) => {
  const [activeTab, setActiveTab] = useState("first_impression");

  const tabs = [
    { key: "first_impression", label: "First Impression" },
    { key: "appearance", label: "Appearance" },
    { key: "career_goals", label: "Career Goals" },
    { key: "writing_style", label: "Writing Style" },
  ];

  const detailedAnalysis = data?.detailed_analysis || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Detailed Analysis
        </h2>
        <p className="text-gray-600">
          Select each section to see detailed metrics and suggestions for
          improvement.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-1 mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-max py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {activeTab === "first_impression" && (
          <SectionAnalysis
            title="First Impression"
            data={detailedAnalysis.first_impression || {}}
            sectionKey="first_impression"
          />
        )}

        {activeTab === "appearance" && (
          <SectionAnalysis
            title="Appearance"
            data={detailedAnalysis.appearance || {}}
            sectionKey="appearance"
          />
        )}

        {activeTab === "career_goals" && (
          <SectionAnalysis
            title="Career Goals"
            data={detailedAnalysis.career_goals || {}}
            sectionKey="career_goals"
          />
        )}

        {activeTab === "writing_style" && (
          <SectionAnalysis
            title="Writing Style"
            data={detailedAnalysis.writing_style || {}}
            sectionKey="writing_style"
          />
        )}
      </div>
    </motion.div>
  );
};

import React, { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import JobSearchModal from './JobSearchModal';

export const JobSearchButton = ({ resumeData, resumeComplete = false }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    // Check what's missing for tooltip
    const getMissingRequirements = () => {
        const missing = [];
        const basics = resumeData?.basics || {};
        const sections = resumeData?.sections || [];

        // Check headline
        if (!basics.headline || basics.headline.trim().length === 0) {
            missing.push('Professional headline');
        }

        // Check experience
        const experienceSection = sections.find(s => s.section_type === 'experiences');
        const experienceItems = experienceSection?.section_data?.items || [];
        if (experienceItems.length === 0) {
            missing.push('At least 1 work experience');
        }

        // Check skills
        const skillSection = sections.find(s => s.section_type === 'skills');
        const skillItems = skillSection?.section_data?.items || [];
        if (skillItems.length === 0) {
            missing.push('At least 1 skill');
        }

        return missing;
    };

    const missingRequirements = getMissingRequirements();
    const isDisabled = !resumeComplete || missingRequirements.length > 0;

    return (
        <>
            <div className="fixed bottom-6 right-6 z-40">
                <div className="relative">
                    {/* Tooltip */}
                    {showTooltip && isDisabled && (
                        <div className="absolute bottom-full right-0 mb-3 w-64 bg-gray-900 text-white text-sm rounded-lg p-3 shadow-lg z-50">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 mt-0.5 text-yellow-400 flex-shrink-0" />
                                <div>
                                    <p className="font-medium mb-1">Complete your resume first:</p>
                                    <ul className="space-y-1 text-xs">
                                        {missingRequirements.map((req, index) => (
                                            <li key={index} className="flex items-center gap-1">
                                                <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {/* Arrow */}
                            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                        </div>
                    )}

                    <button
                        onClick={() => !isDisabled && setIsModalOpen(true)}
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        className={`relative px-6 py-3 rounded-lg shadow-lg font-semibold transition-all duration-300 group overflow-hidden ${
                            isDisabled
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white hover:shadow-xl transform hover:scale-105'
                        }`}
                        disabled={isDisabled}
                    >
                        {/* Glowing effect - only when enabled */}
                        {!isDisabled && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-blue-600/20 to-indigo-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}

                        {/* Shine effect on hover - only when enabled */}
                        {!isDisabled && (
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700">
                                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            </div>
                        )}

                        <div className="flex items-center gap-2 relative z-10">
                            <Sparkles className={`w-5 h-5 ${isDisabled ? 'text-gray-400' : ''}`} />
                            <span>Find Jobs for Me</span>
                        </div>

                        {/* Outer glow - only when enabled */}
                        {!isDisabled && (
                            <div className="absolute -inset-2 bg-blue-500/30 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                        )}
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <JobSearchModal onClose={() => setIsModalOpen(false)} resumeData={resumeData} />
            )}
        </>
    );
};
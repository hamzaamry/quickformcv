import React from 'react';
import { Search, Sparkles } from 'lucide-react';

const SearchingAnimation = () => (
    <div className="flex flex-col items-center justify-center h-96 space-y-6">
        {/* Enhanced spinner with gradient and glow */}
        <div className="relative">
            {/* Outer glow */}
            <div className="absolute -inset-3 bg-blue-500/20 rounded-full blur-lg animate-pulse"></div>

            {/* Base spinner */}
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>

            {/* Animated sparkles around the search icon */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                    <Search className="w-6 h-6 text-white z-10 relative" />

                    {/* Pulsing glow around search icon */}
                    <div className="absolute inset-0 -m-3 bg-blue-500/30 rounded-full blur-md animate-ping"></div>

                    {/* Floating sparkles */}
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white rounded-full opacity-70"
                            style={{
                                top: `${Math.sin((i * Math.PI) / 2) * 20}px`,
                                left: `${Math.cos((i * Math.PI) / 2) * 20}px`,
                                animation: `float 3s ease-in-out ${i * 0.5}s infinite`
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>

        {/* Enhanced text section */}
        <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                AI is analyzing your resume...
            </h3>

            <div className="flex items-center justify-center space-x-3">
                {['Scanning skills', 'Matching preferences', 'Finding opportunities'].map((text, index) => (
                    <div
                        key={index}
                        className="flex items-center group"
                        style={{ animationDelay: `${index * 0.5}s` }}
                    >
                        <div className="relative">
                            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-800 transition-all duration-300">
                                {text}
                            </span>
                            {/* Underline effect on hover */}
                            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-full transition-all duration-300"></div>
                        </div>

                        {index < 2 && (
                            <Sparkles className="ml-2 w-4 h-4 text-blue-500 animate-pulse" />
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Add custom animation keyframes */}
        <style jsx>{`
            @keyframes float {
                0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
                50% { transform: translateY(-8px) scale(1.2); opacity: 1; }
            }
        `}</style>
    </div>
);

export default SearchingAnimation;
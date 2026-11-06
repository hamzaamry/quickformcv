import {useState} from "react";

const CompletenessNotification = ({ completionPercentage, missingFields, isJobSearchReady }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isDismissed, setIsDismissed] = useState(false)

    // Don't show if complete or dismissed
    if (isJobSearchReady || isDismissed) return null

    return (
        <div className="relative">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 px-3 py-1.5 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/60 rounded-lg text-amber-800 text-sm transition-colors backdrop-blur-sm"
            >
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="font-medium">{completionPercentage}%</span>
                <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isExpanded && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl z-50">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-800">Resume Progress</h3>
                            <button
                                onClick={() => setIsDismissed(true)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Completion</span>
                                <span className="font-semibold text-gray-800">{completionPercentage}%</span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>

                            {missingFields.length > 0 && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                    <p className="text-xs font-medium text-amber-800 mb-1">
                                        {missingFields.length <= 3 ? 'Missing fields:' : `${missingFields.length} fields needed:`}
                                    </p>
                                    <p className="text-xs text-amber-700">
                                        {missingFields.length <= 3
                                            ? missingFields.join(', ')
                                            : `${missingFields.slice(0, 3).join(', ')}, +${missingFields.length - 3} more`
                                        }
                                    </p>
                                </div>
                            )}

                            <div className="text-center pt-2 border-t border-gray-100">
                                <p className="text-xs text-gray-600">
                                    Complete your resume to unlock job search features
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CompletenessNotification
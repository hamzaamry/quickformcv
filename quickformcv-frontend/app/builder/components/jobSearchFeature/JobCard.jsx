import React from 'react';
import { MapPin, DollarSign, Clock, Star } from 'lucide-react';

const JobCard = ({ job, isBlurred = false, onClick }) => (
    <div
        className={`relative bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg cursor-pointer ${
            isBlurred ? 'overflow-hidden' : ''
        }`}
        onClick={onClick}
    >
        {isBlurred && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center space-y-2">
                    <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4" />
                    </svg>
                    <p className="text-sm font-semibold text-gray-600">Premium Only</p>
                </div>
            </div>
        )}

        <div className="p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-2xl border">
                        {job.logo}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                        <p className="text-gray-600 font-medium">{job.company}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-sm font-medium border border-green-200">
                    <Star className="w-3 h-3" />
                    {job.match}% match
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                    </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                    <Clock className="w-4 h-4" />
                    Posted {job.postedHours}
                </div>

                <p className="text-gray-700 text-sm line-clamp-2">{job.description}</p>

                <div className="flex flex-wrap gap-2">
                    {job.requirements.slice(0, 3).map((req, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium border border-blue-200">
                            {req}
                        </span>
                    ))}
                    {job.requirements.length > 3 && (
                        <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded-full text-xs border">
                            +{job.requirements.length - 3} more
                        </span>
                    )}
                </div>
            </div>
        </div>
    </div>
);

export default JobCard;
import React, { useState } from 'react';
import { Sparkles, X, AlertCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import SearchingAnimation from './SearchingAnimation';
import JobResultsView from './JobResultsView';
import { useLimitHandler } from '@/hooks/useLimitHandler';
import { useResumeData } from '@/hooks/useResumeData';
import { LIMIT_TYPES } from "@/components/constants";

const JobSearchModal = ({ onClose, resumeData }) => {
    const [searchStage, setSearchStage] = useState('idle');
    const [open, setOpen] = useState(true);
    const [jobResults, setJobResults] = useState(null);

    const resumeId = resumeData?.id;
    const { searchJobs, isJobSearchLoading } = useResumeData(resumeId);
    const { handleLimitError, UpgradeDialogComponent } = useLimitHandler();

    const startJobSearch = async () => {
        if (!resumeId) {
            return;
        }

        setSearchStage('searching');

        try {
            const response = await searchJobs();
            const data = response?.data;

            if (data?.jobs) {
                const transformedJobs = data?.jobs.slice(0, 8).map((job, index) => ({
                    id: index + 1,
                    title: job?.job_title || 'Job Title Not Available',
                    company: job?.employer_name || 'Company Name Not Available',
                    location: job?.job_location || 'Location Not Specified',
                    salary: 'Salary not disclosed',
                    postedHours: job?.job_posted_at ? formatTimeAgo(job?.job_posted_at) : 'Recently',
                    match: Math.floor(Math.random() * 20) + 80,
                    description: job?.job_description ?
                        job?.job_description.substring(0, 150) + '...' :
                        'Job description not available',
                    logo: getRandomLogo(),
                    applyLink: job?.job_apply_link,
                    queryUsed: job?.query_used
                }));

                setJobResults({
                    totalJobs: data?.total_jobs_found,
                    jobs: transformedJobs
                });
                setSearchStage('results');
            } else {
                throw new Error('No jobs found in response');
            }
        } catch (error) {
            if (handleLimitError(error, LIMIT_TYPES.JOB_SEARCH)) {
                // Close the main modal when showing upgrade dialog
                setOpen(false);
                return;
            }
            setSearchStage('error');
        }
    };

    const formatTimeAgo = (dateString) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

            if (diffHours < 24) {
                return `${diffHours} hours ago`;
            } else {
                const diffDays = Math.floor(diffHours / 24);
                return `${diffDays} days ago`;
            }
        } catch {
            return 'Recently posted';
        }
    };

    const getRandomLogo = () => {
        const logos = ['🚀', '💡', '🎨', '☁️', '⚡', '🔧', '💻', '🌟'];
        return logos[Math.floor(Math.random() * logos.length)];
    };

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    const handleJobClick = (jobId) => {
        if (jobId > 2) {
            setOpen(false);
            handleLimitError(
                { response: { data: { detail: 'Job search limit reached' } } },
                LIMIT_TYPES.JOB_SEARCH
            );
        } else {
            const job = jobResults?.jobs?.find(j => j.id === jobId);
            if (job?.applyLink) {
                window.open(job.applyLink, '_blank');
            }
        }
    };

    const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            onClose();
        }
    };

    const retrySearch = () => {
        setSearchStage('idle');
    };

    return (
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] p-0 overflow-hidden [&>button]:hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <DialogHeader className="px-6 py-6 border-b border-gray-200 relative z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-gray-900">AI Job Search</DialogTitle>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {searchStage === 'results' && jobResults ?
                                            `Found ${jobResults.totalJobs} jobs` :
                                            'Jobs posted in the last 3 days'
                                        }
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                            </button>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10 max-h-[calc(90vh-120px)]">
                        {searchStage === 'idle' && (
                            <div className="flex flex-col items-center justify-center space-y-6 py-16 min-h-[400px]">
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Ready to find your next opportunity?
                                    </h3>
                                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                        Our AI will analyze your resume and find the best job matches posted in the last 3 days.
                                    </p>
                                    <button
                                        onClick={startJobSearch}
                                        disabled={isJobSearchLoading}
                                        className="relative bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700">
                                            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                        </div>

                                        <div className="flex items-center gap-2 relative z-10">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            {isJobSearchLoading ? 'Searching...' : 'Start AI Job Search'}
                                        </div>

                                        <div className="absolute -inset-2 bg-blue-500/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {searchStage === 'searching' && <SearchingAnimation />}

                        {searchStage === 'error' && (
                            <div className="flex flex-col items-center justify-center space-y-6 py-16 min-h-[400px]">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertCircle className="w-8 h-8 text-red-600" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Search Failed
                                    </h3>
                                    <button
                                        onClick={retrySearch}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        )}

                        {searchStage === 'results' && jobResults && (
                            <JobResultsView
                                onJobClick={handleJobClick}
                                jobResults={jobResults}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <UpgradeDialogComponent />
        </>
    );
};

export default JobSearchModal;
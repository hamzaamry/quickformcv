import JobCard from './JobCard';

const JobResultsView = ({ onJobClick, jobResults }) => {
    const jobs = jobResults?.jobs || [];
    const totalJobs = jobResults?.totalJobs || 0;

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                    Found {totalJobs} perfect{" "}
                    <span className="relative whitespace-nowrap text-blue-600">
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 418 42"
                            className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70"
                            preserveAspectRatio="none"
                        >
                            <path d="m203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                        </svg>
                        <span className="relative">matches</span>
                    </span>
                </h3>
                <p className="text-lg text-gray-600">Based on your skills and experience</p>
                <div className="text-sm text-blue-600 font-medium mt-4">
                    Last updated: Just now
                </div>
            </div>

            {jobs.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Jobs Found</h4>
                    <p className="text-gray-600">
                        We couldn't find any jobs matching your profile right now. Try updating your resume or check back later.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {jobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                isBlurred={job.id > 2}
                                onClick={() => onJobClick(job.id)}
                            />
                        ))}
                    </div>

                    {/* Paywall promotion */}
                    {jobs.length > 2 && (
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 border border-blue-300/30 rounded-xl p-8 text-center shadow-lg relative overflow-hidden">
                            {/* Icon */}
                            <div className="relative z-10">
                                <svg className="w-12 h-12 text-white mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                          d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                </svg>

                                <h4 className="text-2xl font-bold text-white mb-3">Unlock All Opportunities</h4>
                                <p className="text-blue-100 mb-6 text-lg">
                                    Get full access to all {totalJobs} job matches and premium features
                                </p>
                                <button
                                    onClick={() => onJobClick(999)}
                                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative z-10"
                                >
                                    Upgrade Now
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default JobResultsView;
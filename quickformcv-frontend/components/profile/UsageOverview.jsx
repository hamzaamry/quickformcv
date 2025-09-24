import { UsageItem } from "./UsageItem";

export function UsageOverview({ usage, permissions }) {
    return (
        <div className="px-3 py-3">
            <p className="text-sm font-medium text-gray-900 mb-3">Current Usage</p>
            <div className="space-y-3">
                <UsageItem
                    type="ai_credits"
                    label="AI Credits"
                    usage={usage?.ai_credits}
                    hasPermission={permissions?.can_use_ai}
                />
                <UsageItem
                    type="job_searches"
                    label="Job Searches"
                    usage={usage?.job_searches}
                    hasPermission={permissions?.can_search_jobs}
                />
                <UsageItem
                    type="resumes"
                    label="Resume Builds"
                    usage={usage?.resumes}
                    hasPermission={permissions?.can_create_resume}
                />
            </div>
        </div>
    );
}
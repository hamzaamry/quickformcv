import { UsageItem } from "./UsageItem";
import { LIMIT_TYPES } from "@/components/constants";

export function UsageOverview({ usage, permissions }) {
    return (
        <div className="px-3 py-3">
            <p className="text-sm font-medium text-gray-900 mb-3">Current Usage</p>
            <div className="space-y-3">
                <UsageItem
                    type={LIMIT_TYPES.AI_CREDIT}
                    label="AI Credits"
                    usage={usage?.ai_credits}
                    hasPermission={permissions?.can_use_ai}
                />
                <UsageItem
                    type={LIMIT_TYPES.JOB_SEARCH}
                    label="Job Searches"
                    usage={usage?.job_searches}
                    hasPermission={permissions?.can_search_jobs}
                />
                <UsageItem
                    type={LIMIT_TYPES.RESUME}
                    label="Resume Builds"
                    usage={usage?.resumes}
                    hasPermission={permissions?.can_create_resume}
                />
            </div>
        </div>
    );
}
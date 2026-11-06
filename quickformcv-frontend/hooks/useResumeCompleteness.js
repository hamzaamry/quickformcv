import { useMemo } from 'react';

export const useResumeCompleteness = (resumeData) => {
    const completeness = useMemo(() => {
        if (!resumeData) {
            return {
                isComplete: false,
                missingFields: ['Resume data not loaded'],
                completionPercentage: 0,
                requirements: {
                    hasHeadline: false,
                    hasExperience: false,
                    hasSkills: false,
                    hasContact: false,
                }
            };
        }

        const basics = resumeData.basics || {};
        const sections = resumeData.sections || [];

        // Check requirements
        const hasHeadline = basics.headline && basics.headline.trim().length > 0;
        const hasContact = (basics.email && basics.email.trim().length > 0) ||
            (basics.phone && basics.phone.trim().length > 0);

        // Get section data
        const experienceSection = sections.find(s => s.section_type === 'experiences');
        const experienceItems = experienceSection?.section_data?.items || [];
        const hasExperience = experienceItems.length > 0;

        const skillSection = sections.find(s => s.section_type === 'skills');
        const skillItems = skillSection?.section_data?.items || [];
        const hasSkills = skillItems.length > 0;

        const requirements = {
            hasHeadline,
            hasExperience,
            hasSkills,
            hasContact,
        };

        // Calculate missing fields
        const missingFields = [];
        if (!hasHeadline) missingFields.push('Professional headline');
        if (!hasContact) missingFields.push('Contact information (email or phone)');
        if (!hasExperience) missingFields.push('At least 1 work experience');
        if (!hasSkills) missingFields.push('At least 1 skill');

        // Check if minimum requirements are met for job search
        const isJobSearchReady = hasHeadline && hasExperience && hasSkills;

        // Calculate overall completeness percentage
        const totalRequirements = Object.keys(requirements).length;
        const completedRequirements = Object.values(requirements).filter(Boolean).length;
        const completionPercentage = Math.round((completedRequirements / totalRequirements) * 100);

        // Full completeness check
        const isComplete = completedRequirements === totalRequirements;

        return {
            isComplete,
            isJobSearchReady,
            missingFields,
            completionPercentage,
            requirements,
            stats: {
                total: totalRequirements,
                completed: completedRequirements,
                remaining: totalRequirements - completedRequirements
            }
        };
    }, [resumeData]);

    return completeness;
};
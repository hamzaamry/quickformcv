import { useEffect, useRef, useCallback } from 'react';
import { trackBuilderOpen, trackBuilderTimeSpent } from '@/utils/analytics';

export const useBuilderAnalytics = (resumeId) => {
    const sessionStartTime = useRef(null);

    const trackTimeSpent = useCallback(() => {
        if (sessionStartTime.current && resumeId) {
            const timeSpent = Date.now() - sessionStartTime.current;
            trackBuilderTimeSpent(resumeId, timeSpent);
            sessionStartTime.current = null; // Prevent double tracking
        }
    }, [resumeId]);

    // Track session start
    useEffect(() => {
        if (resumeId) {
            sessionStartTime.current = Date.now();
            trackBuilderOpen(resumeId);
        }
    }, [resumeId]);

    return { trackTimeSpent };
};
// hooks/useScrollTracking.js
"use client";

import { useEffect } from 'react';
import { trackNavigationScroll } from '@/utils/analytics';

export const useScrollTracking = () => {
    useEffect(() => {
        let scrollTimeout;
        let lastReportedPercentage = 0;

        const trackScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);

            // Only report every 25% to avoid too many events
            const roundedPercentage = Math.floor(scrollPercentage / 25) * 25;

            if (roundedPercentage !== lastReportedPercentage && roundedPercentage <= 100) {
                lastReportedPercentage = roundedPercentage;
                trackNavigationScroll(roundedPercentage);
            }
        };

        const throttledTrackScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(trackScroll, 500);
        };

        window.addEventListener('scroll', throttledTrackScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', throttledTrackScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);
};
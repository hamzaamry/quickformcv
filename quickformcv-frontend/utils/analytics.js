export const trackEvent = (eventName, parameters = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, {
            event_category: 'User Engagement',
            ...parameters
        });
    }
};

export const trackBlogClick = (blogTitle, blogSlug, blogCategory) => {
    trackEvent('blog_click', {
        event_category: 'Content Engagement',
        blog_title: blogTitle,
        blog_slug: blogSlug,
        blog_category: blogCategory,
        page_location: window.location.pathname,
        page_title: document.title
    });
};

export const trackBlogImpression = (blogTitle, blogSlug, blogCategory, position) => {
    trackEvent('blog_impression', {
        event_category: 'Content Engagement',
        blog_title: blogTitle,
        blog_slug: blogSlug,
        blog_category: blogCategory,
        position: position,
        page_location: window.location.pathname,
        page_title: document.title
    });
};

export const trackBlogViewAll = () => {
    trackEvent('blog_view_all', {
        event_category: 'Content Engagement',
        page_location: window.location.pathname,
        page_title: document.title
    });
};

export const trackCTAClick = (ctaLocation, ctaText) => {
    trackEvent('cta_click', {
        event_category: 'CTA Interaction',
        cta_location: ctaLocation,
        cta_text: ctaText,
        page_location: window.location.pathname,
        page_title: document.title
    });
};

export const trackNavigationScroll = (scrollPercentage) => {
    trackEvent('navigation_scroll', {
        event_category: 'User Behavior',
        scroll_percentage: scrollPercentage,
        page_location: window.location.pathname,
        page_title: document.title
    });
};

export const trackSocialProofClick = (proofType, location) => {
    trackEvent('social_proof_click', {
        event_category: 'Social Proof',
        proof_type: proofType,
        location: location,
        page_location: window.location.pathname,
        page_title: document.title
    });
};

export const trackNavigation = (linkText, linkTarget) => {
    trackEvent('navigation_click', {
        event_category: 'Navigation',
        link_text: linkText,
        link_target: linkTarget,
        page_location: window.location.pathname,
        page_title: document.title
    });
};

export const trackFAQInteraction = (faqQuestion, action) => {
    trackEvent('faq_interaction', {
        event_category: 'Content Engagement',
        faq_question: faqQuestion,
        action: action,
        page_location: window.location.pathname,
        page_title: document.title
    });
};

// Builder Engagement Tracking
export const trackBuilderOpen = (resumeId) => {
    trackEvent('builder_open', {
        event_category: 'Builder Engagement',
        resume_id: resumeId,
        page_location: window.location.pathname,
        page_title: document.title,
        timestamp: new Date().toISOString()
    });
};

export const trackBuilderTimeSpent = (resumeId, timeSpent) => {
    trackEvent('builder_time_spent', {
        event_category: 'Builder Engagement',
        resume_id: resumeId,
        time_spent_seconds: Math.round(timeSpent / 1000),
        time_spent_minutes: Math.round(timeSpent / 60000),
        page_location: window.location.pathname,
        page_title: document.title,
        session_end: new Date().toISOString()
    });
};

export const trackResumeDownload = (resumeId, format, fileSize = null) => {
    trackEvent('resume_download', {
        event_category: 'Builder Engagement',
        resume_id: resumeId,
        download_format: format,
        file_size: fileSize,
        page_location: window.location.pathname,
        page_title: document.title,
        timestamp: new Date().toISOString()
    });
};

export const trackResumeDownloadError = (resumeId, format, error) => {
    trackEvent('resume_download_error', {
        event_category: 'Builder Engagement',
        resume_id: resumeId,
        download_format: format,
        error_message: error.message,
        error_type: error.name,
        page_location: window.location.pathname,
        page_title: document.title,
        timestamp: new Date().toISOString()
    });
};
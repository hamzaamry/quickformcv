import { Crown, FileText, Sparkles, Star, Zap } from "lucide-react";

export const PLAN_TYPES = {
    PREMIUM: "premium",
    PRO: "pro",
    FREE: "free"
};

export const PLANS = [
    {
        name: PLAN_TYPES.PRO,
        price: "$9.99",
        period: "month",
        description: "Perfect for active job seekers",
        icon: Star,
        popular: true,
        href: "/pricing"
    },
    {
        name: PLAN_TYPES.PREMIUM,
        price: "$19.99",
        period: "month",
        description: "For power users and professionals",
        icon: Crown,
        popular: false,
        href: "/pricing"
    }
];

export const LIMIT_TYPES = {
    AI_CREDIT: "ai_credit",
    JOB_SEARCH: "job_search",
    RESUME: "resume"
};

export const LIMIT_CONFIGS = {
    [LIMIT_TYPES.AI_CREDIT]: {
        icon: 'Sparkles',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        title: 'AI Credits Limit Reached',
        getDescription: (current, limit) =>
            `You've used ${current} out of ${limit} free AI suggestions. Upgrade to get unlimited AI-powered resume suggestions.`,
        benefits: [
            'Unlimited AI resume suggestions',
            'AI-powered content optimization',
            'Smart job matching recommendations'
        ]
    },
    [LIMIT_TYPES.JOB_SEARCH]: {
        icon: 'Zap',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        title: 'Job Search Limit Reached',
        getDescription: () =>
            `You've used all your free job searches. Upgrade to get unlimited job searches and access all opportunities.`,
        benefits: [
            'Unlimited job searches',
            'Access to all job matches',
            'Direct application links'
        ]
    },
    [LIMIT_TYPES.RESUME]: {
        icon: 'FileText',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        title: 'Resume Limit Reached',
        getDescription: (current, limit) =>
            `You've created ${current} out of ${limit} free resumes. Upgrade to create unlimited resumes and unlock premium features.`,
        benefits: [
            'Unlimited resume creation',
            'Unlimited AI suggestions',
            'Enhanced job search results'
        ]
    }
};

export const ICON_MAP = {
    'Sparkles': Sparkles,
    'Zap': Zap,
    'FileText': FileText
};

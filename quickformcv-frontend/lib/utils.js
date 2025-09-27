import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { Calendar, CreditCard, Crown, TrendingUp, User, Zap } from "lucide-react";
import {LIMIT_TYPES, PLAN_TYPES} from "@/components/constants";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatLastEdited = (dateString) => {
  const date = new Date(dateString + 'Z');
  const now = new Date();
  const diffInSeconds = (now - date) / 1000;

  if (diffInSeconds < 30) {
    return "just now";
  }

  return formatDistanceToNow(date, {
    addSuffix: true,
    includeSeconds: true
  });
};

export const getTierColor = (tier) => {
  switch (tier) {
    case PLAN_TYPES.PREMIUM: return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    case PLAN_TYPES.PRO: return "bg-gradient-to-r from-purple-500 to-purple-700";
    default: return "bg-gray-500";
  }
};

export const getTierIcon = (tier) => {
  switch (tier) {
    case PLAN_TYPES.PREMIUM: return <Crown className="h-5 w-5" />;
    case PLAN_TYPES.PRO: return <Zap className="h-5 w-5" />;
    default: return <CreditCard className="h-5 w-5" />
  }
};

export const getDisplayName = (tier) => {
  switch (tier) {
    case PLAN_TYPES.PREMIUM: return "Premium";
    case PLAN_TYPES.PRO: return "Pro";
    case PLAN_TYPES.FREE: return "Free";
    default: return tier?.charAt(0).toUpperCase() + tier?.slice(1) || "Free";
  }
};

export const getUsageIcon = (type) => {
  switch (type) {
    case LIMIT_TYPES.AI_CREDIT:
      return <TrendingUp className="h-3 w-3 text-blue-600" />
    case LIMIT_TYPES.JOB_SEARCH:
      return <Calendar className="h-3 w-3 text-blue-600" />
    case LIMIT_TYPES.RESUME:
      return <User className="h-3 w-3 text-blue-600" />
    default:
      return null
  }
}

export const getUsageDisplay = (usageData) => {
  if (usageData?.unlimited) {
    return <span className="text-blue-600 font-semibold">Unlimited</span>
  }

  const limit = usageData?.limit || 0
  const remaining = usageData?.remaining || 0

  if (remaining === 0) {
    return <span className="text-red-600 font-semibold">0 left</span>
  }

  return (
      <span className="font-medium">
        <span className="text-green-600">{remaining}</span>
        <span className="text-gray-400 mx-1">/</span>
        <span className="text-gray-600">{limit}</span>
      </span>
  )
}

export const extractLimitNumbers = (detail) => {
  const matches = detail.match(/\((\d+)\/(\d+)\)/);
  const [current, limit] = matches ? matches.slice(1, 3).map(Number) : [0, 0];
  return { current, limit };
};

export const determineLimitType = (detail) => {
  switch (true) {
    case detail.includes('AI credit'):
      return LIMIT_TYPES.AI_CREDIT;
    case detail.includes('Job search'):
      return LIMIT_TYPES.JOB_SEARCH;
    default:
      return LIMIT_TYPES.RESUME;
  }
};
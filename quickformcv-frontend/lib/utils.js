import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { Calendar, CreditCard, Crown, TrendingUp, User, Zap } from "lucide-react";

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
    case "premium": return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    case "pro": return "bg-gradient-to-r from-purple-500 to-purple-700";
    default: return "bg-gray-500";
  }
};

export const getTierIcon = (tier) => {
  switch (tier) {
    case "premium": return <Crown className="h-5 w-5" />;
    case "pro": return <Zap className="h-5 w-5" />;
    default: return <CreditCard className="h-5 w-5" />
  }
};

export const getDisplayName = (tier) => {
  switch (tier) {
    case "premium": return "Premium";
    case "pro": return "Pro";
    case "free": return "Free";
    default: return tier?.charAt(0).toUpperCase() + tier?.slice(1) || "Free";
  }
};

export const getUsageIcon = (type) => {
  switch (type) {
    case 'ai_credits':
      return <TrendingUp className="h-3 w-3 text-blue-600" />
    case 'job_searches':
      return <Calendar className="h-3 w-3 text-blue-600" />
    case 'resumes':
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
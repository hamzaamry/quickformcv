import { Eye, FileText, PenTool, Target, Zap } from "lucide-react";

export const getStatusFromScore = (score) => {
  if (score >= 0.85) return "Exceptional";
  if (score >= 0.75) return "Strong";
  if (score >= 0.6) return "Moderate";
  if (score >= 0.45) return "Developing";
  return "Needs Work";
};

export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "exceptional":
      return "bg-emerald-600 text-white";
    case "strong":
      return "bg-blue-600 text-white";
    case "moderate":
      return "bg-amber-500 text-white";
    case "developing":
      return "bg-orange-500 text-white";
    case "needs work":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export const getScoreEmoji = (score) => {
  if (score >= 0.9) return "🏆";
  if (score >= 0.8) return "🌟";
  if (score >= 0.7) return "👍";
  if (score >= 0.6) return "😐";
  return "📝";
};

// format score as percentage
export const formatScore = (score) => {
  return `${Math.round(score * 100)}%`;
};

export const getSectionIcon = (section) => {
  const iconClass = "w-5 h-5 text-white";
  switch (section) {
    case "first_impression":
      return <Zap className={iconClass} />;
    case "appearance":
      return <Eye className={iconClass} />;
    case "career_goals":
      return <Target className={iconClass} />;
    case "writing_style":
      return <PenTool className={iconClass} />;
    default:
      return <FileText className={iconClass} />;
  }
};

// Helper function to get score text color
export const getScoreColor = (score) => {
  if (score >= 0.8) return "text-emerald-600";
  if (score >= 0.7) return "text-sky-600";
  if (score >= 0.6) return "text-amber-600";
  return "text-rose-600";
};

// Helper function to get score background color
export const getScoreBgColor = (score) => {
  if (score >= 0.8) return "bg-emerald-100";
  if (score >= 0.7) return "bg-sky-100";
  if (score >= 0.6) return "bg-amber-100";
  return "bg-rose-100";
};

export const getIconBgColor = (score) => {
  if (score >= 0.8) return "bg-emerald-500";
  if (score >= 0.7) return "bg-sky-500";
  if (score >= 0.6) return "bg-amber-500";
  return "bg-rose-500";
};

export const getScoreProgressColor = (score) => {
  if (score >= 0.8) return "bg-emerald-500";
  if (score >= 0.7) return "bg-sky-500";
  if (score >= 0.6) return "bg-amber-500";
  return "bg-rose-600";
};

// Get feedback text based on score
export const getFeedbackText = (score) => {
  if (score < 0.5) return "Needs significant improvement";
  if (score < 0.7) return "Could be better";
  if (score < 0.8) return "Good";
  return "Excellent";
};

export const getScoreText = (score) => {
  if (score < 0.5) return "below average";
  if (score < 0.7) return "average";
  if (score < 0.8) return "good";
  return "excellent";
};

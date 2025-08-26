import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";

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

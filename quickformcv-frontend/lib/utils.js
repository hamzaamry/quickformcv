import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatLastEdited = (dateString) => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

import { format, formatDistanceToNow, parseISO } from "date-fns";

/**
 * Formats an ISO date string into a human-readable format.
 * Example: "Feb 13, 2026"
 */
export function formatDate(isoString: string): string {
  try {
    return format(parseISO(isoString), "MMM d, yyyy");
  } catch {
    return isoString;
  }
}

/**
 * Returns a relative time string from an ISO date.
 * Example: "2 hours ago", "3 days ago"
 */
export function getRelativeTime(isoString: string): string {
  try {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
  } catch {
    return isoString;
  }
}

/**
 * Converts a Date object to an ISO date string (YYYY-MM-DD) for API params.
 */
export function toISODateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

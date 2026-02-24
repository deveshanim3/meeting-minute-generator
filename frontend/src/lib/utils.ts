import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

/** Merges Tailwind classes with clsx */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats an ISO date string to a human-readable date */
export function formatDate(dateString: string, pattern = "MMM d, yyyy"): string {
  try {
    return format(new Date(dateString), pattern);
  } catch {
    return dateString;
  }
}

/** Returns initials from a full name */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Truncates text to a given length with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

/** Cleans username to alphanumeric/underscore and lower-case */
export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
}

/** Generates a simple random username */
export function generateRandomUsername(): string {
  const adjectives = ["swift", "calm", "bright", "smart", "silent", "rapid"];
  const nouns = ["fox", "owl", "panda", "tiger", "eagle", "otter"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const suffix = Math.floor(1000 + Math.random() * 9000);

  return `${adjective}_${noun}_${suffix}`;
}

/** Creates a readable fallback name from email when displayName is missing */
export function getFallbackDisplayName(email?: string | null): string {
  const local = email?.split("@")[0]?.trim();
  if (!local) return "MeetMind User";

  const pretty = local
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

  return pretty || "MeetMind User";
}

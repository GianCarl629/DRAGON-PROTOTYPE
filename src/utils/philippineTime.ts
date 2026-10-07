// Philippine Time utilities for real-time operations
export interface PhilippineTimeInfo {
  dateStr: string; // e.g. "Thursday, October 8, 2026"
  shortDateStr: string; // e.g. "Oct 8, 2026"
  isoDateStr: string; // e.g. "2026-10-08"
  timeStr: string; // e.g. "07:15:30 AM"
  shortTimeStr: string; // e.g. "07:15 AM"
  dayOfWeek: string; // e.g. "Thursday"
  day: number;
  month: number;
  monthName: string;
  year: number;
}

// Get current Philippine Time info
export function getPhilippineNow(date: Date = new Date()): PhilippineTimeInfo {
  // Format in Asia/Manila time zone
  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Manila',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const shortDateOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  const isoDateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date); // YYYY-MM-DD

  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };

  const shortTimeOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  const dateStr = new Intl.DateTimeFormat('en-US', dateOptions).format(date);
  const shortDateStr = new Intl.DateTimeFormat('en-US', shortDateOptions).format(date);
  const timeStr = new Intl.DateTimeFormat('en-US', timeOptions).format(date);
  const shortTimeStr = new Intl.DateTimeFormat('en-US', shortTimeOptions).format(date);

  const [yearStr, monthStr, dayStr] = isoDateParts.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  const monthName = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    month: 'long'
  }).format(date);

  const dayOfWeek = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    weekday: 'long'
  }).format(date);

  return {
    dateStr,
    shortDateStr,
    isoDateStr: isoDateParts,
    timeStr,
    shortTimeStr,
    dayOfWeek,
    day,
    month,
    monthName,
    year
  };
}

// Format relative timestamp in Philippine context
export function formatRelativePhilippineTime(timestampStr: string): string {
  if (!timestampStr) return 'Recently';
  if (timestampStr.startsWith('Today') || timestampStr.startsWith('Yesterday')) {
    return timestampStr;
  }

  const parsed = new Date(timestampStr);
  if (isNaN(parsed.getTime())) return timestampStr;

  const now = new Date();
  const diffMs = now.getTime() - parsed.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    month: 'short',
    day: 'numeric'
  }).format(parsed);
}

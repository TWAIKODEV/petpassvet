/**
 * Format a date to a relative time string (e.g., "2 hours ago")
 * @param date The date to format
 * @returns A string representing the relative time
 */
export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'ahora';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}sem`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mes`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}a`;
}

/**
 * Format a date to a human-readable string
 * @param date The date to format
 * @returns A formatted date string
 */
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format a time to a human-readable string
 * @param date The date to format
 * @returns A formatted time string
 */
export function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Utility functions for date handling
 */

/**
 * Format a Date object to YYYY-MM-DD string in local timezone
 * This avoids timezone issues that can cause dates to shift by one day
 */
export const formatDateToLocalString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date formatted as YYYY-MM-DD in local timezone
 */
export const getTodayFormatted = (): string => {
  return formatDateToLocalString(new Date());
};

/**
 * Parse a YYYY-MM-DD string to a Date object
 */
export const parseDateString = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return formatDateToLocalString(date1) === formatDateToLocalString(date2);
};
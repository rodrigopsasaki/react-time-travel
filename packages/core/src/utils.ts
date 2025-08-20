import type { TimePeriod } from './types.js';

/**
 * Common time periods for UI controls
 */
export const DEFAULT_TIME_PERIODS: TimePeriod[] = [
  { label: '1 minute', value: 60 * 1000, shortcut: '1m' },
  { label: '5 minutes', value: 5 * 60 * 1000, shortcut: '5m' },
  { label: '15 minutes', value: 15 * 60 * 1000, shortcut: '15m' },
  { label: '30 minutes', value: 30 * 60 * 1000, shortcut: '30m' },
  { label: '1 hour', value: 60 * 60 * 1000, shortcut: '1h' },
  { label: '6 hours', value: 6 * 60 * 60 * 1000, shortcut: '6h' },
  { label: '12 hours', value: 12 * 60 * 60 * 1000, shortcut: '12h' },
  { label: '1 day', value: 24 * 60 * 60 * 1000, shortcut: '1d' },
  { label: '1 week', value: 7 * 24 * 60 * 60 * 1000, shortcut: '1w' },
];

/**
 * Parse time period shortcut strings
 */
export function parseTimePeriod(input: string): number {
  const match = input.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*([smhdw]?)$/);
  
  if (!match) {
    throw new Error(`Invalid time period format: ${input}`);
  }

  const value = parseFloat(match[1]);
  const unit = match[2] || 'm'; // default to minutes

  const multipliers = {
    s: 1000,                    // seconds
    m: 60 * 1000,              // minutes
    h: 60 * 60 * 1000,         // hours
    d: 24 * 60 * 60 * 1000,    // days
    w: 7 * 24 * 60 * 60 * 1000 // weeks
  };

  return value * multipliers[unit as keyof typeof multipliers];
}

/**
 * Format time period to human readable string
 */
export function formatTimePeriod(milliseconds: number): string {
  const seconds = Math.abs(milliseconds) / 1000;
  const sign = milliseconds < 0 ? '-' : '';

  if (seconds < 60) {
    return `${sign}${seconds}s`;
  }

  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${sign}${Math.round(minutes * 10) / 10}m`;
  }

  const hours = minutes / 60;
  if (hours < 24) {
    return `${sign}${Math.round(hours * 10) / 10}h`;
  }

  const days = hours / 24;
  if (days < 7) {
    return `${sign}${Math.round(days * 10) / 10}d`;
  }

  const weeks = days / 7;
  return `${sign}${Math.round(weeks * 10) / 10}w`;
}

/**
 * Format date to display string
 */
export function formatDisplayDate(date: Date, options: {
  showSeconds?: boolean;
  format12Hour?: boolean;
  showDate?: boolean;
} = {}): string {
  const {
    showSeconds = false,
    format12Hour = true,
    showDate = true
  } = options;

  const parts: string[] = [];

  if (showDate) {
    parts.push(date.toLocaleDateString());
  }

  if (format12Hour) {
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };

    if (showSeconds) {
      timeOptions.second = '2-digit';
    }

    parts.push(date.toLocaleTimeString(undefined, timeOptions));
  } else {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    let timeString = `${hours}:${minutes}`;

    if (showSeconds) {
      const seconds = date.getSeconds().toString().padStart(2, '0');
      timeString += `:${seconds}`;
    }

    parts.push(timeString);
  }

  return parts.join(' ');
}

/**
 * Get relative time description
 */
export function getRelativeTimeDescription(fromTime: Date, toTime: Date = new Date()): string {
  const diffMs = toTime.getTime() - fromTime.getTime();
  const absDiffMs = Math.abs(diffMs);
  const isInPast = diffMs < 0;

  const seconds = Math.floor(absDiffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let unit: string;
  let value: number;

  if (days > 0) {
    unit = days === 1 ? 'day' : 'days';
    value = days;
  } else if (hours > 0) {
    unit = hours === 1 ? 'hour' : 'hours';
    value = hours;
  } else if (minutes > 0) {
    unit = minutes === 1 ? 'minute' : 'minutes';
    value = minutes;
  } else {
    unit = seconds === 1 ? 'second' : 'seconds';
    value = seconds;
  }

  const direction = isInPast ? 'ago' : 'from now';
  return `${value} ${unit} ${direction}`;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce function for UI interactions
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttle function for continuous events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

/**
 * Generate unique ID for components
 */
export function generateId(prefix = 'time-travel'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if a date is valid
 */
export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Safe date parsing that handles various input formats
 */
export function safeParseDate(input: Date | string | number): Date {
  if (isValidDate(input)) {
    return new Date(input.getTime());
  }

  const parsed = new Date(input);
  if (isValidDate(parsed)) {
    return parsed;
  }

  throw new Error(`Unable to parse date from input: ${input}`);
}

/**
 * Get keyboard shortcut description
 */
export function getKeyboardShortcuts(): Record<string, string> {
  return {
    'Space': 'Play/Pause time',
    'R': 'Reset to real time',
    'Arrow Up': 'Add 15 minutes',
    'Arrow Down': 'Subtract 15 minutes',
    'Shift + Arrow Up': 'Add 1 hour',
    'Shift + Arrow Down': 'Subtract 1 hour',
    'Ctrl/Cmd + Arrow Up': 'Add 1 day',
    'Ctrl/Cmd + Arrow Down': 'Subtract 1 day',
    'T': 'Focus time input',
    'Escape': 'Close time travel panel',
  };
}
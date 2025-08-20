/**
 * Environment detection type
 */
export type Environment = 'development' | 'test' | 'production';

/**
 * Time control options for initializing the time travel system
 */
export interface TimeControlOptions {
  /** Whether to enable time control (default: auto-detect based on environment) */
  enabled?: boolean;
  /** Starting date/time for time travel (default: current time) */
  startTime?: Date | string | number;
  /** Whether to hijack external libraries like moment, dayjs (default: true) */
  hijackLibraries?: boolean;
  /** Custom environment detection (default: auto-detect) */
  environment?: Environment;
  /** Callback when time changes */
  onTimeChange?: (newTime: Date) => void;
}

/**
 * Time manipulation interface
 */
export interface TimeController {
  /** Get current controlled time */
  getCurrentTime(): Date;
  /** Set new controlled time */
  setTime(time: Date | string | number): void;
  /** Add/subtract time from current controlled time */
  addTime(milliseconds: number): void;
  /** Add/subtract minutes from current controlled time */
  addMinutes(minutes: number): void;
  /** Add/subtract hours from current controlled time */
  addHours(hours: number): void;
  /** Add/subtract days from current controlled time */
  addDays(days: number): void;
  /** Reset to real time */
  resetToRealTime(): void;
  /** Check if time control is active */
  isActive(): boolean;
  /** Enable time control */
  enable(): void;
  /** Disable time control */
  disable(): void;
  /** Subscribe to time changes */
  subscribe(callback: (time: Date) => void): () => void;
}

/**
 * Original native functions backup
 */
export interface NativeFunctionBackup {
  Date: typeof Date;
  DateNow: typeof Date.now;
  DatePrototypeGetTime: typeof Date.prototype.getTime;
  DatePrototypeToString: typeof Date.prototype.toString;
  DatePrototypeToISOString: typeof Date.prototype.toISOString;
}

/**
 * Library hijack configuration
 */
export interface LibraryHijackConfig {
  moment?: boolean;
  dayjs?: boolean;
  dateFns?: boolean;
}

/**
 * Time period configuration for UI components
 */
export interface TimePeriod {
  label: string;
  value: number; // milliseconds
  shortcut?: string;
}

/**
 * Clock display options
 */
export interface ClockOptions {
  /** Show 12 or 24 hour format */
  format?: '12' | '24';
  /** Show seconds on digital display */
  showSeconds?: boolean;
  /** Show date */
  showDate?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Size of the clock */
  size?: 'small' | 'medium' | 'large' | number;
}
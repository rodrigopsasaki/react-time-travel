// Core time control functionality
export { TimeControllerImpl, getTimeController, initializeTimeControl, cleanupTimeControl } from './controller.js';
export { TimeHijacker } from './hijacker.js';

// Environment utilities
export { 
  detectEnvironment, 
  shouldEnableTimeControl, 
  isBrowser, 
  isNode,
  getEnvironmentWarning,
  logEnvironmentInfo 
} from './environment.js';

// Utility functions
export {
  DEFAULT_TIME_PERIODS,
  parseTimePeriod,
  formatTimePeriod,
  formatDisplayDate,
  getRelativeTimeDescription,
  clamp,
  debounce,
  throttle,
  generateId,
  isValidDate,
  safeParseDate,
  getKeyboardShortcuts
} from './utils.js';

// Type definitions
export type {
  Environment,
  TimeControlOptions,
  TimeController,
  NativeFunctionBackup,
  LibraryHijackConfig,
  TimePeriod,
  ClockOptions
} from './types.js';

// Convenience functions for common use cases
export function createTimeController(options?: TimeControlOptions) {
  return getTimeController(options);
}

export function enableTimeTravel(startTime?: Date | string | number) {
  const controller = getTimeController({
    enabled: true,
    startTime: startTime || new Date(),
  });
  
  return {
    setTime: (time: Date | string | number) => controller.setTime(time),
    addMinutes: (minutes: number) => controller.addMinutes(minutes),
    addHours: (hours: number) => controller.addHours(hours),
    addDays: (days: number) => controller.addDays(days),
    resetToRealTime: () => controller.resetToRealTime(),
    getCurrentTime: () => controller.getCurrentTime(),
    disable: () => controller.disable(),
    subscribe: (callback: (time: Date) => void) => controller.subscribe(callback),
  };
}

export function disableTimeTravel() {
  const controller = getTimeController();
  controller.disable();
}
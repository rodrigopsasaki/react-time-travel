// Core React integration
export { TimeProvider, useTimeContext, useTimeController, useCurrentTime, useTimeControlActive } from './TimeProvider.js';
export type { TimeProviderProps } from './TimeProvider.js';

// Time control hooks
export { 
  useTimeControl, 
  useSimpleTimeControl, 
  useKeyboardTimeControl 
} from './useTimeControl.js';
export type { 
  UseTimeControlOptions, 
  UseTimeControlReturn 
} from './useTimeControl.js';

// UI Components
export { AnalogClock } from './components/AnalogClock.js';
export type { AnalogClockProps } from './components/AnalogClock.js';

export { TimeControlPanel } from './components/TimeControlPanel.js';
export type { TimeControlPanelProps } from './components/TimeControlPanel.js';

export { TimeControlOverlay, useTimeControlOverlay } from './components/TimeControlOverlay.js';
export type { TimeControlOverlayProps } from './components/TimeControlOverlay.js';

// Re-export core functionality for convenience
export {
  getTimeController,
  initializeTimeControl,
  cleanupTimeControl,
  enableTimeTravel,
  disableTimeTravel,
  createTimeController,
  DEFAULT_TIME_PERIODS,
  parseTimePeriod,
  formatTimePeriod,
  formatDisplayDate,
  getRelativeTimeDescription,
  detectEnvironment,
  shouldEnableTimeControl,
} from '@time-travel/core';

export type {
  TimeController,
  TimeControlOptions,
  TimePeriod,
  ClockOptions,
  Environment,
} from '@time-travel/core';
import type { TimeController, TimeControlOptions } from './types.js';
import { detectEnvironment, shouldEnableTimeControl, logEnvironmentInfo } from './environment.js';
import { TimeHijacker } from './hijacker.js';

/**
 * Core time controller implementation
 */
export class TimeControllerImpl implements TimeController {
  private currentTime: Date = new Date();
  private enabled = false;
  private hijacker: TimeHijacker;
  private subscribers: Set<(time: Date) => void> = new Set();
  private options: Required<TimeControlOptions>;

  constructor(options: TimeControlOptions = {}) {
    const environment = options.environment || detectEnvironment();
    
    this.options = {
      enabled: options.enabled ?? shouldEnableTimeControl(environment),
      startTime: options.startTime || new Date(),
      hijackLibraries: options.hijackLibraries ?? true,
      environment,
      onTimeChange: options.onTimeChange || (() => {}),
    };

    // Set initial time
    this.setTime(this.options.startTime);

    // Initialize hijacker
    this.hijacker = new TimeHijacker(this);

    // Enable if requested and allowed
    if (this.options.enabled) {
      this.enable();
    }

    // Log environment info
    logEnvironmentInfo(this.options.environment, this.enabled);
  }

  getCurrentTime(): Date {
    return new Date(this.currentTime.getTime());
  }

  setTime(time: Date | string | number): void {
    const newTime = new Date(time);
    
    if (isNaN(newTime.getTime())) {
      throw new Error('Invalid time provided to setTime');
    }

    this.currentTime = newTime;
    this.notifySubscribers();
    this.options.onTimeChange(this.getCurrentTime());
  }

  addTime(milliseconds: number): void {
    if (typeof milliseconds !== 'number' || isNaN(milliseconds)) {
      throw new Error('Invalid milliseconds provided to addTime');
    }

    this.currentTime = new Date(this.currentTime.getTime() + milliseconds);
    this.notifySubscribers();
    this.options.onTimeChange(this.getCurrentTime());
  }

  addMinutes(minutes: number): void {
    this.addTime(minutes * 60 * 1000);
  }

  addHours(hours: number): void {
    this.addTime(hours * 60 * 60 * 1000);
  }

  addDays(days: number): void {
    this.addTime(days * 24 * 60 * 60 * 1000);
  }

  resetToRealTime(): void {
    this.setTime(new Date());
  }

  isActive(): boolean {
    return this.enabled;
  }

  enable(): void {
    if (this.enabled) return;

    // Check if enabling is allowed in current environment
    if (!shouldEnableTimeControl(this.options.environment)) {
      console.warn('[react-time-travel] Cannot enable time control in production environment');
      return;
    }

    this.enabled = true;
    this.hijacker.hijackNativeFunctions();
    
    if (this.options.hijackLibraries) {
      this.hijacker.hijackLibraries();
    }

    this.notifySubscribers();
  }

  disable(): void {
    if (!this.enabled) return;

    this.enabled = false;
    this.hijacker.restoreNativeFunctions();
    this.hijacker.restoreLibraries();
    this.notifySubscribers();
  }

  subscribe(callback: (time: Date) => void): () => void {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    this.subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    const currentTime = this.getCurrentTime();
    this.subscribers.forEach(callback => {
      try {
        callback(currentTime);
      } catch (error) {
        console.error('[react-time-travel] Error in subscriber callback:', error);
      }
    });
  }

  /**
   * Get current options
   */
  getOptions(): Readonly<TimeControlOptions> {
    return { ...this.options };
  }

  /**
   * Update options
   */
  updateOptions(newOptions: Partial<TimeControlOptions>): void {
    const oldHijackLibraries = this.options.hijackLibraries;
    
    this.options = {
      ...this.options,
      ...newOptions,
    };

    // Handle hijackLibraries option change
    if (this.enabled && oldHijackLibraries !== this.options.hijackLibraries) {
      if (this.options.hijackLibraries) {
        this.hijacker.hijackLibraries();
      } else {
        this.hijacker.restoreLibraries();
      }
    }

    // Handle onTimeChange option change
    if (newOptions.onTimeChange) {
      newOptions.onTimeChange(this.getCurrentTime());
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.disable();
    this.hijacker.destroy();
    this.subscribers.clear();
  }
}

// Singleton instance
let globalController: TimeControllerImpl | null = null;

/**
 * Get or create the global time controller instance
 */
export function getTimeController(options?: TimeControlOptions): TimeController {
  if (!globalController) {
    globalController = new TimeControllerImpl(options);
  } else if (options) {
    globalController.updateOptions(options);
  }
  
  return globalController;
}

/**
 * Initialize time control with options
 */
export function initializeTimeControl(options: TimeControlOptions = {}): TimeController {
  if (globalController) {
    globalController.destroy();
  }
  
  globalController = new TimeControllerImpl(options);
  return globalController;
}

/**
 * Clean up global time controller
 */
export function cleanupTimeControl(): void {
  if (globalController) {
    globalController.destroy();
    globalController = null;
  }
}
import type { NativeFunctionBackup, TimeController } from './types.js';

/**
 * Class responsible for hijacking native Date functions and external libraries
 */
export class TimeHijacker {
  private backup: NativeFunctionBackup | null = null;
  private isHijacked = false;
  private timeController: TimeController;

  constructor(timeController: TimeController) {
    this.timeController = timeController;
  }

  /**
   * Hijack native Date functions
   */
  hijackNativeFunctions(): void {
    if (this.isHijacked || typeof globalThis === 'undefined') {
      return;
    }

    // Backup original functions
    this.backup = {
      Date: globalThis.Date,
      DateNow: globalThis.Date.now,
      DatePrototypeGetTime: globalThis.Date.prototype.getTime,
      DatePrototypeToString: globalThis.Date.prototype.toString,
      DatePrototypeToISOString: globalThis.Date.prototype.toISOString,
    };

    const timeController = this.timeController;

    // Create controlled Date constructor
    function ControlledDate(this: any, ...args: any[]): any {
      // Handle different call patterns
      if (args.length === 0) {
        // new Date() - return controlled current time
        if (new.target) {
          const controlled = timeController.getCurrentTime();
          return new this.constructor.original(controlled.getTime());
        }
        // Date() - return string representation
        return timeController.getCurrentTime().toString();
      }

      // Pass through other constructor patterns with original Date
      if (new.target) {
        return new this.constructor.original(...args);
      }
      return this.constructor.original(...args);
    }

    // Copy static methods and properties from original Date
    Object.setPrototypeOf(ControlledDate, this.backup.Date);
    Object.defineProperty(ControlledDate, 'original', {
      value: this.backup.Date,
      writable: false,
      enumerable: false,
      configurable: false,
    });

    // Override Date.now()
    ControlledDate.now = () => {
      if (!timeController.isActive()) {
        return this.backup!.DateNow.call(this.backup!.Date);
      }
      return timeController.getCurrentTime().getTime();
    };

    // Copy other static methods
    Object.getOwnPropertyNames(this.backup.Date).forEach(prop => {
      if (prop !== 'now' && prop !== 'length' && prop !== 'name' && prop !== 'prototype') {
        try {
          const descriptor = Object.getOwnPropertyDescriptor(this.backup!.Date, prop);
          if (descriptor) {
            Object.defineProperty(ControlledDate, prop, descriptor);
          }
        } catch (e) {
          // Ignore non-configurable properties
        }
      }
    });

    // Set up prototype
    ControlledDate.prototype = this.backup.Date.prototype;

    // Replace global Date
    globalThis.Date = ControlledDate as any;

    this.isHijacked = true;
  }

  /**
   * Restore native Date functions
   */
  restoreNativeFunctions(): void {
    if (!this.isHijacked || !this.backup || typeof globalThis === 'undefined') {
      return;
    }

    globalThis.Date = this.backup.Date;
    this.isHijacked = false;
  }

  /**
   * Hijack external date libraries
   */
  hijackLibraries(): void {
    this.hijackMoment();
    this.hijackDayjs();
    this.hijackDateFns();
  }

  /**
   * Restore external date libraries
   */
  restoreLibraries(): void {
    this.restoreMoment();
    this.restoreDayjs();
    this.restoreDateFns();
  }

  /**
   * Hijack Moment.js if available
   */
  private hijackMoment(): void {
    if (typeof globalThis === 'undefined') return;

    try {
      // Check for moment in various locations
      const moment = (globalThis as any).moment || 
                    (typeof window !== 'undefined' && (window as any).moment) ||
                    (typeof require !== 'undefined' && (() => {
                      try { return require('moment'); } catch { return null; }
                    })());

      if (moment && typeof moment === 'function') {
        const original = moment.now;
        if (typeof original === 'function') {
          moment.now = () => {
            if (!this.timeController.isActive()) {
              return original();
            }
            return this.timeController.getCurrentTime().getTime();
          };
          
          // Store reference for restoration
          (moment.now as any).__original = original;
        }
      }
    } catch (error) {
      // Silently fail if moment is not available or accessible
    }
  }

  /**
   * Restore Moment.js
   */
  private restoreMoment(): void {
    if (typeof globalThis === 'undefined') return;

    try {
      const moment = (globalThis as any).moment || 
                    (typeof window !== 'undefined' && (window as any).moment);

      if (moment && moment.now && (moment.now as any).__original) {
        moment.now = (moment.now as any).__original;
        delete (moment.now as any).__original;
      }
    } catch (error) {
      // Silently fail
    }
  }

  /**
   * Hijack Day.js if available
   */
  private hijackDayjs(): void {
    if (typeof globalThis === 'undefined') return;

    try {
      const dayjs = (globalThis as any).dayjs || 
                   (typeof window !== 'undefined' && (window as any).dayjs) ||
                   (typeof require !== 'undefined' && (() => {
                     try { return require('dayjs'); } catch { return null; }
                   })());

      if (dayjs && typeof dayjs === 'function') {
        // Day.js doesn't have a .now() method, but we can override the constructor
        const original = dayjs;
        const controlled = (...args: any[]) => {
          if (args.length === 0 && this.timeController.isActive()) {
            return original(this.timeController.getCurrentTime());
          }
          return original(...args);
        };

        // Copy properties from original
        Object.setPrototypeOf(controlled, original);
        Object.keys(original).forEach(key => {
          (controlled as any)[key] = (original as any)[key];
        });

        // Store reference for restoration
        (controlled as any).__original = original;

        // Replace global reference
        if ((globalThis as any).dayjs) {
          (globalThis as any).dayjs = controlled;
        }
        if (typeof window !== 'undefined' && (window as any).dayjs) {
          (window as any).dayjs = controlled;
        }
      }
    } catch (error) {
      // Silently fail if dayjs is not available or accessible
    }
  }

  /**
   * Restore Day.js
   */
  private restoreDayjs(): void {
    if (typeof globalThis === 'undefined') return;

    try {
      const dayjs = (globalThis as any).dayjs || 
                   (typeof window !== 'undefined' && (window as any).dayjs);

      if (dayjs && (dayjs as any).__original) {
        const original = (dayjs as any).__original;
        
        if ((globalThis as any).dayjs) {
          (globalThis as any).dayjs = original;
        }
        if (typeof window !== 'undefined' && (window as any).dayjs) {
          (window as any).dayjs = original;
        }
      }
    } catch (error) {
      // Silently fail
    }
  }

  /**
   * Hijack date-fns if available
   */
  private hijackDateFns(): void {
    // date-fns is typically used as individual imports, making it harder to hijack
    // We focus on the `new Date()` hijacking which covers most use cases
    // Advanced users can manually pass controlled dates to date-fns functions
  }

  /**
   * Restore date-fns
   */
  private restoreDateFns(): void {
    // Nothing to restore for date-fns
  }

  /**
   * Check if hijacking is active
   */
  isActive(): boolean {
    return this.isHijacked;
  }

  /**
   * Clean up all hijacking
   */
  destroy(): void {
    this.restoreNativeFunctions();
    this.restoreLibraries();
    this.backup = null;
  }
}
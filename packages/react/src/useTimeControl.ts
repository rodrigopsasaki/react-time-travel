import { useCallback, useEffect, useState } from 'react';
import { getTimeController, TimeController, TimeControlOptions, parseTimePeriod } from '@time-travel/core';

export interface UseTimeControlOptions extends TimeControlOptions {
  /** Whether to sync component state with time changes */
  syncState?: boolean;
}

export interface UseTimeControlReturn {
  /** Current controlled time */
  currentTime: Date;
  /** Whether time control is active */
  isActive: boolean;
  /** Set a specific time */
  setTime: (time: Date | string | number) => void;
  /** Add time in milliseconds */
  addTime: (milliseconds: number) => void;
  /** Add minutes to current time */
  addMinutes: (minutes: number) => void;
  /** Add hours to current time */
  addHours: (hours: number) => void;
  /** Add days to current time */
  addDays: (days: number) => void;
  /** Reset to real-world time */
  resetToRealTime: () => void;
  /** Enable time control */
  enable: () => void;
  /** Disable time control */
  disable: () => void;
  /** Toggle time control on/off */
  toggle: () => void;
  /** Jump by a time period string (e.g., '1h', '30m', '2d') */
  jumpBy: (period: string) => void;
  /** Access to the underlying controller */
  controller: TimeController;
}

/**
 * Primary hook for time control functionality
 * Can be used with or without TimeProvider
 */
export function useTimeControl(options: UseTimeControlOptions = {}): UseTimeControlReturn {
  const { syncState = true, ...controllerOptions } = options;
  
  // Get or create controller
  const [controller] = useState(() => getTimeController(controllerOptions));
  
  // Local state that syncs with controller if syncState is true
  const [currentTime, setCurrentTime] = useState(() => controller.getCurrentTime());
  const [isActive, setIsActive] = useState(() => controller.isActive());

  // Sync state with controller if enabled
  useEffect(() => {
    if (!syncState) return;

    const unsubscribe = controller.subscribe((newTime: Date) => {
      setCurrentTime(new Date(newTime.getTime()));
      setIsActive(controller.isActive());
    });

    // Initial sync
    setCurrentTime(controller.getCurrentTime());
    setIsActive(controller.isActive());

    return unsubscribe;
  }, [controller, syncState]);

  // Update controller options when they change
  useEffect(() => {
    if (controllerOptions && Object.keys(controllerOptions).length > 0) {
      controller.updateOptions(controllerOptions);
    }
  }, [controller, controllerOptions]);

  // Memoized controller methods
  const setTime = useCallback((time: Date | string | number) => {
    controller.setTime(time);
  }, [controller]);

  const addTime = useCallback((milliseconds: number) => {
    controller.addTime(milliseconds);
  }, [controller]);

  const addMinutes = useCallback((minutes: number) => {
    controller.addMinutes(minutes);
  }, [controller]);

  const addHours = useCallback((hours: number) => {
    controller.addHours(hours);
  }, [controller]);

  const addDays = useCallback((days: number) => {
    controller.addDays(days);
  }, [controller]);

  const resetToRealTime = useCallback(() => {
    controller.resetToRealTime();
  }, [controller]);

  const enable = useCallback(() => {
    controller.enable();
  }, [controller]);

  const disable = useCallback(() => {
    controller.disable();
  }, [controller]);

  const toggle = useCallback(() => {
    if (controller.isActive()) {
      controller.disable();
    } else {
      controller.enable();
    }
  }, [controller]);

  const jumpBy = useCallback((period: string) => {
    try {
      const milliseconds = parseTimePeriod(period);
      controller.addTime(milliseconds);
    } catch (error) {
      console.error('[useTimeControl] Invalid time period:', period, error);
    }
  }, [controller]);

  return {
    currentTime,
    isActive,
    setTime,
    addTime,
    addMinutes,
    addHours,
    addDays,
    resetToRealTime,
    enable,
    disable,
    toggle,
    jumpBy,
    controller,
  };
}

/**
 * Simplified hook for basic time manipulation
 */
export function useSimpleTimeControl() {
  const { setTime, addMinutes, addHours, addDays, resetToRealTime, currentTime, isActive } = useTimeControl();

  return {
    currentTime,
    isActive,
    setTime,
    addMinutes,
    addHours,
    addDays,
    resetToRealTime,
  };
}

/**
 * Hook for keyboard-driven time control
 */
export function useKeyboardTimeControl(options: {
  enabled?: boolean;
  minuteStep?: number;
  hourStep?: number;
  dayStep?: number;
} = {}) {
  const {
    enabled = true,
    minuteStep = 15,
    hourStep = 1,
    dayStep = 1,
  } = options;

  const { addMinutes, addHours, addDays, toggle, resetToRealTime, currentTime, isActive } = useTimeControl();

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      // Don't interfere if user is typing in an input
      if (event.target && (event.target as HTMLElement).tagName === 'INPUT') {
        return;
      }

      const { key, shiftKey, ctrlKey, metaKey } = event;
      const isModified = ctrlKey || metaKey;

      switch (key) {
        case 'ArrowUp':
          event.preventDefault();
          if (isModified) {
            addDays(dayStep);
          } else if (shiftKey) {
            addHours(hourStep);
          } else {
            addMinutes(minuteStep);
          }
          break;

        case 'ArrowDown':
          event.preventDefault();
          if (isModified) {
            addDays(-dayStep);
          } else if (shiftKey) {
            addHours(-hourStep);
          } else {
            addMinutes(-minuteStep);
          }
          break;

        case ' ':
          event.preventDefault();
          toggle();
          break;

        case 'r':
        case 'R':
          if (!isModified) {
            event.preventDefault();
            resetToRealTime();
          }
          break;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, minuteStep, hourStep, dayStep, addMinutes, addHours, addDays, toggle, resetToRealTime]);

  return {
    currentTime,
    isActive,
    minuteStep,
    hourStep,
    dayStep,
  };
}
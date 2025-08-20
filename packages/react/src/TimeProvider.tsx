import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getTimeController, TimeController, TimeControlOptions } from '@time-travel/core';

interface TimeContextValue {
  controller: TimeController;
  currentTime: Date;
  isActive: boolean;
}

const TimeContext = createContext<TimeContextValue | null>(null);

export interface TimeProviderProps {
  children: ReactNode;
  options?: TimeControlOptions;
}

/**
 * TimeProvider component that provides time control context to child components
 */
export function TimeProvider({ children, options = {} }: TimeProviderProps) {
  const [controller] = useState(() => getTimeController(options));
  const [currentTime, setCurrentTime] = useState(() => controller.getCurrentTime());
  const [isActive, setIsActive] = useState(() => controller.isActive());

  useEffect(() => {
    // Subscribe to time changes
    const unsubscribeTime = controller.subscribe((newTime: Date) => {
      setCurrentTime(new Date(newTime.getTime()));
    });

    // Subscribe to activation state changes
    const unsubscribeState = controller.subscribe(() => {
      setIsActive(controller.isActive());
    });

    // Initial state sync
    setCurrentTime(controller.getCurrentTime());
    setIsActive(controller.isActive());

    return () => {
      unsubscribeTime();
      unsubscribeState();
    };
  }, [controller]);

  // Update controller options when they change
  useEffect(() => {
    if (options && Object.keys(options).length > 0) {
      controller.updateOptions(options);
    }
  }, [controller, options]);

  const contextValue: TimeContextValue = {
    controller,
    currentTime,
    isActive,
  };

  return (
    <TimeContext.Provider value={contextValue}>
      {children}
    </TimeContext.Provider>
  );
}

/**
 * Hook to access the time control context
 */
export function useTimeContext(): TimeContextValue {
  const context = useContext(TimeContext);
  
  if (!context) {
    throw new Error(
      'useTimeContext must be used within a TimeProvider. ' +
      'Wrap your component tree with <TimeProvider> to use time control features.'
    );
  }
  
  return context;
}

/**
 * Hook to get the time controller directly
 */
export function useTimeController(): TimeController {
  const { controller } = useTimeContext();
  return controller;
}

/**
 * Hook to get the current controlled time
 */
export function useCurrentTime(): Date {
  const { currentTime } = useTimeContext();
  return currentTime;
}

/**
 * Hook to check if time control is active
 */
export function useTimeControlActive(): boolean {
  const { isActive } = useTimeContext();
  return isActive;
}
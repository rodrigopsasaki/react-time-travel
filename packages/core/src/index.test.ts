import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getTimeController, initializeTimeControl, cleanupTimeControl } from './index.js';

describe('TimeController', () => {
  afterEach(() => {
    cleanupTimeControl();
  });

  describe('basic functionality', () => {
    it('should create a time controller', () => {
      const controller = getTimeController();
      expect(controller).toBeDefined();
      expect(typeof controller.getCurrentTime).toBe('function');
      expect(typeof controller.setTime).toBe('function');
      expect(typeof controller.addTime).toBe('function');
    });

    it('should set and get time', () => {
      const controller = getTimeController({ enabled: true });
      const testTime = new Date('2024-01-01T12:00:00Z');
      
      controller.setTime(testTime);
      const currentTime = controller.getCurrentTime();
      
      expect(currentTime.getTime()).toBe(testTime.getTime());
    });

    it('should add time in milliseconds', () => {
      const controller = getTimeController({ enabled: true });
      const startTime = new Date('2024-01-01T12:00:00Z');
      controller.setTime(startTime);
      
      controller.addTime(60 * 1000); // Add 1 minute
      
      const expectedTime = new Date(startTime.getTime() + 60 * 1000);
      expect(controller.getCurrentTime().getTime()).toBe(expectedTime.getTime());
    });

    it('should add minutes', () => {
      const controller = getTimeController({ enabled: true });
      const startTime = new Date('2024-01-01T12:00:00Z');
      controller.setTime(startTime);
      
      controller.addMinutes(30);
      
      const expectedTime = new Date(startTime.getTime() + 30 * 60 * 1000);
      expect(controller.getCurrentTime().getTime()).toBe(expectedTime.getTime());
    });

    it('should add hours', () => {
      const controller = getTimeController({ enabled: true });
      const startTime = new Date('2024-01-01T12:00:00Z');
      controller.setTime(startTime);
      
      controller.addHours(2);
      
      const expectedTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
      expect(controller.getCurrentTime().getTime()).toBe(expectedTime.getTime());
    });

    it('should add days', () => {
      const controller = getTimeController({ enabled: true });
      const startTime = new Date('2024-01-01T12:00:00Z');
      controller.setTime(startTime);
      
      controller.addDays(1);
      
      const expectedTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);
      expect(controller.getCurrentTime().getTime()).toBe(expectedTime.getTime());
    });
  });

  describe('enable/disable functionality', () => {
    it('should enable and disable time control', () => {
      const controller = getTimeController();
      
      expect(controller.isActive()).toBe(false);
      
      controller.enable();
      expect(controller.isActive()).toBe(true);
      
      controller.disable();
      expect(controller.isActive()).toBe(false);
    });
  });

  describe('subscription functionality', () => {
    it('should notify subscribers when time changes', () => {
      const controller = getTimeController({ enabled: true });
      const mockCallback = vi.fn();
      
      const unsubscribe = controller.subscribe(mockCallback);
      
      const newTime = new Date('2024-01-01T12:00:00Z');
      controller.setTime(newTime);
      
      expect(mockCallback).toHaveBeenCalledWith(expect.any(Date));
      
      unsubscribe();
    });

    it('should allow unsubscribing', () => {
      const controller = getTimeController({ enabled: true });
      const mockCallback = vi.fn();
      
      const unsubscribe = controller.subscribe(mockCallback);
      unsubscribe();
      
      controller.setTime(new Date());
      
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should throw error for invalid time', () => {
      const controller = getTimeController({ enabled: true });
      
      expect(() => {
        controller.setTime('invalid-date');
      }).toThrow('Invalid time provided to setTime');
    });

    it('should throw error for invalid milliseconds', () => {
      const controller = getTimeController({ enabled: true });
      
      expect(() => {
        controller.addTime(NaN);
      }).toThrow('Invalid milliseconds provided to addTime');
    });

    it('should throw error for invalid callback', () => {
      const controller = getTimeController();
      
      expect(() => {
        controller.subscribe('not-a-function' as any);
      }).toThrow('Callback must be a function');
    });
  });

  describe('initialization', () => {
    it('should initialize with custom options', () => {
      const startTime = new Date('2024-01-01T00:00:00Z');
      const onTimeChange = vi.fn();
      
      const controller = initializeTimeControl({
        enabled: true,
        startTime,
        onTimeChange,
      });
      
      expect(controller.getCurrentTime().getTime()).toBe(startTime.getTime());
      
      controller.setTime(new Date('2024-01-02T00:00:00Z'));
      expect(onTimeChange).toHaveBeenCalled();
    });
  });
});
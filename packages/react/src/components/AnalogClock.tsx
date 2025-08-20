import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ClockOptions, TimePeriod, DEFAULT_TIME_PERIODS, formatTimePeriod, clamp } from '@time-travel/core';
import { useTimeControl } from '../useTimeControl.js';

export interface AnalogClockProps extends ClockOptions {
  /** Custom time periods for quick jumps */
  timePeriods?: TimePeriod[];
  /** Whether to show time period buttons */
  showTimePeriods?: boolean;
  /** Whether to enable mouse wheel control */
  enableMouseWheel?: boolean;
  /** Mouse wheel step in minutes */
  wheelStep?: number;
  /** Shift+wheel step in hours */
  wheelShiftStep?: number;
  /** Whether to show digital time display */
  showDigitalTime?: boolean;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Whether to show current time indicator */
  showCurrentTime?: boolean;
  /** Clock face color */
  faceColor?: string;
  /** Hand colors */
  handColors?: {
    hour?: string;
    minute?: string;
    second?: string;
  };
  /** Show timezone */
  showTimezone?: boolean;
}

/**
 * Beautiful analog clock component with time control integration
 */
export function AnalogClock({
  format = '12',
  showSeconds = true,
  showDate = true,
  className = '',
  size = 'medium',
  timePeriods = DEFAULT_TIME_PERIODS,
  showTimePeriods = true,
  enableMouseWheel = true,
  wheelStep = 15,
  wheelShiftStep = 1,
  showDigitalTime = true,
  style = {},
  showCurrentTime = true,
  faceColor = '#ffffff',
  handColors = {
    hour: '#333333',
    minute: '#333333',
    second: '#ff4444',
  },
  showTimezone = false,
}: AnalogClockProps) {
  const { currentTime, addMinutes, addHours, isActive } = useTimeControl();
  const clockRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  // Calculate clock size
  const clockSize = typeof size === 'number' ? size : {
    small: 120,
    medium: 180,
    large: 240,
  }[size];

  const center = clockSize / 2;
  const clockRadius = center - 20;
  const hourHandLength = clockRadius * 0.5;
  const minuteHandLength = clockRadius * 0.7;
  const secondHandLength = clockRadius * 0.8;

  // Get time components
  const hours = currentTime.getHours() % 12;
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  // Calculate angles (12 o'clock is 0 degrees)
  const hourAngle = (hours + minutes / 60) * 30 - 90; // 30 degrees per hour
  const minuteAngle = minutes * 6 - 90; // 6 degrees per minute
  const secondAngle = seconds * 6 - 90; // 6 degrees per second

  // Convert polar to cartesian coordinates
  const polarToCartesian = (angle: number, radius: number) => ({
    x: center + radius * Math.cos((angle * Math.PI) / 180),
    y: center + radius * Math.sin((angle * Math.PI) / 180),
  });

  const hourHand = polarToCartesian(hourAngle, hourHandLength);
  const minuteHand = polarToCartesian(minuteAngle, minuteHandLength);
  const secondHand = polarToCartesian(secondAngle, secondHandLength);

  // Mouse wheel handler
  const handleWheel = useCallback((event: WheelEvent) => {
    if (!enableMouseWheel || !isActive) return;

    event.preventDefault();
    const delta = event.deltaY > 0 ? -1 : 1;

    if (event.shiftKey) {
      addHours(delta * wheelShiftStep);
    } else {
      addMinutes(delta * wheelStep);
    }
  }, [enableMouseWheel, isActive, addMinutes, addHours, wheelStep, wheelShiftStep]);

  // Attach wheel listener
  useEffect(() => {
    const element = clockRef.current;
    if (!element) return;

    element.addEventListener('wheel', handleWheel, { passive: false });
    return () => element.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Mouse drag to set time
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (!isActive) return;

    const rect = clockRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    setDragStart({
      x: event.clientX - rect.left - center,
      y: event.clientY - rect.top - center,
    });
  }, [isActive, center]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !isActive) return;

    const rect = clockRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left - center;
    const y = event.clientY - rect.top - center;
    
    // Calculate angle from center
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    // Convert to minutes (360 degrees = 60 minutes)
    const targetMinutes = Math.round((angle / 360) * 60) % 60;
    const currentMinutes = currentTime.getMinutes();
    
    if (Math.abs(targetMinutes - currentMinutes) > 2) {
      const newTime = new Date(currentTime);
      newTime.setMinutes(targetMinutes);
      addMinutes(targetMinutes - currentMinutes);
    }
  }, [isDragging, isActive, center, currentTime, addMinutes]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Quick time period buttons
  const handleTimePeriodClick = (period: TimePeriod, direction: 'forward' | 'backward') => {
    const multiplier = direction === 'forward' ? 1 : -1;
    addMinutes((period.value / (60 * 1000)) * multiplier);
  };

  // Format digital time display
  const formatDigitalTime = () => {
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: format === '12',
    };

    if (showSeconds) {
      timeOptions.second = '2-digit';
    }

    let timeString = currentTime.toLocaleTimeString(undefined, timeOptions);
    
    if (showTimezone) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      timeString += ` ${timezone}`;
    }

    return timeString;
  };

  return (
    <div 
      className={`time-travel-analog-clock ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Digital time display */}
      {showDigitalTime && (
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          color: isActive ? '#333' : '#999',
          textAlign: 'center',
        }}>
          {formatDigitalTime()}
          {showDate && (
            <div style={{
              fontSize: '14px',
              fontWeight: 'normal',
              color: '#666',
              marginTop: '4px',
            }}>
              {currentTime.toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      {/* Analog clock */}
      <svg
        ref={clockRef}
        width={clockSize}
        height={clockSize}
        style={{
          cursor: isActive ? (enableMouseWheel ? 'grab' : 'default') : 'not-allowed',
          opacity: isActive ? 1 : 0.7,
          transition: 'opacity 0.2s ease',
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Clock face */}
        <circle
          cx={center}
          cy={center}
          r={clockRadius}
          fill={faceColor}
          stroke="#ddd"
          strokeWidth="2"
        />

        {/* Hour markers */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = i * 30;
          const outerRadius = clockRadius - 5;
          const innerRadius = clockRadius - (i % 3 === 0 ? 20 : 15);
          
          const outer = polarToCartesian(angle - 90, outerRadius);
          const inner = polarToCartesian(angle - 90, innerRadius);
          
          return (
            <g key={i}>
              <line
                x1={outer.x}
                y1={outer.y}
                x2={inner.x}
                y2={inner.y}
                stroke="#333"
                strokeWidth={i % 3 === 0 ? "3" : "1"}
              />
              {i % 3 === 0 && (
                <text
                  x={polarToCartesian(angle - 90, innerRadius - 15).x}
                  y={polarToCartesian(angle - 90, innerRadius - 15).y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#333"
                >
                  {i === 0 ? 12 : i}
                </text>
              )}
            </g>
          );
        })}

        {/* Hour hand */}
        <line
          x1={center}
          y1={center}
          x2={hourHand.x}
          y2={hourHand.y}
          stroke={handColors.hour}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <line
          x1={center}
          y1={center}
          x2={minuteHand.x}
          y2={minuteHand.y}
          stroke={handColors.minute}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Second hand */}
        {showSeconds && (
          <line
            x1={center}
            y1={center}
            x2={secondHand.x}
            y2={secondHand.y}
            stroke={handColors.second}
            strokeWidth="1"
            strokeLinecap="round"
          />
        )}

        {/* Center dot */}
        <circle
          cx={center}
          cy={center}
          r="4"
          fill="#333"
        />

        {/* Current time indicator (shows real time as a thin line) */}
        {showCurrentTime && (
          (() => {
            const realTime = new Date();
            const realMinutes = realTime.getMinutes();
            const realAngle = realMinutes * 6 - 90;
            const realHand = polarToCartesian(realAngle, clockRadius - 10);
            
            return (
              <line
                x1={center}
                y1={center}
                x2={realHand.x}
                y2={realHand.y}
                stroke="#ff9800"
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.7"
              />
            );
          })()
        )}
      </svg>

      {/* Time period controls */}
      {showTimePeriods && isActive && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          maxWidth: clockSize,
        }}>
          {timePeriods.slice(0, 6).map((period) => (
            <div key={period.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <button
                onClick={() => handleTimePeriodClick(period, 'backward')}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  border: '1px solid #ddd',
                  background: '#f9f9f9',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  minWidth: '24px',
                }}
                title={`Subtract ${period.label}`}
              >
                -
              </button>
              <span style={{
                fontSize: '11px',
                color: '#666',
                textAlign: 'center',
                minWidth: '40px',
              }}>
                {period.shortcut || formatTimePeriod(period.value)}
              </span>
              <button
                onClick={() => handleTimePeriodClick(period, 'forward')}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  border: '1px solid #ddd',
                  background: '#f9f9f9',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  minWidth: '24px',
                }}
                title={`Add ${period.label}`}
              >
                +
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Inactive state message */}
      {!isActive && (
        <div style={{
          fontSize: '12px',
          color: '#999',
          fontStyle: 'italic',
          textAlign: 'center',
        }}>
          Time control disabled
        </div>
      )}
    </div>
  );
}
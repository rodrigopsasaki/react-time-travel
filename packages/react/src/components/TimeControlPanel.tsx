import React, { useState, useRef, useEffect } from 'react';
import { TimePeriod, DEFAULT_TIME_PERIODS, formatDisplayDate, getKeyboardShortcuts, formatTimePeriod } from '@time-travel/core';
import { useTimeControl, useKeyboardTimeControl } from '../useTimeControl.js';

export interface TimeControlPanelProps {
  /** Custom time periods for quick actions */
  timePeriods?: TimePeriod[];
  /** Whether to show the analog clock */
  showClock?: boolean;
  /** Whether to enable keyboard shortcuts */
  enableKeyboard?: boolean;
  /** Whether to show help text */
  showHelp?: boolean;
  /** Panel theme */
  theme?: 'light' | 'dark' | 'auto';
  /** Panel position */
  position?: 'fixed' | 'relative';
  /** Custom CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Whether panel is collapsible */
  collapsible?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
  /** Show real-time indicator */
  showRealTime?: boolean;
}

/**
 * Comprehensive time control panel with all time manipulation features
 */
export function TimeControlPanel({
  timePeriods = DEFAULT_TIME_PERIODS,
  showClock = true,
  enableKeyboard = true,
  showHelp = true,
  theme = 'auto',
  position = 'fixed',
  className = '',
  style = {},
  collapsible = true,
  defaultCollapsed = false,
  showRealTime = true,
}: TimeControlPanelProps) {
  const {
    currentTime,
    isActive,
    setTime,
    addMinutes,
    addHours,
    addDays,
    resetToRealTime,
    enable,
    disable,
    toggle,
  } = useTimeControl();

  useKeyboardTimeControl({ enabled: enableKeyboard });

  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [timeInput, setTimeInput] = useState('');
  const [realTime, setRealTime] = useState(new Date());
  const timeInputRef = useRef<HTMLInputElement>(null);

  // Update real time display
  useEffect(() => {
    if (!showRealTime) return;

    const interval = setInterval(() => {
      setRealTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [showRealTime]);

  // Auto-detect theme
  const effectiveTheme = theme === 'auto' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  const isDark = effectiveTheme === 'dark';

  const panelStyles: React.CSSProperties = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: isDark ? '#1a1a1a' : '#ffffff',
    color: isDark ? '#ffffff' : '#333333',
    border: `1px solid ${isDark ? '#333' : '#ddd'}`,
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    padding: isCollapsed ? '12px' : '16px',
    width: isCollapsed ? 'auto' : '320px',
    maxHeight: '90vh',
    overflow: 'auto',
    zIndex: 9999,
    transition: 'all 0.3s ease',
    ...style,
  };

  if (position === 'fixed') {
    Object.assign(panelStyles, {
      position: 'fixed',
      top: '20px',
      right: '20px',
    });
  }

  const buttonStyle = (active = false): React.CSSProperties => ({
    padding: '8px 12px',
    margin: '2px',
    border: `1px solid ${isDark ? '#444' : '#ddd'}`,
    borderRadius: '4px',
    background: active 
      ? (isDark ? '#0066cc' : '#007bff')
      : (isDark ? '#333' : '#f8f9fa'),
    color: active 
      ? '#ffffff'
      : (isDark ? '#ffffff' : '#333333'),
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.2s ease',
    minWidth: '24px',
  });

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px',
    border: `1px solid ${isDark ? '#444' : '#ddd'}`,
    borderRadius: '4px',
    background: isDark ? '#2a2a2a' : '#ffffff',
    color: isDark ? '#ffffff' : '#333333',
    fontSize: '12px',
    fontFamily: 'monospace',
  };

  const handleTimeInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timeInput.trim()) {
      try {
        const newTime = new Date(timeInput);
        if (!isNaN(newTime.getTime())) {
          setTime(newTime);
          setTimeInput('');
        } else {
          alert('Invalid time format');
        }
      } catch (error) {
        alert('Invalid time format');
      }
    }
  };

  const handleTimeInputFocus = () => {
    if (!timeInput) {
      setTimeInput(currentTime.toISOString().slice(0, 16));
    }
  };

  const QuickTimeButton = ({ period, direction }: { period: TimePeriod; direction: 'add' | 'subtract' }) => (
    <button
      onClick={() => {
        const multiplier = direction === 'add' ? 1 : -1;
        addMinutes((period.value / (60 * 1000)) * multiplier);
      }}
      style={buttonStyle()}
      title={`${direction === 'add' ? 'Add' : 'Subtract'} ${period.label}`}
    >
      {direction === 'add' ? '+' : '-'}{period.shortcut || formatTimePeriod(period.value)}
    </button>
  );

  if (isCollapsed) {
    return (
      <div className={`time-travel-panel collapsed ${className}`} style={panelStyles}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsCollapsed(false)}
            style={buttonStyle()}
            title="Expand time control panel"
          >
            🕐
          </button>
          <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>
            {formatDisplayDate(currentTime, { showSeconds: false })}
          </span>
          <button
            onClick={toggle}
            style={buttonStyle(isActive)}
            title={isActive ? 'Disable time control' : 'Enable time control'}
          >
            {isActive ? '⏸️' : '▶️'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`time-travel-panel expanded ${className}`} style={panelStyles}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        borderBottom: `1px solid ${isDark ? '#333' : '#eee'}`,
        paddingBottom: '8px',
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
          Time Travel
        </h3>
        <div style={{ display: 'flex', gap: '4px' }}>
          {showHelp && (
            <button
              onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
              style={buttonStyle(showKeyboardHelp)}
              title="Show keyboard shortcuts"
            >
              ?
            </button>
          )}
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(true)}
              style={buttonStyle()}
              title="Collapse panel"
            >
              −
            </button>
          )}
        </div>
      </div>

      {/* Status indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
        padding: '8px',
        background: isDark ? '#2a2a2a' : '#f8f9fa',
        borderRadius: '4px',
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: isActive ? '#28a745' : '#dc3545',
        }} />
        <span style={{ fontSize: '12px', fontWeight: '500' }}>
          {isActive ? 'Time Control Active' : 'Time Control Disabled'}
        </span>
        <button
          onClick={toggle}
          style={buttonStyle(isActive)}
        >
          {isActive ? 'Disable' : 'Enable'}
        </button>
      </div>

      {/* Current time display */}
      <div style={{
        textAlign: 'center',
        marginBottom: '16px',
        padding: '12px',
        background: isDark ? '#2a2a2a' : '#f8f9fa',
        borderRadius: '4px',
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          color: isActive ? (isDark ? '#ffffff' : '#333333') : '#999999',
        }}>
          {formatDisplayDate(currentTime)}
        </div>
        {showRealTime && (
          <div style={{
            fontSize: '12px',
            color: '#666',
            marginTop: '4px',
          }}>
            Real time: {formatDisplayDate(realTime, { showSeconds: false })}
          </div>
        )}
      </div>

      {/* Time input */}
      <form onSubmit={handleTimeInputSubmit} style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '500',
          marginBottom: '4px',
        }}>
          Set specific time:
        </label>
        <div style={{ display: 'flex', gap: '4px' }}>
          <input
            ref={timeInputRef}
            type="datetime-local"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            onFocus={handleTimeInputFocus}
            style={inputStyle}
            disabled={!isActive}
          />
          <button
            type="submit"
            style={buttonStyle()}
            disabled={!isActive || !timeInput}
          >
            Set
          </button>
        </div>
      </form>

      {/* Quick time adjustments */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '500',
          marginBottom: '8px',
        }}>
          Quick adjustments:
        </label>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4px',
          marginBottom: '8px',
        }}>
          {timePeriods.slice(0, 8).map((period) => (
            <div key={period.label} style={{ display: 'flex', gap: '2px' }}>
              <QuickTimeButton period={period} direction="subtract" />
              <QuickTimeButton period={period} direction="add" />
            </div>
          ))}
        </div>
      </div>

      {/* Reset button */}
      <button
        onClick={resetToRealTime}
        style={{
          ...buttonStyle(),
          width: '100%',
          marginBottom: '16px',
          background: isDark ? '#dc3545' : '#dc3545',
          color: '#ffffff',
          border: '1px solid #dc3545',
        }}
        disabled={!isActive}
      >
        Reset to Real Time
      </button>

      {/* Keyboard shortcuts help */}
      {showKeyboardHelp && (
        <div style={{
          fontSize: '11px',
          background: isDark ? '#2a2a2a' : '#f8f9fa',
          padding: '8px',
          borderRadius: '4px',
          marginBottom: '16px',
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
            Keyboard Shortcuts:
          </div>
          {Object.entries(getKeyboardShortcuts()).map(([key, description]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <code style={{ background: isDark ? '#333' : '#e9ecef', padding: '1px 4px', borderRadius: '2px' }}>
                {key}
              </code>
              <span>{description}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer info */}
      <div style={{
        fontSize: '10px',
        color: '#666',
        textAlign: 'center',
        marginTop: '8px',
        paddingTop: '8px',
        borderTop: `1px solid ${isDark ? '#333' : '#eee'}`,
      }}>
        react-time-travel v1.0.0
      </div>
    </div>
  );
}
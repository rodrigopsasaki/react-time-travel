import React, { useState, useEffect } from 'react';
import { useTimeControl } from '../useTimeControl.js';
import { AnalogClock } from './AnalogClock.js';
import { TimeControlPanel } from './TimeControlPanel.js';

export interface TimeControlOverlayProps {
  /** Show the overlay only in development/test environments */
  autoHide?: boolean;
  /** Default visibility state */
  defaultVisible?: boolean;
  /** Show analog clock in overlay */
  showClock?: boolean;
  /** Position of the overlay */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Theme for the overlay */
  theme?: 'light' | 'dark' | 'auto';
  /** Enable keyboard shortcuts globally */
  enableKeyboard?: boolean;
  /** Custom toggle key combination */
  toggleKey?: string;
  /** Whether to show a floating action button when collapsed */
  showFAB?: boolean;
}

/**
 * Full-featured time control overlay that can be dropped into any React app
 */
export function TimeControlOverlay({
  autoHide = true,
  defaultVisible = false,
  showClock = false,
  position = 'top-right',
  theme = 'auto',
  enableKeyboard = true,
  toggleKey = 'KeyT',
  showFAB = true,
}: TimeControlOverlayProps) {
  const { isActive } = useTimeControl();
  const [isVisible, setIsVisible] = useState(defaultVisible);
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-hide in production if requested
  useEffect(() => {
    if (autoHide && process.env.NODE_ENV === 'production') {
      setIsVisible(false);
    }
  }, [autoHide]);

  // Global keyboard shortcut to toggle overlay
  useEffect(() => {
    if (!enableKeyboard) return;

    function handleKeyDown(event: KeyboardEvent) {
      // Check for Ctrl+Shift+T (or Cmd+Shift+T on Mac)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === toggleKey) {
        event.preventDefault();
        setIsVisible(prev => !prev);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboard, toggleKey]);

  // Don't render if auto-hidden
  if (autoHide && process.env.NODE_ENV === 'production') {
    return null;
  }

  const getPositionStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'fixed',
      zIndex: 10000,
    };

    switch (position) {
      case 'top-right':
        return { ...base, top: '20px', right: '20px' };
      case 'top-left':
        return { ...base, top: '20px', left: '20px' };
      case 'bottom-right':
        return { ...base, bottom: '20px', right: '20px' };
      case 'bottom-left':
        return { ...base, bottom: '20px', left: '20px' };
      default:
        return { ...base, top: '20px', right: '20px' };
    }
  };

  // Floating Action Button for quick access
  const FloatingActionButton = () => (
    <button
      onClick={() => setIsVisible(true)}
      style={{
        ...getPositionStyles(),
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        border: 'none',
        background: isActive ? '#007bff' : '#6c757d',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      title={`Time Control ${isActive ? 'Active' : 'Inactive'} - Click to open panel`}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      🕐
    </button>
  );

  // Show FAB when overlay is hidden
  if (!isVisible && showFAB) {
    return <FloatingActionButton />;
  }

  // Don't render anything if not visible and FAB is disabled
  if (!isVisible) {
    return null;
  }

  return (
    <div
      style={{
        ...getPositionStyles(),
        display: 'flex',
        flexDirection: showClock && !isMinimized ? 'column' : 'row',
        gap: '12px',
        alignItems: 'flex-start',
      }}
    >
      {/* Analog Clock */}
      {showClock && !isMinimized && (
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}>
          <AnalogClock
            size="small"
            showTimePeriods={false}
            showDigitalTime={false}
          />
        </div>
      )}

      {/* Control Panel */}
      <TimeControlPanel
        position="relative"
        theme={theme}
        enableKeyboard={enableKeyboard}
        collapsible={true}
        defaultCollapsed={isMinimized}
        style={{
          position: 'relative',
          top: 0,
          right: 0,
        }}
      />

      {/* Minimize/Close buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            background: '#f8f9fa',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={isMinimized ? 'Maximize' : 'Minimize'}
        >
          {isMinimized ? '□' : '−'}
        </button>
        
        <button
          onClick={() => setIsVisible(false)}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            background: '#f8f9fa',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Close overlay"
        >
          ×
        </button>
      </div>
    </div>
  );
}

/**
 * Simple hook to control overlay visibility from anywhere in the app
 */
export function useTimeControlOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);
  const toggle = () => setIsVisible(prev => !prev);

  return {
    isVisible,
    show,
    hide,
    toggle,
    TimeControlOverlay: (props: Omit<TimeControlOverlayProps, 'defaultVisible'>) => (
      <TimeControlOverlay {...props} defaultVisible={isVisible} />
    ),
  };
}
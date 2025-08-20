import React, { useState } from 'react';
import { AnalogClock, TimeControlPanel, useTimeControl } from '@time-travel/react';

export function InteractiveDemo() {
  const [showPanel, setShowPanel] = useState(true);
  const [showClock, setShowClock] = useState(true);
  const { currentTime, isActive, addMinutes, addHours, addDays, resetToRealTime } = useTimeControl();

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    marginBottom: '24px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  };

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>
          Interactive Time Control Demo
        </h2>
        <p style={{ margin: '0 0 24px 0', opacity: 0.9, lineHeight: '1.6' }}>
          This demo showcases the core functionality of React Time Travel. 
          Use the controls below or the floating panel to manipulate time in real-time.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}>
          <button
            style={buttonStyle}
            onClick={() => addMinutes(15)}
            disabled={!isActive}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            +15 Minutes
          </button>
          
          <button
            style={buttonStyle}
            onClick={() => addHours(1)}
            disabled={!isActive}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            +1 Hour
          </button>
          
          <button
            style={buttonStyle}
            onClick={() => addDays(1)}
            disabled={!isActive}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            +1 Day
          </button>
          
          <button
            style={{
              ...buttonStyle,
              background: 'rgba(255, 107, 107, 0.3)',
              borderColor: 'rgba(255, 107, 107, 0.5)',
            }}
            onClick={resetToRealTime}
            disabled={!isActive}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 107, 107, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 107, 107, 0.3)';
            }}
          >
            Reset to Real Time
          </button>
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showPanel}
              onChange={(e) => setShowPanel(e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            Show Control Panel
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showClock}
              onChange={(e) => setShowClock(e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            Show Analog Clock
          </label>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: showPanel && showClock ? '1fr 1fr' : '1fr',
        gap: '24px',
        alignItems: 'start',
      }}>
        {showClock && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
              Analog Clock
            </h3>
            <p style={{ margin: '0 0 20px 0', opacity: 0.8, fontSize: '14px' }}>
              Interactive clock with mouse wheel support and quick time adjustments.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <AnalogClock
                size="large"
                showTimePeriods={true}
                enableMouseWheel={true}
                showDigitalTime={true}
                faceColor="rgba(255, 255, 255, 0.9)"
                handColors={{
                  hour: '#333333',
                  minute: '#333333',
                  second: '#ff4444',
                }}
              />
            </div>
          </div>
        )}

        {showPanel && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
              Control Panel
            </h3>
            <p style={{ margin: '0 0 20px 0', opacity: 0.8, fontSize: '14px' }}>
              Comprehensive time control with keyboard shortcuts and precise time setting.
            </p>
            <TimeControlPanel
              position="relative"
              theme="dark"
              collapsible={false}
              showHelp={true}
              style={{
                position: 'relative',
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            />
          </div>
        )}
      </div>

      {/* Current time display */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
          Current Controlled Time
        </h3>
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          fontFamily: 'monospace',
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            {currentTime.toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>
            ISO: {currentTime.toISOString()}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>
            Timestamp: {currentTime.getTime()}
          </div>
        </div>
      </div>
    </div>
  );
}
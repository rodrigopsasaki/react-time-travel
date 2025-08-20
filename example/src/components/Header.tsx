import React from 'react';
import { useCurrentTime, useTimeControlActive } from '@time-travel/react';

export function Header() {
  const currentTime = useCurrentTime();
  const isActive = useTimeControlActive();

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      padding: '20px 20px 30px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        <div>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '42px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            React Time Travel
          </h1>
          <p style={{
            margin: 0,
            fontSize: '18px',
            opacity: 0.9,
            fontWeight: '400',
          }}>
            Control time in your React applications for testing and development
          </p>
        </div>

        <div style={{
          textAlign: 'right',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '12px 20px',
            borderRadius: '8px',
            backdropFilter: 'blur(5px)',
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isActive ? '#00ff88' : '#ff6b6b',
              boxShadow: isActive 
                ? '0 0 10px rgba(0, 255, 136, 0.5)' 
                : '0 0 10px rgba(255, 107, 107, 0.5)',
            }} />
            <div>
              <div style={{
                fontSize: '24px',
                fontWeight: '600',
                fontFamily: 'monospace',
                letterSpacing: '0.5px',
              }}>
                {currentTime.toLocaleTimeString()}
              </div>
              <div style={{
                fontSize: '14px',
                opacity: 0.8,
              }}>
                {isActive ? 'Time Control Active' : 'Real Time'}
              </div>
            </div>
          </div>
          
          <div style={{
            fontSize: '12px',
            opacity: 0.7,
            fontStyle: 'italic',
          }}>
            Press Ctrl+Shift+T to toggle time control
          </div>
        </div>
      </div>
    </header>
  );
}
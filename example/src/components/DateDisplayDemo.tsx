import React, { useState, useEffect } from 'react';
import { useCurrentTime } from '@time-travel/react';

export function DateDisplayDemo() {
  const currentTime = useCurrentTime();
  const [intervals, setIntervals] = useState<{ [key: string]: Date }>({});

  // Set up intervals to show how Date objects update in real-time
  useEffect(() => {
    const updateIntervals = () => {
      setIntervals({
        'new Date()': new Date(),
        'Date.now()': new Date(Date.now()),
        'setTimeout Date': new Date(), // This will be updated by setTimeout
      });
    };

    // Update immediately
    updateIntervals();

    // Set up interval
    const interval = setInterval(updateIntervals, 1000);
    
    // Set up setTimeout demo
    const timeout = setTimeout(() => {
      setIntervals(prev => ({
        ...prev,
        'setTimeout callback': new Date(),
      }));
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [currentTime]); // Re-run when controlled time changes

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    marginBottom: '24px',
  };

  const codeStyle: React.CSSProperties = {
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '16px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '14px',
    marginBottom: '16px',
    overflow: 'auto',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px',
  };

  const cellStyle: React.CSSProperties = {
    padding: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    textAlign: 'left',
    fontFamily: 'monospace',
  };

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>
          Date Object Behavior
        </h2>
        <p style={{ margin: '0 0 24px 0', opacity: 0.9, lineHeight: '1.6' }}>
          This demo shows how React Time Travel hijacks JavaScript's native Date constructor 
          and Date.now() method. All new Date() calls will return the controlled time instead 
          of the system time.
        </p>

        <div style={codeStyle}>
          <div style={{ color: '#ff6b9d', marginBottom: '8px' }}>// These all return controlled time when time travel is active</div>
          <div style={{ color: '#c7f59b' }}>const now = new Date();</div>
          <div style={{ color: '#c7f59b' }}>const timestamp = Date.now();</div>
          <div style={{ color: '#c7f59b' }}>const inCallback = setTimeout(() => new Date(), 1000);</div>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...cellStyle, fontWeight: 'bold', background: 'rgba(255, 255, 255, 0.1)' }}>
                Method
              </th>
              <th style={{ ...cellStyle, fontWeight: 'bold', background: 'rgba(255, 255, 255, 0.1)' }}>
                Result
              </th>
              <th style={{ ...cellStyle, fontWeight: 'bold', background: 'rgba(255, 255, 255, 0.1)' }}>
                Type
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(intervals).map(([method, date]) => (
              <tr key={method}>
                <td style={cellStyle}>{method}</td>
                <td style={cellStyle}>{date?.toLocaleString() || 'Pending...'}</td>
                <td style={cellStyle}>{typeof date === 'object' ? 'Date Object' : typeof date}</td>
              </tr>
            ))}
            <tr>
              <td style={cellStyle}>currentTime.getTime()</td>
              <td style={cellStyle}>{currentTime.getTime()}</td>
              <td style={cellStyle}>number</td>
            </tr>
            <tr>
              <td style={cellStyle}>useCurrentTime()</td>
              <td style={cellStyle}>{currentTime.toLocaleString()}</td>
              <td style={cellStyle}>Date Object</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
          Live Date Updates
        </h3>
        <p style={{ margin: '0 0 16px 0', opacity: 0.8, fontSize: '14px' }}>
          These date displays update every second to show the controlled time in action:
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
        }}>
          <DateCard
            title="ISO String"
            value={currentTime.toISOString()}
            description="Standard ISO 8601 format"
          />
          <DateCard
            title="Locale String"
            value={currentTime.toLocaleString()}
            description="Localized date and time"
          />
          <DateCard
            title="UTC String"
            value={currentTime.toUTCString()}
            description="UTC formatted string"
          />
          <DateCard
            title="Unix Timestamp"
            value={currentTime.getTime().toString()}
            description="Milliseconds since epoch"
          />
          <DateCard
            title="Time Only"
            value={currentTime.toLocaleTimeString()}
            description="Time portion only"
          />
          <DateCard
            title="Date Only"
            value={currentTime.toLocaleDateString()}
            description="Date portion only"
          />
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
          Time Comparison
        </h3>
        <p style={{ margin: '0 0 16px 0', opacity: 0.8, fontSize: '14px' }}>
          Compare controlled time with actual system time:
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}>
          <div style={{
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '8px',
            padding: '16px',
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#00ff88' }}>Controlled Time</h4>
            <div style={{ fontFamily: 'monospace', fontSize: '16px' }}>
              {currentTime.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
              From React Time Travel
            </div>
          </div>

          <SystemTimeCard />
        </div>
      </div>
    </div>
  );
}

function DateCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.3)',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
        {title}
      </h4>
      <div style={{
        fontFamily: 'monospace',
        fontSize: '12px',
        wordBreak: 'break-all',
        marginBottom: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '8px',
        borderRadius: '4px',
      }}>
        {value}
      </div>
      <div style={{ fontSize: '11px', opacity: 0.7 }}>
        {description}
      </div>
    </div>
  );
}

function SystemTimeCard() {
  const [systemTime, setSystemTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // Force system time by accessing the original Date constructor
      const originalDate = (window as any).Date?.original || Date;
      setSystemTime(new originalDate());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: 'rgba(255, 107, 107, 0.1)',
      border: '1px solid rgba(255, 107, 107, 0.3)',
      borderRadius: '8px',
      padding: '16px',
    }}>
      <h4 style={{ margin: '0 0 8px 0', color: '#ff6b6b' }}>System Time</h4>
      <div style={{ fontFamily: 'monospace', fontSize: '16px' }}>
        {systemTime.toLocaleString()}
      </div>
      <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
        Actual system time
      </div>
    </div>
  );
}
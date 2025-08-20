import React, { useState, useEffect } from 'react';
import { useCurrentTime } from '@time-travel/react';
import moment from 'moment';
import dayjs from 'dayjs';

export function LibraryIntegrationDemo() {
  const currentTime = useCurrentTime();
  const [libraryTimes, setLibraryTimes] = useState<{
    moment?: string;
    dayjs?: string;
    dateTimestamp?: number;
  }>({});

  useEffect(() => {
    const updateLibraryTimes = () => {
      const updates: typeof libraryTimes = {};
      
      // Test Moment.js integration
      try {
        updates.moment = moment().format('YYYY-MM-DD HH:mm:ss');
      } catch (error) {
        updates.moment = 'Moment.js not available';
      }
      
      // Test Day.js integration
      try {
        updates.dayjs = dayjs().format('YYYY-MM-DD HH:mm:ss');
      } catch (error) {
        updates.dayjs = 'Day.js not available';
      }
      
      // Test native Date
      updates.dateTimestamp = Date.now();
      
      setLibraryTimes(updates);
    };

    updateLibraryTimes();
    const interval = setInterval(updateLibraryTimes, 1000);
    
    return () => clearInterval(interval);
  }, [currentTime]);

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

  const resultStyle: React.CSSProperties = {
    background: 'rgba(0, 255, 136, 0.1)',
    border: '1px solid rgba(0, 255, 136, 0.3)',
    borderRadius: '8px',
    padding: '16px',
    fontFamily: 'monospace',
    fontSize: '16px',
    marginTop: '8px',
  };

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>
          Library Integration
        </h2>
        <p style={{ margin: '0 0 24px 0', opacity: 0.9, lineHeight: '1.6' }}>
          React Time Travel automatically hijacks popular date libraries like Moment.js and Day.js. 
          When time control is active, these libraries will use the controlled time instead of system time.
        </p>

        <div style={{
          background: 'rgba(255, 193, 7, 0.1)',
          border: '1px solid rgba(255, 193, 7, 0.3)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#ffc107' }}>
            🔧 How it works
          </h4>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
            The library automatically detects and hijacks moment().now(), dayjs(), and other 
            date library constructors when they're available in the global scope. No configuration needed!
          </p>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
          Moment.js Integration
        </h3>
        <p style={{ margin: '0 0 16px 0', opacity: 0.8, fontSize: '14px' }}>
          Moment.js calls will return controlled time when time travel is active:
        </p>

        <div style={codeStyle}>
          <div style={{ color: '#ff6b9d', marginBottom: '8px' }}>// Moment.js usage</div>
          <div style={{ color: '#c7f59b' }}>import moment from 'moment';</div>
          <div style={{ color: '#c7f59b', marginTop: '8px' }}>moment().format('YYYY-MM-DD HH:mm:ss')</div>
          <div style={{ color: '#c7f59b' }}>moment().add(1, 'hour').format()</div>
          <div style={{ color: '#c7f59b' }}>moment().startOf('day').format()</div>
        </div>

        <div style={resultStyle}>
          <div><strong>Current result:</strong> {libraryTimes.moment}</div>
          <div style={{ marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
            Add 1 hour: {libraryTimes.moment ? moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss') : 'N/A'}
          </div>
          <div style={{ marginTop: '4px', fontSize: '14px', opacity: 0.8 }}>
            Start of day: {libraryTimes.moment ? moment().startOf('day').format('YYYY-MM-DD HH:mm:ss') : 'N/A'}
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
          Day.js Integration
        </h3>
        <p style={{ margin: '0 0 16px 0', opacity: 0.8, fontSize: '14px' }}>
          Day.js calls will also return controlled time:
        </p>

        <div style={codeStyle}>
          <div style={{ color: '#ff6b9d', marginBottom: '8px' }}>// Day.js usage</div>
          <div style={{ color: '#c7f59b' }}>import dayjs from 'dayjs';</div>
          <div style={{ color: '#c7f59b', marginTop: '8px' }}>dayjs().format('YYYY-MM-DD HH:mm:ss')</div>
          <div style={{ color: '#c7f59b' }}>dayjs().add(1, 'hour').format()</div>
          <div style={{ color: '#c7f59b' }}>dayjs().startOf('day').format()</div>
        </div>

        <div style={resultStyle}>
          <div><strong>Current result:</strong> {libraryTimes.dayjs}</div>
          <div style={{ marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
            Add 1 hour: {libraryTimes.dayjs ? dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss') : 'N/A'}
          </div>
          <div style={{ marginTop: '4px', fontSize: '14px', opacity: 0.8 }}>
            Start of day: {libraryTimes.dayjs ? dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss') : 'N/A'}
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
          Native Date Integration
        </h3>
        <p style={{ margin: '0 0 16px 0', opacity: 0.8, fontSize: '14px' }}>
          All native JavaScript Date operations use controlled time:
        </p>

        <div style={codeStyle}>
          <div style={{ color: '#ff6b9d', marginBottom: '8px' }}>// Native Date usage</div>
          <div style={{ color: '#c7f59b' }}>new Date()</div>
          <div style={{ color: '#c7f59b' }}>Date.now()</div>
          <div style={{ color: '#c7f59b' }}>new Date().getTime()</div>
          <div style={{ color: '#c7f59b' }}>new Date().toISOString()</div>
        </div>

        <div style={resultStyle}>
          <div><strong>new Date():</strong> {new Date().toLocaleString()}</div>
          <div style={{ marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
            <strong>Date.now():</strong> {libraryTimes.dateTimestamp}
          </div>
          <div style={{ marginTop: '4px', fontSize: '14px', opacity: 0.8 }}>
            <strong>ISO String:</strong> {new Date().toISOString()}
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
          Real-World Example
        </h3>
        <p style={{ margin: '0 0 16px 0', opacity: 0.8, fontSize: '14px' }}>
          Here's how this might look in a real application component:
        </p>

        <div style={codeStyle}>
          <div style={{ color: '#ff6b9d', marginBottom: '8px' }}>// Real application code</div>
          <div style={{ color: '#c7f59b' }}>function UserProfile() {'{'}</div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}>const lastLogin = moment(user.lastLoginAt).fromNow();</div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}>const accountAge = dayjs().diff(user.createdAt, 'days');</div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}>const sessionExpiry = new Date(Date.now() + 30 * 60 * 1000);</div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}></div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}>return (...); // All dates use controlled time!</div>
          <div style={{ color: '#c7f59b' }}>{'}'}</div>
        </div>

        <LiveExample />
      </div>
    </div>
  );
}

function LiveExample() {
  const [userData] = useState({
    lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  });

  const [liveData, setLiveData] = useState({
    lastLogin: '',
    accountAge: 0,
    sessionExpiry: '',
  });

  useEffect(() => {
    const updateLiveData = () => {
      setLiveData({
        lastLogin: moment(userData.lastLoginAt).fromNow(),
        accountAge: dayjs().diff(userData.createdAt, 'days'),
        sessionExpiry: new Date(Date.now() + 30 * 60 * 1000).toLocaleTimeString(),
      });
    };

    updateLiveData();
    const interval = setInterval(updateLiveData, 1000);
    
    return () => clearInterval(interval);
  }, [userData.lastLoginAt, userData.createdAt]);

  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.3)',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginTop: '16px',
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Live Example Output</h4>
      <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
        <div>👤 <strong>Last Login:</strong> {liveData.lastLogin}</div>
        <div style={{ marginTop: '8px' }}>📅 <strong>Account Age:</strong> {liveData.accountAge} days</div>
        <div style={{ marginTop: '8px' }}>⏰ <strong>Session Expires:</strong> {liveData.sessionExpiry}</div>
      </div>
      <div style={{ 
        fontSize: '12px', 
        opacity: 0.7, 
        marginTop: '12px', 
        fontStyle: 'italic' 
      }}>
        ✨ All these values update in real-time as you manipulate the controlled time!
      </div>
    </div>
  );
}
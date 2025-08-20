import React, { useState } from 'react';
import { useTimeControl } from '@time-travel/react';

export function UseCaseExamples() {
  const { setTime, addHours, addDays, resetToRealTime, currentTime } = useTimeControl();
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    marginBottom: '24px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    marginRight: '8px',
    marginBottom: '8px',
  };

  const useCases = [
    {
      id: 'testing-timers',
      title: '⏱️ Testing Timers & Intervals',
      description: 'Test setTimeout, setInterval, and time-based logic without waiting',
      scenario: 'Testing a 5-minute session timeout',
      actions: [
        { label: 'Start Session', action: () => setActiveDemo('session-started') },
        { label: '+4 minutes', action: () => addHours(4/60) },
        { label: '+1 minute (trigger timeout)', action: () => addHours(1/60) },
        { label: 'Reset', action: () => { resetToRealTime(); setActiveDemo(null); } },
      ],
    },
    {
      id: 'business-hours',
      title: '🏢 Business Hours Testing',
      description: 'Test business logic that depends on time of day',
      scenario: 'Testing after-hours access restrictions',
      actions: [
        { label: 'Set to 9 AM', action: () => setTimeToHour(9) },
        { label: 'Set to 6 PM', action: () => setTimeToHour(18) },
        { label: 'Set to 11 PM', action: () => setTimeToHour(23) },
        { label: 'Set to 3 AM', action: () => setTimeToHour(3) },
      ],
    },
    {
      id: 'date-boundaries',
      title: '📅 Date Boundary Testing',
      description: 'Test month-end, year-end, and leap year scenarios',
      scenario: 'Testing monthly billing cycles',
      actions: [
        { label: 'End of Month', action: () => setToEndOfMonth() },
        { label: 'Start of Month', action: () => setToStartOfMonth() },
        { label: 'End of Year', action: () => setToEndOfYear() },
        { label: 'Leap Year Feb 29', action: () => setToLeapYear() },
      ],
    },
    {
      id: 'time-zones',
      title: '🌍 Timezone Testing',
      description: 'Test timezone-dependent functionality',
      scenario: 'Testing global application behavior',
      actions: [
        { label: 'UTC Midnight', action: () => setToUTCMidnight() },
        { label: 'EST Business Hours', action: () => setToEST() },
        { label: 'PST Business Hours', action: () => setToPST() },
        { label: 'Tokyo Business Hours', action: () => setToTokyo() },
      ],
    },
    {
      id: 'subscription-lifecycle',
      title: '💳 Subscription Lifecycle',
      description: 'Test subscription expiration and renewal scenarios',
      scenario: 'Testing subscription state changes',
      actions: [
        { label: 'Trial Start', action: () => setActiveDemo('trial-start') },
        { label: 'Trial Ending (1 day left)', action: () => addDays(6) },
        { label: 'Trial Expired', action: () => addDays(1) },
        { label: 'Renewal Due', action: () => addDays(29) },
      ],
    },
    {
      id: 'cache-expiration',
      title: '🗄️ Cache Expiration',
      description: 'Test time-based cache invalidation',
      scenario: 'Testing API cache with 1-hour TTL',
      actions: [
        { label: 'Cache Data', action: () => setActiveDemo('cache-fresh') },
        { label: '+30 minutes', action: () => addHours(0.5) },
        { label: '+30 minutes (expire)', action: () => addHours(0.5) },
        { label: '+1 hour (stale)', action: () => addHours(1) },
      ],
    },
  ];

  function setTimeToHour(hour: number) {
    const newTime = new Date(currentTime);
    newTime.setHours(hour, 0, 0, 0);
    setTime(newTime);
    setActiveDemo(`hour-${hour}`);
  }

  function setToEndOfMonth() {
    const newTime = new Date(currentTime);
    newTime.setMonth(newTime.getMonth() + 1, 0);
    newTime.setHours(23, 59, 59, 999);
    setTime(newTime);
    setActiveDemo('end-of-month');
  }

  function setToStartOfMonth() {
    const newTime = new Date(currentTime);
    newTime.setDate(1);
    newTime.setHours(0, 0, 0, 0);
    setTime(newTime);
    setActiveDemo('start-of-month');
  }

  function setToEndOfYear() {
    const newTime = new Date(currentTime);
    newTime.setMonth(11, 31);
    newTime.setHours(23, 59, 59, 999);
    setTime(newTime);
    setActiveDemo('end-of-year');
  }

  function setToLeapYear() {
    const newTime = new Date(2024, 1, 29); // Feb 29, 2024
    setTime(newTime);
    setActiveDemo('leap-year');
  }

  function setToUTCMidnight() {
    const newTime = new Date();
    newTime.setUTCHours(0, 0, 0, 0);
    setTime(newTime);
    setActiveDemo('utc-midnight');
  }

  function setToEST() {
    const newTime = new Date();
    newTime.setHours(9, 0, 0, 0); // 9 AM EST
    setTime(newTime);
    setActiveDemo('est-business');
  }

  function setToPST() {
    const newTime = new Date();
    newTime.setHours(6, 0, 0, 0); // 6 AM PST (9 AM EST)
    setTime(newTime);
    setActiveDemo('pst-business');
  }

  function setToTokyo() {
    const newTime = new Date();
    newTime.setHours(22, 0, 0, 0); // 10 PM local (9 AM Tokyo next day)
    setTime(newTime);
    setActiveDemo('tokyo-business');
  }

  const getBusinessHoursStatus = () => {
    const hour = currentTime.getHours();
    if (hour >= 9 && hour < 17) {
      return { status: 'open', color: '#00ff88', message: 'Business hours - Access granted' };
    } else if (hour >= 17 && hour < 22) {
      return { status: 'after', color: '#ffc107', message: 'After hours - Limited access' };
    } else {
      return { status: 'closed', color: '#ff6b6b', message: 'Closed - Access denied' };
    }
  };

  const getSubscriptionStatus = () => {
    // Simulate subscription logic
    if (activeDemo === 'trial-start') {
      return { status: 'trial', color: '#00ff88', message: '7-day trial active' };
    } else if (activeDemo?.includes('trial')) {
      return { status: 'trial-ending', color: '#ffc107', message: 'Trial ending soon' };
    } else {
      return { status: 'expired', color: '#ff6b6b', message: 'Trial expired - Upgrade required' };
    }
  };

  const getCacheStatus = () => {
    if (activeDemo === 'cache-fresh') {
      return { status: 'fresh', color: '#00ff88', message: 'Cache fresh - Serving cached data' };
    } else if (activeDemo?.includes('cache')) {
      return { status: 'stale', color: '#ff6b6b', message: 'Cache expired - Fetching new data' };
    } else {
      return { status: 'none', color: '#666', message: 'No cache demo active' };
    }
  };

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>
          Real-World Use Cases
        </h2>
        <p style={{ margin: '0 0 24px 0', opacity: 0.9, lineHeight: '1.6' }}>
          React Time Travel is perfect for testing time-dependent features without waiting. 
          Here are common scenarios where it saves significant development and testing time.
        </p>

        {/* Current Status Display */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          <StatusCard
            title="Business Hours"
            {...getBusinessHoursStatus()}
          />
          <StatusCard
            title="Subscription"
            {...getSubscriptionStatus()}
          />
          <StatusCard
            title="Cache Status"
            {...getCacheStatus()}
          />
        </div>
      </div>

      {/* Use Case Cards */}
      {useCases.map((useCase) => (
        <div key={useCase.id} style={cardStyle}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '20px' }}>
            {useCase.title}
          </h3>
          <p style={{ margin: '0 0 16px 0', opacity: 0.8, fontSize: '14px' }}>
            {useCase.description}
          </p>
          
          <div style={{
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
          }}>
            <strong>Scenario:</strong> {useCase.scenario}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {useCase.actions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                style={{
                  ...buttonStyle,
                  background: action.label.includes('Reset') 
                    ? 'rgba(255, 107, 107, 0.3)' 
                    : 'rgba(255, 255, 255, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = action.label.includes('Reset')
                    ? 'rgba(255, 107, 107, 0.4)'
                    : 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = action.label.includes('Reset')
                    ? 'rgba(255, 107, 107, 0.3)'
                    : 'rgba(255, 255, 255, 0.2)';
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Code Example */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
          Example Test Code
        </h3>
        <p style={{ margin: '0 0 16px 0', opacity: 0.8, fontSize: '14px' }}>
          Here's how you might use React Time Travel in your tests:
        </p>

        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '20px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '14px',
          overflow: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <div style={{ color: '#ff6b9d', marginBottom: '12px' }}>// Testing subscription expiration</div>
          <div style={{ color: '#c7f59b' }}>test('subscription expires after trial period', async () => {'{'}</div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}>const {'{ enableTimeTravel }'} = require('react-time-travel');</div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}>const timeControl = enableTimeTravel();</div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}></div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}>// Start trial</div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}>const user = await createTrialUser();</div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}>expect(user.subscriptionStatus).toBe('trial');</div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}></div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}>// Fast forward 8 days</div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}>timeControl.addDays(8);</div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}></div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}>// Check subscription expired</div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}>await user.reload();</div>
          <div style={{ color: '#c7f59b', marginLeft: '20px' }}>expect(user.subscriptionStatus).toBe('expired');</div>
          <div style={{ color: '#c7f59b' }}>{'});'}</div>
        </div>
      </div>

      {/* Performance Benefits */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
          🚀 Performance Benefits
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
        }}>
          <BenefitCard
            title="Test Speed"
            before="Wait 30 days for monthly billing"
            after="Instant forward to end of month"
            improvement="∞x faster"
          />
          <BenefitCard
            title="CI/CD"
            before="Skip time-dependent tests"
            after="Run all tests in seconds"
            improvement="100% coverage"
          />
          <BenefitCard
            title="Development"
            before="Mock complex time scenarios"
            after="Test real time logic instantly"
            improvement="Real behavior"
          />
        </div>
      </div>
    </div>
  );
}

function StatusCard({ title, status, color, message }: {
  title: string;
  status: string;
  color: string;
  message: string;
}) {
  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.3)',
      border: `1px solid ${color}`,
      borderRadius: '8px',
      padding: '16px',
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
        {title}
      </h4>
      <div style={{
        color,
        fontWeight: '600',
        fontSize: '14px',
        marginBottom: '4px',
      }}>
        {message}
      </div>
      <div style={{
        fontSize: '12px',
        opacity: 0.7,
        fontFamily: 'monospace',
      }}>
        Status: {status}
      </div>
    </div>
  );
}

function BenefitCard({ title, before, after, improvement }: {
  title: string;
  before: string;
  after: string;
  improvement: string;
}) {
  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#ffc107' }}>
        {title}
      </h4>
      <div style={{ marginBottom: '8px' }}>
        <div style={{ fontSize: '12px', opacity: 0.7 }}>Before:</div>
        <div style={{ fontSize: '13px', color: '#ff6b6b' }}>{before}</div>
      </div>
      <div style={{ marginBottom: '8px' }}>
        <div style={{ fontSize: '12px', opacity: 0.7 }}>After:</div>
        <div style={{ fontSize: '13px', color: '#00ff88' }}>{after}</div>
      </div>
      <div style={{ 
        fontSize: '14px', 
        fontWeight: 'bold', 
        color: '#ffc107',
        textAlign: 'center',
        marginTop: '12px',
        padding: '8px',
        background: 'rgba(255, 193, 7, 0.1)',
        borderRadius: '4px',
      }}>
        {improvement}
      </div>
    </div>
  );
}
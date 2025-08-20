import React, { useState } from 'react';

export function CodeExamples() {
  const [activeExample, setActiveExample] = useState('basic-setup');

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    marginBottom: '24px',
  };

  const codeStyle: React.CSSProperties = {
    background: 'rgba(0, 0, 0, 0.4)',
    padding: '20px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '14px',
    overflow: 'auto',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    lineHeight: '1.5',
  };

  const tabStyle: React.CSSProperties = {
    padding: '8px 16px',
    margin: '0 4px 16px 0',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const activeTabStyle: React.CSSProperties = {
    ...tabStyle,
    background: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  };

  const examples = {
    'basic-setup': {
      title: 'Basic Setup',
      description: 'Get started with React Time Travel in under 2 minutes',
      code: `// 1. Install the package
npm install react-time-travel

// 2. Wrap your app with TimeProvider
import React from 'react';
import { TimeProvider, TimeControlOverlay } from 'react-time-travel';

function App() {
  return (
    <TimeProvider options={{ enabled: true }}>
      <YourAppContent />
      
      {/* Optional: Add floating control panel */}
      <TimeControlOverlay />
    </TimeProvider>
  );
}

// 3. Use time control in components
import { useTimeControl } from 'react-time-travel';

function MyComponent() {
  const { currentTime, addHours, setTime } = useTimeControl();
  
  return (
    <div>
      <p>Current time: {currentTime.toLocaleString()}</p>
      <button onClick={() => addHours(1)}>
        Add 1 hour
      </button>
    </div>
  );
}`
    },
    'testing': {
      title: 'Testing Examples',
      description: 'Use in Jest, Vitest, or any testing framework',
      code: `// Jest/Vitest test example
import { enableTimeTravel, disableTimeTravel } from 'react-time-travel';

describe('Time-dependent tests', () => {
  let timeControl;

  beforeEach(() => {
    // Enable time control for each test
    timeControl = enableTimeTravel();
  });

  afterEach(() => {
    // Clean up after each test
    disableTimeTravel();
  });

  test('subscription expires after 30 days', () => {
    const user = createUser({ subscriptionDays: 30 });
    
    expect(user.isSubscriptionActive()).toBe(true);
    
    // Fast forward 31 days
    timeControl.addDays(31);
    
    expect(user.isSubscriptionActive()).toBe(false);
  });

  test('daily task resets at midnight', () => {
    const task = createDailyTask();
    task.complete();
    
    expect(task.isCompleted()).toBe(true);
    
    // Jump to next day at midnight
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    timeControl.setTime(tomorrow);
    
    expect(task.isCompleted()).toBe(false);
  });
});`
    },
    'hooks': {
      title: 'React Hooks',
      description: 'Multiple hooks for different use cases',
      code: `import { 
  useTimeControl, 
  useCurrentTime, 
  useKeyboardTimeControl,
  useSimpleTimeControl 
} from 'react-time-travel';

// Full control hook
function TimeControls() {
  const {
    currentTime,
    isActive,
    setTime,
    addMinutes,
    addHours,
    addDays,
    resetToRealTime,
    toggle
  } = useTimeControl();

  return (
    <div>
      <p>Time: {currentTime.toLocaleString()}</p>
      <button onClick={() => addHours(1)}>+1 Hour</button>
      <button onClick={resetToRealTime}>Reset</button>
      <button onClick={toggle}>
        {isActive ? 'Disable' : 'Enable'}
      </button>
    </div>
  );
}

// Simple time display
function TimeDisplay() {
  const currentTime = useCurrentTime();
  return <p>{currentTime.toLocaleString()}</p>;
}

// Keyboard shortcuts (automatic)
function KeyboardDemo() {
  useKeyboardTimeControl({
    minuteStep: 15,    // Arrow keys add/subtract 15 min
    hourStep: 1,       // Shift+Arrow = 1 hour
    dayStep: 1,        // Ctrl+Arrow = 1 day
  });
  
  return <p>Use arrow keys to control time!</p>;
}

// Simplified interface
function SimpleDemo() {
  const { 
    currentTime, 
    addMinutes, 
    addHours, 
    resetToRealTime 
  } = useSimpleTimeControl();
  
  return (
    <div>
      <p>{currentTime.toLocaleString()}</p>
      <button onClick={() => addMinutes(30)}>+30 min</button>
    </div>
  );
}`
    },
    'components': {
      title: 'UI Components',
      description: 'Pre-built components for time control',
      code: `import { 
  AnalogClock, 
  TimeControlPanel, 
  TimeControlOverlay 
} from 'react-time-travel';

// Analog clock with mouse wheel support
function ClockDemo() {
  return (
    <AnalogClock
      size="large"
      showTimePeriods={true}
      enableMouseWheel={true}
      wheelStep={15}           // 15 min per scroll
      wheelShiftStep={1}       // 1 hour with Shift
      showDigitalTime={true}
      faceColor="#ffffff"
      handColors={{
        hour: '#333333',
        minute: '#333333',
        second: '#ff4444'
      }}
    />
  );
}

// Full control panel
function ControlPanelDemo() {
  return (
    <TimeControlPanel
      theme="dark"
      enableKeyboard={true}
      showHelp={true}
      collapsible={true}
      position="fixed"
      timePeriods={[
        { label: '5 min', value: 5 * 60 * 1000 },
        { label: '1 hour', value: 60 * 60 * 1000 },
        { label: '1 day', value: 24 * 60 * 60 * 1000 }
      ]}
    />
  );
}

// Floating overlay (auto-hide in production)
function OverlayDemo() {
  return (
    <TimeControlOverlay
      defaultVisible={false}
      autoHide={true}          // Hide in production
      position="top-right"
      theme="auto"             // Follow system theme
      enableKeyboard={true}
      toggleKey="KeyT"         // Ctrl+Shift+T to toggle
      showFAB={true}           // Show floating action button
    />
  );
}`
    },
    'advanced': {
      title: 'Advanced Usage',
      description: 'Custom configurations and advanced features',
      code: `// Advanced TimeProvider configuration
import { TimeProvider, initializeTimeControl } from 'react-time-travel';

function AdvancedApp() {
  return (
    <TimeProvider
      options={{
        enabled: process.env.NODE_ENV !== 'production',
        startTime: '2024-01-01T00:00:00Z',
        hijackLibraries: true,
        environment: 'development',
        onTimeChange: (newTime) => {
          console.log('Time changed:', newTime);
          // Analytics, logging, etc.
        }
      }}
    >
      <App />
    </TimeProvider>
  );
}

// Manual initialization (no provider)
import { getTimeController } from 'react-time-travel';

function manualSetup() {
  const controller = getTimeController({
    enabled: true,
    startTime: new Date('2024-12-25T09:00:00'),
    hijackLibraries: false,  // Don't hijack moment/dayjs
  });

  // Manual control
  controller.setTime('2024-01-01');
  controller.addDays(30);
  controller.enable();
  
  // Subscribe to changes
  const unsubscribe = controller.subscribe((time) => {
    console.log('New time:', time);
  });
  
  // Cleanup
  setTimeout(() => {
    unsubscribe();
    controller.destroy();
  }, 10000);
}

// Custom time periods
const customPeriods = [
  { label: 'Sprint', value: 14 * 24 * 60 * 60 * 1000 },
  { label: 'Quarter', value: 90 * 24 * 60 * 60 * 1000 },
  { label: 'Year', value: 365 * 24 * 60 * 60 * 1000 }
];

// Environment-specific behavior
import { detectEnvironment, shouldEnableTimeControl } from 'react-time-travel';

const env = detectEnvironment();
const shouldEnable = shouldEnableTimeControl(env);

console.log(\`Environment: \${env}, Enable: \${shouldEnable}\`);`
    },
    'integration': {
      title: 'Library Integration',
      description: 'Works with Moment.js, Day.js, and other date libraries',
      code: `// Works automatically with popular libraries
import moment from 'moment';
import dayjs from 'dayjs';
import { addDays, format } from 'date-fns';

// All these will use controlled time when active
function LibraryExamples() {
  const { addHours } = useTimeControl();
  
  const handleTimeJump = () => {
    addHours(2);
    
    // All these now reflect the new controlled time
    console.log('Moment:', moment().format('YYYY-MM-DD HH:mm:ss'));
    console.log('Dayjs:', dayjs().format('YYYY-MM-DD HH:mm:ss'));
    console.log('Date-fns:', format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    console.log('Native:', new Date().toISOString());
  };
  
  return <button onClick={handleTimeJump}>Jump 2 hours</button>;
}

// For date-fns, pass controlled Date objects
import { useCurrentTime } from 'react-time-travel';

function DateFnsExample() {
  const currentTime = useCurrentTime();
  
  return (
    <div>
      <p>In 7 days: {format(addDays(currentTime, 7), 'PPP')}</p>
      <p>Relative: {formatDistanceToNow(currentTime)}</p>
    </div>
  );
}

// Manual library hijacking control
import { getTimeController } from 'react-time-travel';

const controller = getTimeController({
  hijackLibraries: true,  // Auto-hijack moment, dayjs
});

// Or disable library hijacking
const manualController = getTimeController({
  hijackLibraries: false,  // Only hijack native Date
});`
    }
  };

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>
          Code Examples & Integration
        </h2>
        <p style={{ margin: '0 0 24px 0', opacity: 0.9, lineHeight: '1.6' }}>
          Copy-paste examples to get started quickly. All examples are production-ready 
          and include TypeScript types.
        </p>

        {/* Tab Navigation */}
        <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap' }}>
          {Object.entries(examples).map(([key, example]) => (
            <button
              key={key}
              onClick={() => setActiveExample(key)}
              style={activeExample === key ? activeTabStyle : tabStyle}
            >
              {example.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Example */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>
          {examples[activeExample as keyof typeof examples].title}
        </h3>
        <p style={{ margin: '0 0 20px 0', opacity: 0.8, fontSize: '14px' }}>
          {examples[activeExample as keyof typeof examples].description}
        </p>

        <div style={codeStyle}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#e2e8f0' }}>
            {examples[activeExample as keyof typeof examples].code
              .split('\n')
              .map((line, index) => (
                <div key={index} style={{ 
                  color: line.trim().startsWith('//') ? '#94a3b8' :
                        line.includes('import') || line.includes('export') ? '#f472b6' :
                        line.includes('function') || line.includes('const') || line.includes('let') ? '#60a5fa' :
                        line.includes('return') ? '#34d399' :
                        line.includes('<') || line.includes('/>') ? '#fbbf24' :
                        '#e2e8f0'
                }}>
                  {line}
                </div>
              ))}
          </pre>
        </div>
      </div>

      {/* Installation Instructions */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
          📦 Installation
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          <InstallCard
            title="NPM"
            command="npm install react-time-travel"
            description="Most popular package manager"
          />
          <InstallCard
            title="Yarn"
            command="yarn add react-time-travel"
            description="Fast, reliable dependency management"
          />
          <InstallCard
            title="PNPM"
            command="pnpm add react-time-travel"
            description="Efficient disk space usage"
          />
        </div>
      </div>

      {/* TypeScript Support */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
          🔷 TypeScript Support
        </h3>
        <p style={{ margin: '0 0 16px 0', opacity: 0.8, fontSize: '14px' }}>
          React Time Travel is built with TypeScript and provides excellent type safety:
        </p>

        <div style={codeStyle}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#e2e8f0' }}>
{`// Full type safety out of the box
import { 
  TimeController, 
  TimeControlOptions, 
  TimePeriod 
} from 'react-time-travel';

interface MyComponentProps {
  onTimeChange?: (time: Date) => void;
}

function MyComponent({ onTimeChange }: MyComponentProps) {
  const controller: TimeController = useTimeControl({
    enabled: true,
    startTime: new Date(),
    onTimeChange
  });
  
  // All methods are fully typed
  controller.setTime(new Date());  // ✅ Date accepted
  controller.setTime("2024-01-01"); // ✅ String accepted  
  controller.setTime(1640995200000); // ✅ Number accepted
  // controller.setTime({}); // ❌ TypeScript error
  
  return <div>{controller.getCurrentTime().toISOString()}</div>;
}`}
          </pre>
        </div>
      </div>

      {/* Framework Compatibility */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
          🔧 Framework Compatibility
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          <CompatibilityCard framework="React 16.8+" status="✅ Full Support" />
          <CompatibilityCard framework="React 17" status="✅ Full Support" />
          <CompatibilityCard framework="React 18" status="✅ Full Support" />
          <CompatibilityCard framework="Next.js" status="✅ SSR Compatible" />
          <CompatibilityCard framework="Vite" status="✅ Full Support" />
          <CompatibilityCard framework="Create React App" status="✅ Works OOTB" />
          <CompatibilityCard framework="Jest" status="✅ Test Compatible" />
          <CompatibilityCard framework="Vitest" status="✅ Test Compatible" />
        </div>
      </div>
    </div>
  );
}

function InstallCard({ title, command, description }: {
  title: string;
  command: string;
  description: string;
}) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
  };

  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#ffc107' }}>
        {title}
      </h4>
      <div style={{
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '12px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '14px',
        marginBottom: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>{command}</span>
        <button
          onClick={copyToClipboard}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
            color: '#ffffff',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Copy
        </button>
      </div>
      <div style={{ fontSize: '12px', opacity: 0.7 }}>
        {description}
      </div>
    </div>
  );
}

function CompatibilityCard({ framework, status }: {
  framework: string;
  status: string;
}) {
  const isSupported = status.includes('✅');
  
  return (
    <div style={{
      background: isSupported 
        ? 'rgba(0, 255, 136, 0.1)' 
        : 'rgba(255, 107, 107, 0.1)',
      border: `1px solid ${isSupported 
        ? 'rgba(0, 255, 136, 0.3)' 
        : 'rgba(255, 107, 107, 0.3)'}`,
      borderRadius: '8px',
      padding: '12px',
      textAlign: 'center',
    }}>
      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
        {framework}
      </div>
      <div style={{ 
        fontSize: '12px', 
        color: isSupported ? '#00ff88' : '#ff6b6b' 
      }}>
        {status}
      </div>
    </div>
  );
}
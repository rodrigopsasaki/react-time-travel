# React Time Travel ⏰

[![npm version](https://badge.fury.io/js/react-time-travel.svg)](https://badge.fury.io/js/react-time-travel)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Control time in your React applications for testing and development**

React Time Travel is a powerful, zero-configuration library that lets you manipulate time in your React applications. Perfect for testing time-dependent features, debugging temporal logic, and developing applications that rely on specific dates or times.

## ✨ Features

- 🎯 **Zero Configuration** - Drop-in solution that works immediately
- ⚡ **Time Hijacking** - Automatically hijacks `Date()`, `Date.now()`, and popular libraries
- 🎨 **Beautiful UI** - Analog clock and control panel components
- ⌨️ **Keyboard Shortcuts** - Power-user friendly with customizable hotkeys
- 📚 **Library Support** - Works with Moment.js, Day.js, and date-fns
- 🛡️ **Production Safe** - Automatically disabled in production builds
- 🔷 **TypeScript** - Full type safety and excellent DX
- 🧪 **Testing Ready** - Perfect for Jest, Vitest, and other test frameworks

## 🚀 Quick Start

### Installation

```bash
npm install react-time-travel
```

### Basic Usage

```tsx
import React from 'react';
import { TimeProvider, TimeControlOverlay, useTimeControl } from 'react-time-travel';

function App() {
  return (
    <TimeProvider>
      <MyComponent />
      <TimeControlOverlay /> {/* Optional: floating control panel */}
    </TimeProvider>
  );
}

function MyComponent() {
  const { currentTime, addHours } = useTimeControl();
  
  return (
    <div>
      <p>Current time: {currentTime.toLocaleString()}</p>
      <button onClick={() => addHours(1)}>Add 1 hour</button>
    </div>
  );
}
```

That's it! All `new Date()` calls in your app will now use the controlled time.

## 📖 Complete API Reference

### TimeProvider

Wrap your app to enable time control:

```tsx
<TimeProvider
  options={{
    enabled: true,                    // Enable time control
    startTime: new Date(),           // Initial time
    hijackLibraries: true,           // Auto-hijack moment, dayjs
    onTimeChange: (time) => {        // Callback on time change
      console.log('Time changed:', time);
    }
  }}
>
  <App />
</TimeProvider>
```

### useTimeControl Hook

Primary hook for time manipulation:

```tsx
const {
  currentTime,        // Current controlled time
  isActive,          // Whether time control is active
  setTime,           // Set specific time
  addTime,           // Add milliseconds
  addMinutes,        // Add minutes
  addHours,          // Add hours  
  addDays,           // Add days
  resetToRealTime,   // Reset to system time
  enable,            // Enable time control
  disable,           // Disable time control
  toggle,            // Toggle on/off
  jumpBy,            // Jump by period string ('1h', '30m')
  controller         // Access to underlying controller
} = useTimeControl();
```

### UI Components

#### TimeControlPanel

Full-featured control panel:

```tsx
<TimeControlPanel
  theme="dark"              // 'light' | 'dark' | 'auto'
  position="fixed"          // 'fixed' | 'relative'
  enableKeyboard={true}     // Enable keyboard shortcuts
  showHelp={true}          // Show keyboard shortcut help
  collapsible={true}       // Allow collapsing
/>
```

#### AnalogClock

Interactive analog clock:

```tsx
<AnalogClock
  size="large"              // 'small' | 'medium' | 'large' | number
  showTimePeriods={true}    // Show quick time buttons
  enableMouseWheel={true}   // Mouse wheel control
  wheelStep={15}           // Minutes per wheel step
  showDigitalTime={true}   // Show digital time display
  faceColor="#ffffff"      // Clock face color
  handColors={{            // Hand colors
    hour: '#333',
    minute: '#333', 
    second: '#ff4444'
  }}
/>
```

#### TimeControlOverlay

Floating overlay for any app:

```tsx
<TimeControlOverlay
  autoHide={true}          // Hide in production
  position="top-right"     // Overlay position
  theme="auto"             // Follow system theme
  enableKeyboard={true}    // Global keyboard shortcuts
  toggleKey="KeyT"         // Ctrl+Shift+T to toggle
  showFAB={true}          // Show floating action button
/>
```

### Testing Integration

Perfect for time-dependent tests:

```tsx
import { enableTimeTravel } from 'react-time-travel';

test('subscription expires after trial', () => {
  const timeControl = enableTimeTravel();
  
  const user = createTrialUser();
  expect(user.isSubscriptionActive()).toBe(true);
  
  // Fast forward 31 days
  timeControl.addDays(31);
  
  expect(user.isSubscriptionActive()).toBe(false);
});
```

## ⌨️ Keyboard Shortcuts

- **Space**: Toggle time control on/off
- **R**: Reset to real time
- **↑/↓**: Add/subtract 15 minutes
- **Shift + ↑/↓**: Add/subtract 1 hour  
- **Ctrl/Cmd + ↑/↓**: Add/subtract 1 day
- **Ctrl+Shift+T**: Toggle overlay panel
- **Escape**: Close time control panel

## 🧪 Library Integration

React Time Travel automatically works with popular date libraries:

```tsx
import moment from 'moment';
import dayjs from 'dayjs';
import { addDays, format } from 'date-fns';

// All of these will use controlled time when active:
moment().format('YYYY-MM-DD');           // Moment.js
dayjs().format('YYYY-MM-DD');            // Day.js  
format(new Date(), 'yyyy-MM-dd');        // date-fns
new Date().toISOString();                // Native Date
Date.now();                              // Native timestamp
```

No configuration needed - it just works!

## 🎯 Real-World Use Cases

### Testing Time-Dependent Features

```tsx
// Test subscription expiration
timeControl.addDays(30);

// Test business hours logic  
timeControl.setTime('2024-01-01T09:00:00'); // 9 AM
timeControl.setTime('2024-01-01T18:00:00'); // 6 PM

// Test timezone boundaries
timeControl.setTime('2024-01-01T00:00:00Z'); // UTC midnight

// Test date boundaries
timeControl.setTime('2024-02-29T12:00:00'); // Leap year
timeControl.setTime('2024-12-31T23:59:59'); // Year end
```

### Development & Debugging

```tsx
// Debug time-sensitive components
function OrderStatus({ order }) {
  const { addHours } = useTimeControl();
  
  // Quickly test different order states
  return (
    <div>
      <p>Order placed: {order.createdAt.toLocaleString()}</p>
      <button onClick={() => addHours(24)}>
        Simulate 24h later
      </button>
    </div>
  );
}
```

### Demo & Presentation

```tsx
// Perfect for live demos
function LiveDemo() {
  const { setTime } = useTimeControl();
  
  return (
    <div>
      <button onClick={() => setTime('2024-12-25T09:00:00')}>
        Christmas Morning
      </button>
      <button onClick={() => setTime('2024-01-01T00:00:00')}>
        New Year's Eve
      </button>
    </div>
  );
}
```

## 🔧 Configuration Options

### Environment Detection

React Time Travel automatically detects your environment:

- **Production**: Disabled by default for safety
- **Development**: Enabled by default  
- **Test**: Enabled by default

Override with explicit configuration:

```tsx
<TimeProvider 
  options={{ 
    enabled: process.env.NODE_ENV !== 'production',
    environment: 'development' // Force environment
  }}
>
```

### Custom Time Periods

Define your own quick-jump periods:

```tsx
const customPeriods = [
  { label: 'Sprint', value: 14 * 24 * 60 * 60 * 1000 },  // 14 days
  { label: 'Quarter', value: 90 * 24 * 60 * 60 * 1000 }, // 90 days
  { label: 'Year', value: 365 * 24 * 60 * 60 * 1000 }    // 365 days
];

<TimeControlPanel timePeriods={customPeriods} />
```

### Library Hijacking Control

Choose which libraries to hijack:

```tsx
<TimeProvider 
  options={{
    hijackLibraries: true,  // Auto-detect and hijack
    // OR specific control:
    hijackLibraries: {
      moment: true,
      dayjs: true,
      dateFns: false  // Don't hijack date-fns
    }
  }}
>
```

## 🎨 Styling & Theming

### CSS Custom Properties

Customize the appearance with CSS variables:

```css
:root {
  --time-travel-primary: #007bff;
  --time-travel-background: rgba(255, 255, 255, 0.95);
  --time-travel-text: #333333;
  --time-travel-border: rgba(0, 0, 0, 0.1);
  --time-travel-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### Dark Mode

Automatic dark mode support:

```tsx
<TimeControlPanel theme="auto" /> // Follows system preference
<TimeControlPanel theme="dark" /> // Force dark mode
<TimeControlPanel theme="light" /> // Force light mode
```

### Custom Styling

All components accept standard React props:

```tsx
<AnalogClock 
  className="my-clock"
  style={{ border: '2px solid gold' }}
/>

<TimeControlPanel 
  style={{ 
    position: 'fixed',
    bottom: '20px',
    left: '20px'
  }}
/>
```

## 🚀 Performance

React Time Travel is designed for minimal performance impact:

- **Lazy Loading**: Components only render when needed
- **Efficient Updates**: Smart subscription system prevents unnecessary re-renders  
- **Tree Shaking**: Only import what you use
- **Zero Runtime Cost**: When disabled, has no performance impact

## 🔷 TypeScript Support

Full TypeScript support with excellent intellisense:

```tsx
import type { 
  TimeController, 
  TimeControlOptions, 
  TimePeriod 
} from 'react-time-travel';

interface Props {
  onTimeChange?: (time: Date) => void;
}

function MyComponent({ onTimeChange }: Props) {
  const controller: TimeController = useTimeControl({
    enabled: true,
    onTimeChange
  });
  
  // Full type safety
  controller.setTime(new Date());     // ✅ 
  controller.setTime('2024-01-01');   // ✅
  controller.setTime(1640995200000);  // ✅
  // controller.setTime({}); // ❌ TypeScript error
}
```

## 📋 Browser Support

- ✅ Chrome 70+
- ✅ Firefox 65+  
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Node.js 14+ (for SSR)

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/react-time-travel/react-time-travel.git
cd react-time-travel

# Install dependencies
npm install

# Start development
npm run dev

# Run example app
npm run example:dev

# Run tests
npm test

# Build packages
npm run build
```

## 📄 License

MIT © [Rodrigo Sasaki](LICENSE)

## 🙏 Acknowledgments

- Inspired by time manipulation needs in testing environments
- Built with modern React patterns and TypeScript
- Designed for developer experience and ease of use

## 📚 More Resources

- [API Documentation](docs/api.md)
- [Migration Guide](docs/migration.md) 
- [Examples Repository](examples/)
- [Community Discord](https://discord.gg/react-time-travel)

---

**Made with ⏰ by developers who got tired of waiting for time-dependent tests**

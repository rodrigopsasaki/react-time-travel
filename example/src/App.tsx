import React, { useState } from 'react';
import { TimeProvider, TimeControlOverlay } from '@time-travel/react';
import { Header } from './components/Header.js';
import { DateDisplayDemo } from './components/DateDisplayDemo.js';
import { LibraryIntegrationDemo } from './components/LibraryIntegrationDemo.js';
import { InteractiveDemo } from './components/InteractiveDemo.js';
import { UseCaseExamples } from './components/UseCaseExamples.js';
import { CodeExamples } from './components/CodeExamples.js';

function App() {
  const [activeTab, setActiveTab] = useState('demo');

  const tabs = [
    { id: 'demo', label: 'Interactive Demo', component: InteractiveDemo },
    { id: 'dates', label: 'Date Display', component: DateDisplayDemo },
    { id: 'libraries', label: 'Library Integration', component: LibraryIntegrationDemo },
    { id: 'examples', label: 'Use Cases', component: UseCaseExamples },
    { id: 'code', label: 'Code Examples', component: CodeExamples },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || InteractiveDemo;

  return (
    <TimeProvider
      options={{
        enabled: true,
        hijackLibraries: true,
        onTimeChange: (time) => {
          console.log('Time changed to:', time.toISOString());
        },
      }}
    >
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
      }}>
        <Header />
        
        {/* Navigation */}
        <nav style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          padding: '0 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            gap: '0',
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '16px 24px',
                  background: activeTab === tab.id 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.id 
                    ? '2px solid #ffffff' 
                    : '2px solid transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px',
        }}>
          <ActiveComponent />
        </main>

        {/* Time Control Overlay */}
        <TimeControlOverlay
          defaultVisible={false}
          showClock={false}
          enableKeyboard={true}
          theme="dark"
          position="top-right"
        />
      </div>
    </TimeProvider>
  );
}

export default App;
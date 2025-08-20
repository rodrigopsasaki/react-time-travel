import type { Environment } from './types.js';

/**
 * Detect the current environment
 */
export function detectEnvironment(): Environment {
  // Check Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    const nodeEnv = process.env.NODE_ENV?.toLowerCase();
    if (nodeEnv === 'production') return 'production';
    if (nodeEnv === 'test') return 'test';
    if (nodeEnv === 'development') return 'development';
  }

  // Check browser environment
  if (typeof window !== 'undefined') {
    // Check for common test runners
    if (
      'jest' in window ||
      'jasmine' in window ||
      'mocha' in window ||
      '__karma__' in window ||
      navigator.userAgent.includes('HeadlessChrome')
    ) {
      return 'test';
    }

    // Check for development indicators
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.includes('.local') ||
      window.location.port !== ''
    ) {
      return 'development';
    }

    // Check for production build indicators
    if (
      window.location.protocol === 'https:' ||
      !window.location.hostname.includes('.')
    ) {
      return 'production';
    }
  }

  // Default to development if unable to determine
  return 'development';
}

/**
 * Check if time control should be enabled based on environment
 */
export function shouldEnableTimeControl(environment?: Environment): boolean {
  const env = environment || detectEnvironment();
  
  // Never enable in production for safety
  if (env === 'production') {
    return false;
  }

  // Enable in development and test environments
  return env === 'development' || env === 'test';
}

/**
 * Check if we're running in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Check if we're running in a Node.js environment
 */
export function isNode(): boolean {
  return typeof process !== 'undefined' && 
         process.versions != null && 
         process.versions.node != null;
}

/**
 * Get environment-specific warning messages
 */
export function getEnvironmentWarning(environment: Environment): string | null {
  switch (environment) {
    case 'production':
      return 'Time control is disabled in production for safety. This is expected behavior.';
    case 'test':
      return null; // No warning needed in test environment
    case 'development':
      return null; // No warning needed in development
    default:
      return 'Unknown environment detected. Time control behavior may be unpredictable.';
  }
}

/**
 * Log environment-specific messages
 */
export function logEnvironmentInfo(environment: Environment, enabled: boolean): void {
  if (!isBrowser() || !console) return;

  const prefix = '[react-time-travel]';
  
  if (enabled) {
    console.info(`${prefix} Time control enabled in ${environment} environment`);
  } else {
    const warning = getEnvironmentWarning(environment);
    if (warning) {
      console.warn(`${prefix} ${warning}`);
    } else {
      console.info(`${prefix} Time control disabled in ${environment} environment`);
    }
  }
}
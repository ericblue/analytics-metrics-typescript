import Analytics from 'analytics';
import { configLoader } from './configLoader';
import { getAnonymousId, getSessionId } from './userIdentification';
import posthog from 'posthog-js';

type EventType = string;
type EventProperties = Record<string, unknown>;
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Custom console plugin that respects log levels
const consolePlugin = {
  name: 'console',
  config: {
    logLevel: 'debug' as LogLevel
  },
  initialize: () => {
    console.log('Console analytics initialized');
  },
  page: ({ payload }: { payload: { properties: Record<string, unknown> } }) => {
    if (typeof window === 'undefined') {
      console.log('[Server] Page:', payload.properties);
    } else {
      console.debug('[Client] Page:', payload.properties);
    }
  },
  track: ({ payload }: { payload: { event: string; properties: Record<string, unknown> } }) => {
    if (typeof window === 'undefined') {
      console.log('[Server] Event:', payload.event, payload.properties);
    } else {
      console.debug('[Client] Event:', payload.event, payload.properties);
    }
  },
  identify: ({ payload }: { payload: { userId: string; traits?: Record<string, unknown> } }) => {
    if (typeof window === 'undefined') {
      console.log('[Server] User:', payload);
    } else {
      console.debug('[Client] User:', payload);
    }
  }
};

// Google Analytics plugin
const googleAnalyticsPlugin = {
  name: 'google-analytics',
  config: {
    measurementId: configLoader.getValue('GA_TRACKING_ID')
  },
  initialize: ({ config }: { config: { measurementId: string } }) => {
    if (!config.measurementId) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', config.measurementId);
  },
  page: ({ payload }: { payload: { properties: Record<string, unknown> } }) => {
    if (window.gtag) {
      window.gtag('event', 'page_view', payload.properties);
    }
  },
  track: ({ payload }: { payload: { event: string; properties: Record<string, unknown> } }) => {
    if (window.gtag) {
      window.gtag('event', payload.event, payload.properties);
    }
  }
};

// PostHog plugin using the npm package
const postHogPlugin = {
  name: 'posthog',
  config: {},
  initialize: () => {
    console.log('PostHog plugin initialized');
  },
  page: ({ payload }: { payload: { properties: Record<string, unknown> } }) => {
    if (typeof window !== 'undefined' && posthog) {
      posthog.capture('$pageview', payload.properties);
    }
  },
  track: ({ payload }: { payload: { event: string; properties: Record<string, unknown> } }) => {
    if (typeof window !== 'undefined' && posthog) {
      posthog.capture(payload.event, payload.properties);
    }
  },
  identify: ({ payload }: { payload: { userId: string; traits?: Record<string, unknown> } }) => {
    if (typeof window !== 'undefined' && posthog) {
      posthog.identify(payload.userId, payload.traits);
    }
  }
};

// Initialize analytics with plugins
const analytics = Analytics({
  app: 'binaural-flow',
  debug: configLoader.getValue('ANALYTICS_DEBUG', 'false') === 'true',
  plugins: [
    consolePlugin,
    googleAnalyticsPlugin,
    postHogPlugin
  ]
});

// Add user and session IDs to all events
function enrichEventProperties(properties?: Record<string, unknown>): Record<string, unknown> {
  return {
    ...properties,
    anonymousId: getAnonymousId(),
    sessionId: getSessionId(),
    timestamp: Date.now()
  };
}

// Utility functions for tracking events
export const trackEvent = (
  event: EventType,
  properties?: EventProperties
) => {
  analytics.track(event, enrichEventProperties(properties));
};

export const trackPage = (
  path: string,
  properties?: Record<string, unknown>
) => {
  analytics.page({
    path,
    ...enrichEventProperties(properties)
  });
};

export const identifyUser = (
  userId: string,
  traits?: Record<string, unknown>
) => {
  analytics.identify(userId, enrichEventProperties(traits));
};

// Export the analytics instance for direct access if needed
export default analytics; 
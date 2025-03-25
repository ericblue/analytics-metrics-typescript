import type { AnalyticsConfig } from '../components/analytics/types';
import { configLoader } from '@/utils/configLoader';

const logConfig = (config: AnalyticsConfig) => {
  console.group('Analytics Configuration');
  console.log('Google Analytics:', {
    enabled: config.googleAnalytics.enabled,
    trackingId: config.googleAnalytics.enabled ? '***' + config.googleAnalytics.trackingId.slice(-4) : 'disabled'
  });
  console.log('Microsoft Clarity:', {
    enabled: config.clarity.enabled,
    projectId: config.clarity.enabled ? '***' + config.clarity.projectId.slice(-4) : 'disabled'
  });
  console.log('PostHog:', {
    enabled: config.postHog.enabled,
    apiKey: config.postHog.enabled ? '***' + config.postHog.apiKey.slice(-4) : 'disabled',
    hostUrl: config.postHog.enabled ? config.postHog.hostUrl : 'disabled'
  });
  console.groupEnd();
};

export const analyticsConfig: AnalyticsConfig = {
  googleAnalytics: { 
    enabled: true, 
    trackingId: ''
  },
  clarity: { 
    enabled: true, 
    projectId: ''
  },
  postHog: {
    enabled: true,
    apiKey: '',
    hostUrl: ''
  }
};

// Log the configuration when the module is loaded
logConfig(analyticsConfig);
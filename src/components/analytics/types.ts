export interface GoogleAnalyticsConfig {
  enabled: boolean;
  trackingId: string;
}

export interface ClarityConfig {
  enabled: boolean;
  projectId: string;
}

export interface PostHogConfig {
  enabled: boolean;
  apiKey: string;
  hostUrl: string;
}

export interface AnalyticsConfig {
  googleAnalytics: {
    enabled: boolean;
    trackingId: string;
  };
  clarity: {
    enabled: boolean;
    projectId: string;
  };
  postHog: {
    enabled: boolean;
    apiKey: string;
    hostUrl: string;
  };
}
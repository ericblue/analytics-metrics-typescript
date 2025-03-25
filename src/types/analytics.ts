// Types of events we want to track
export enum EventType {
  // User Events
  USER_SIGNED_UP = 'user_signed_up',
  USER_SIGNED_IN = 'user_signed_in',
  USER_SIGNED_OUT = 'user_signed_out',
  USER_UPDATED_PROFILE = 'user_updated_profile',
  USER_DELETED_ACCOUNT = 'user_deleted_account',

  // Feature Usage Events
  FEATURE_VIEWED = 'feature_viewed',
  FEATURE_INTERACTION = 'feature_interaction',
  FEATURE_COMPLETED = 'feature_completed',
  FEATURE_ERROR = 'feature_error',

  // Content Events
  CONTENT_VIEWED = 'content_viewed',
  CONTENT_CREATED = 'content_created',
  CONTENT_UPDATED = 'content_updated',
  CONTENT_DELETED = 'content_deleted',
  CONTENT_SHARED = 'content_shared',

  // Navigation Events
  PAGE_VIEWED = 'page_viewed',
  NAVIGATION_CLICKED = 'navigation_clicked',
  EXTERNAL_LINK_CLICKED = 'external_link_clicked',
  SEARCH_PERFORMED = 'search_performed',

  // Settings Events
  SETTINGS_UPDATED = 'settings_updated',
  PREFERENCES_CHANGED = 'preferences_changed',
  NOTIFICATION_TOGGLED = 'notification_toggled',

  // Subscription/Payment Events
  SUBSCRIPTION_STARTED = 'subscription_started',
  SUBSCRIPTION_CANCELLED = 'subscription_cancelled',
  PAYMENT_INITIATED = 'payment_initiated',
  PAYMENT_COMPLETED = 'payment_completed',
  PAYMENT_FAILED = 'payment_failed',

  // Error Events
  APP_ERROR = 'app_error',
  API_ERROR = 'api_error',
  VALIDATION_ERROR = 'validation_error'
}

export interface BaseEventProperties {
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface UserEventProperties extends BaseEventProperties {
  userType?: string;
  source?: string;
  method?: string;
}

export interface FeatureEventProperties extends BaseEventProperties {
  featureId: string;
  featureName: string;
  featureCategory?: string;
  action: string;
  duration?: number;
}

export interface ContentEventProperties extends BaseEventProperties {
  contentId: string;
  contentType: string;
  contentCategory?: string;
  action: string;
  metadata?: Record<string, any>;
}

export interface NavigationEventProperties extends BaseEventProperties {
  path: string;
  referrer?: string;
  title?: string;
  searchQuery?: string;
}

export interface SettingsEventProperties extends BaseEventProperties {
  settingName: string;
  oldValue?: any;
  newValue?: any;
  category?: string;
}

export interface PaymentEventProperties extends BaseEventProperties {
  amount: number;
  currency: string;
  productId?: string;
  productName?: string;
  paymentMethod?: string;
  status?: string;
}

export interface ErrorEventProperties extends BaseEventProperties {
  errorCode: string;
  errorMessage: string;
  errorStack?: string;
  componentName?: string;
  metadata?: Record<string, any>;
}

export type EventProperties =
  | UserEventProperties
  | FeatureEventProperties
  | ContentEventProperties
  | NavigationEventProperties
  | SettingsEventProperties
  | PaymentEventProperties
  | ErrorEventProperties;

export interface AnalyticsInstance {
  trackEvent: (eventType: EventType, properties?: EventProperties) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
  page: (properties?: NavigationEventProperties) => void;
  reset: () => void;
}

// Analytics Plugin Payload Types
export interface AnalyticsPayload {
  properties: Record<string, unknown>;
  options?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface PagePayload extends AnalyticsPayload {
  properties: {
    path: string;
    [key: string]: unknown;
  };
}

export interface TrackPayload extends AnalyticsPayload {
  event: EventType;
  properties: EventProperties;
}

export interface IdentifyPayload extends AnalyticsPayload {
  userId: string;
  traits?: Record<string, unknown>;
}

// Global type declarations
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    posthog: {
      init: (apiKey: string, options: { api_host: string }) => void;
      capture: (event: string, properties?: Record<string, unknown>) => void;
      identify: (userId: string, traits?: Record<string, unknown>) => void;
    };
  }
} 
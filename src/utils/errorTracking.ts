import { trackEvent } from './analytics';
import { EventType } from '@/types/analytics';

export function trackError(error: Error, context: string, additionalData?: Record<string, unknown>) {
  trackEvent(EventType.CONFIGURATION_ERROR, {
    errorCode: error.name,
    errorMessage: error.message,
    errorStack: error.stack,
    context,
    ...additionalData
  });
}


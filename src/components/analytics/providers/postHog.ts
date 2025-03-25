import posthog from 'posthog-js';

export const initializePostHog = (apiKey: string, hostUrl: string): void => {
  if (!apiKey || !hostUrl) {
    console.warn('PostHog initialization skipped: Missing API key or host URL');
    return;
  }

  console.log('Initializing PostHog with config:', {
    apiHost: hostUrl,
    apiKey: apiKey.slice(0, 4) + '...'
  });

  try {
    posthog.init(apiKey, { 
      api_host: hostUrl,
      loaded: (posthogInstance) => {
        console.log('PostHog initialized successfully');
      }
    });
  } catch (error) {
    console.error('Error initializing PostHog:', error);
  }
};
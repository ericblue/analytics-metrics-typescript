import { useEffect, useState } from 'react';
import { loadGoogleAnalytics } from './providers/googleAnalytics';
import { loadClarity } from './providers/clarity';
import { initializePostHog } from './providers/postHog';
import { loadRemoteConfig } from '@/utils/supabaseConfig';
import { configLoader } from '@/utils/configLoader';
import { identifyAnonymousUser } from '@/utils/userIdentification';
import { NavigationTracker } from '@/components/navigation/NavigationTracker';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const [analyticsConfig, setAnalyticsConfig] = useState({
    googleAnalytics: { enabled: false, trackingId: '' },
    clarity: { enabled: false, projectId: '' },
    postHog: { enabled: false, apiKey: '', hostUrl: '' }
  });

  useEffect(() => {
    const initializeAnalytics = async () => {
      console.log('Initializing analytics...');
      await loadRemoteConfig();
      
      // Load configuration after remote config is loaded
      const config = {
        googleAnalytics: { 
          enabled: true, 
          trackingId: configLoader.getValue('GA_TRACKING_ID')
        },
        clarity: { 
          enabled: true, 
          projectId: configLoader.getValue('CLARITY_PROJECT_ID')
        },
        postHog: {
          enabled: true,
          apiKey: configLoader.getValue('POSTHOG_API_KEY'),
          hostUrl: configLoader.getValue('POSTHOG_HOST_URL')
        }
      };

      setAnalyticsConfig(config);
      setIsConfigLoaded(true);

      if (config.googleAnalytics.enabled && config.googleAnalytics.trackingId) {
        console.log('Loading Google Analytics...');
        loadGoogleAnalytics(config.googleAnalytics.trackingId);
      }

      if (config.clarity.enabled && config.clarity.projectId) {
        console.log('Loading Microsoft Clarity...');
        loadClarity(config.clarity.projectId);
      }

      if (config.postHog.enabled && config.postHog.apiKey && config.postHog.hostUrl) {
        console.log('Loading PostHog...');
        initializePostHog(config.postHog.apiKey, config.postHog.hostUrl);
      }
    };

    initializeAnalytics();
  }, []);

  if (!isConfigLoaded) {
    console.log('Waiting for analytics config to load...');
    return null;
  }

  return <>{children}</>;
}
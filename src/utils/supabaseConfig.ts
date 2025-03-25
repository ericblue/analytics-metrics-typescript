import { configLoader } from './configLoader';
import { supabase } from '@/integrations/supabase/client';

export async function loadRemoteConfig() {
  try {
    const { data: response, error } = await supabase.functions.invoke('get-config');
    
    if (error) {
      throw error;
    }
    
    if (!response) {
      throw new Error('No configuration data received');
    }

    configLoader.updateRemoteConfig(response);
    return response;
  } catch (error) {
    console.error('Failed to load remote configuration:', error);
    throw error; // Re-throw to allow proper error handling by callers
  }
} 
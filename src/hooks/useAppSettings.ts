import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import defaultLogo from '@/assets/logo.png';

export const useAppSettings = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['app-name', 'app-logo']);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const appName = settings?.find(s => s.key === 'app-name')?.value || 'BOUTIQUE MANCER';
  const appLogo = settings?.find(s => s.key === 'app-logo')?.value || defaultLogo;

  return {
    appName,
    appLogo,
    isLoading,
  };
};

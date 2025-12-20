import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import defaultLogo from '@/assets/logo.png';
import { useEffect, useState } from 'react';

export const useAppSettings = () => {
  const queryClient = useQueryClient();
  const [logoKey, setLogoKey] = useState(Date.now());

  const { data: settings, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['app-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['app-name', 'app-logo']);
      if (error) throw error;
      return data;
    },
    staleTime: 0, // Always refetch to get latest logo
    gcTime: 0, // Don't cache
  });

  const appName = settings?.find(s => s.key === 'app-name')?.value || 'BOUTIQUE MANCER';
  const logoFromDb = settings?.find(s => s.key === 'app-logo')?.value;
  
  // Add cache-busting timestamp to logo URL to prevent caching issues
  const appLogo = logoFromDb 
    ? `${logoFromDb}${logoFromDb.includes('?') ? '&' : '?'}t=${dataUpdatedAt || logoKey}`
    : defaultLogo;

  // Update logo key when data updates
  useEffect(() => {
    if (dataUpdatedAt) {
      setLogoKey(dataUpdatedAt);
    }
  }, [dataUpdatedAt]);

  return {
    appName,
    appLogo,
    isLoading,
  };
};

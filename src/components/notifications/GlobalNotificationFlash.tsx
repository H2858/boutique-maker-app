import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bell, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const GlobalNotificationFlash = () => {
  const [showFlash, setShowFlash] = useState(false);
  const [flashNotification, setFlashNotification] = useState<{ title: string; message: string } | null>(null);
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);

  const { data: latestNotification } = useQuery({
    queryKey: ['latest-notification'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (latestNotification && latestNotification.id !== lastNotificationId) {
      if (lastNotificationId !== null) {
        setFlashNotification({
          title: latestNotification.title,
          message: latestNotification.message,
        });
        setShowFlash(true);
        
        setTimeout(() => {
          setShowFlash(false);
          setFlashNotification(null);
        }, 4000);
      }
      setLastNotificationId(latestNotification.id);
    }
  }, [latestNotification, lastNotificationId]);

  if (!showFlash || !flashNotification) return null;

  return (
    <>
      {/* Full screen flash overlay */}
      <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
        {/* Animated gradient sweep from top */}
        <div 
          className={cn(
            "absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent",
            "animate-notification-sweep"
          )}
        />
        
        {/* Side glows */}
        <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-primary/30 to-transparent animate-pulse-fast" />
        <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-l from-primary/30 to-transparent animate-pulse-fast" />
        
        {/* Top glow */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/20 to-transparent animate-glow-pulse" />
        
        {/* Sparkle particles */}
        <div className="absolute top-10 left-1/4 animate-float-up">
          <Sparkles className="h-4 w-4 text-primary/60" />
        </div>
        <div className="absolute top-20 right-1/4 animate-float-up" style={{ animationDelay: '0.5s' }}>
          <Sparkles className="h-3 w-3 text-accent/60" />
        </div>
        <div className="absolute top-16 left-1/2 animate-float-up" style={{ animationDelay: '1s' }}>
          <Sparkles className="h-5 w-5 text-primary/40" />
        </div>
      </div>

      {/* Notification toast */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] pointer-events-auto animate-notification-toast">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-accent rounded-2xl shadow-2xl shadow-primary/30 px-6 py-4 min-w-[280px] max-w-[90vw]">
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-fast" />
          
          <div className="relative flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
              <div className="relative bg-white/20 rounded-full p-2">
                <Bell className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white text-sm truncate">{flashNotification.title}</h4>
              <p className="text-white/80 text-xs truncate">{flashNotification.message}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobalNotificationFlash;

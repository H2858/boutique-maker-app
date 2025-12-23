import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bell, X, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollArea } from '@/components/ui/scroll-area';

const NotificationsButton = () => {
  const { dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const previousCountRef = useRef<number>(0);
  const [lastReadTime, setLastReadTime] = useState(() => {
    return localStorage.getItem('lastNotificationRead') || '1970-01-01T00:00:00.000Z';
  });

  const { data: notifications } = useQuery({
    queryKey: ['user-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000, // Refetch every 10 seconds for faster notification detection
  });

  const unreadCount = notifications?.filter(
    (n: any) => new Date(n.created_at) > new Date(lastReadTime)
  ).length || 0;

  // Trigger flash animation when new notification arrives
  useEffect(() => {
    if (unreadCount > previousCountRef.current && previousCountRef.current !== 0) {
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 2000);
    }
    previousCountRef.current = unreadCount;
  }, [unreadCount]);

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      const now = new Date().toISOString();
      localStorage.setItem('lastNotificationRead', now);
      setLastReadTime(now);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return date.toLocaleDateString('ar-SA');
  };

  return (
    <>
      {/* Flash notification overlay */}
      {showFlash && (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 animate-notification-flash">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer-horizontal" />
          </div>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg animate-slide-down-fade">
            <Bell className="h-4 w-4" />
            <span className="text-sm font-medium">إشعار جديد!</span>
          </div>
        </div>
      )}

      <Sheet open={isOpen} onOpenChange={handleOpen}>
        <SheetTrigger asChild>
          <button className="relative p-2.5 rounded-xl bg-secondary/80 hover:bg-secondary transition-all duration-300 group">
            <Bell className="h-5 w-5 text-foreground transition-transform group-hover:scale-110" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px] font-bold min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow-md animate-bounce-gentle">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        </SheetTrigger>
        <SheetContent side={dir === 'rtl' ? 'right' : 'left'} className="w-[92vw] sm:w-[420px] p-0 border-0 bg-background">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="relative p-5 bg-gradient-to-l from-primary/10 via-accent/5 to-transparent border-b border-border/50">
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle className="flex items-center gap-2 text-xl font-bold">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Bell className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span>الإشعارات</span>
                  </SheetTitle>
                  {unreadCount > 0 && (
                    <span className="bg-primary/15 text-primary text-sm font-semibold px-3 py-1 rounded-full">
                      {unreadCount} جديد
                    </span>
                  )}
                </div>
              </SheetHeader>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              {notifications && notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification: any, index: number) => {
                    const isNew = new Date(notification.created_at) > new Date(lastReadTime);
                    return (
                      <div 
                        key={notification.id}
                        className={`relative p-4 rounded-2xl border transition-all duration-300 overflow-hidden ${
                          isNew 
                            ? 'bg-gradient-to-l from-primary/10 to-transparent border-primary/30 shadow-sm' 
                            : 'bg-secondary/30 border-border/50 hover:bg-secondary/50'
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {isNew && (
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full" />
                        )}
                        <div className="relative">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground">{notification.title}</h4>
                                {isNew && (
                                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">{notification.message}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/30">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(notification.created_at)}
                            </span>
                            {isNew && (
                              <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                جديد
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                    <Bell className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                  <p className="text-muted-foreground font-medium">لا توجد إشعارات</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">ستظهر الإشعارات الجديدة هنا</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default NotificationsButton;
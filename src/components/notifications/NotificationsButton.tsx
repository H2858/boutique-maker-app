import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bell } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollArea } from '@/components/ui/scroll-area';

const NotificationsButton = () => {
  const { dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
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
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const unreadCount = notifications?.filter(
    (n: any) => new Date(n.created_at) > new Date(lastReadTime)
  ).length || 0;

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      const now = new Date().toISOString();
      localStorage.setItem('lastNotificationRead', now);
      setLastReadTime(now);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
          <Bell className="h-5 w-5 text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side={dir === 'rtl' ? 'right' : 'left'} className="w-[90vw] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-right">الإشعارات</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-100px)] mt-4">
          {notifications && notifications.length > 0 ? (
            <div className="space-y-3 pr-4">
              {notifications.map((notification: any) => {
                const isNew = new Date(notification.created_at) > new Date(lastReadTime);
                return (
                  <div 
                    key={notification.id}
                    className={`p-4 rounded-xl border transition-colors ${
                      isNew 
                        ? 'bg-primary/10 border-primary/30' 
                        : 'bg-secondary/50 border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-foreground">{notification.title}</h4>
                      {isNew && (
                        <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">
                          جديد
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{notification.message}</p>
                    <span className="text-xs text-muted-foreground mt-3 block">
                      {new Date(notification.created_at).toLocaleString('ar-SA')}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">لا توجد إشعارات</p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsButton;

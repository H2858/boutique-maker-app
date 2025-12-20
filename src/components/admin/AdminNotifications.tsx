import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Bell, Send, Trash2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminNotifications = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const sendNotificationMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .insert({ title, message });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['user-notifications'] });
      setTitle('');
      setMessage('');
      toast.success('تم إرسال الإشعار بنجاح');
    },
    onError: (error) => {
      console.error('Error sending notification:', error);
      toast.error('حدث خطأ أثناء إرسال الإشعار');
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['user-notifications'] });
      toast.success('تم حذف الإشعار');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء الحذف');
    },
  });

  const handleSend = () => {
    if (!title.trim() || !message.trim()) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }
    sendNotificationMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        إدارة الإشعارات
      </h2>

      {/* Send New Notification */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">إرسال إشعار جديد</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              عنوان الإشعار
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أدخل عنوان الإشعار..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              نص الإشعار
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="أدخل نص الإشعار..."
              rows={4}
            />
          </div>
          
          <Button 
            onClick={handleSend}
            disabled={sendNotificationMutation.isPending}
            className="gradient-primary w-full"
          >
            {sendNotificationMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Send className="h-5 w-5 mr-2" />
            )}
            إرسال الإشعار
          </Button>
        </div>
      </div>

      {/* Previous Notifications */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">الإشعارات السابقة</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification: any) => (
              <div 
                key={notification.id}
                className="bg-secondary/50 rounded-lg p-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{notification.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  <span className="text-xs text-muted-foreground mt-2 block">
                    {new Date(notification.created_at).toLocaleString('ar-SA')}
                  </span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteNotificationMutation.mutate(notification.id)}
                  disabled={deleteNotificationMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            لا توجد إشعارات سابقة
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';

const AdminOrders = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [deletingOrder, setDeletingOrder] = useState<any>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, products(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success(t('delete'));
      setDeletingOrder(null);
    },
    onError: () => toast.error(t('error')),
  });

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">{t('orders')}</h2>
      
      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order.id} className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">{order.products?.name}</h3>
                <p className="text-sm text-muted-foreground">{t('customerName')}: {order.customer_name}</p>
                <p className="text-sm text-muted-foreground">{t('customerPhone')}: {order.customer_phone}</p>
                <p className="text-sm text-muted-foreground">{t('customerLocation')}: {order.customer_location}</p>
                {order.selected_colors?.length > 0 && (
                  <p className="text-sm text-muted-foreground">{t('colors')}: {order.selected_colors.join(', ')}</p>
                )}
                {order.selected_sizes?.length > 0 && (
                  <p className="text-sm text-muted-foreground">{t('sizes')}: {order.selected_sizes.join(', ')}</p>
                )}
                {order.notes && <p className="text-sm text-muted-foreground">{t('notes')}: {order.notes}</p>}
                <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => setDeletingOrder(order)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {orders?.length === 0 && (
          <p className="text-center text-muted-foreground py-12">{t('noProducts')}</p>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deletingOrder}
        onClose={() => setDeletingOrder(null)}
        onConfirm={() => deleteMutation.mutate(deletingOrder?.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminOrders;

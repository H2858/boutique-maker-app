import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2, Eye, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';
import ProductDetailsModal from '@/components/product/ProductDetailsModal';

const AdminOrders = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [deletingOrder, setDeletingOrder] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, products(*, product_images(*), product_colors(*), product_sizes(*))')
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

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('تم حذف جميع الطلبات');
      setShowDeleteAllModal(false);
    },
    onError: () => toast.error(t('error')),
  });

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t('orders')}</h2>
        {orders && orders.length > 0 && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setShowDeleteAllModal(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            حذف الكل
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order.id} className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-foreground">{order.products?.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{t('customerName')}: {order.customer_name}</p>
                <p className="text-sm text-muted-foreground">{t('customerPhone')}: {order.customer_phone}</p>
                <p className="text-sm text-muted-foreground">{t('customerLocation')}: {order.customer_location}</p>
                {order.quantity && order.quantity > 1 && (
                  <p className="text-sm text-muted-foreground">{t('quantity')}: {order.quantity}</p>
                )}
                {order.selected_colors?.length > 0 && (
                  <p className="text-sm text-muted-foreground">{t('colors')}: {order.selected_colors.join(', ')}</p>
                )}
                {order.selected_sizes?.length > 0 && (
                  <p className="text-sm text-muted-foreground">{t('sizes')}: {order.selected_sizes.join(', ')}</p>
                )}
                {order.notes && <p className="text-sm text-muted-foreground">{t('notes')}: {order.notes}</p>}
                <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setViewingProduct(order.products)}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  <span className="text-xs">{t('viewProduct')}</span>
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setDeletingOrder(order)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
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

      <DeleteConfirmModal
        isOpen={showDeleteAllModal}
        onClose={() => setShowDeleteAllModal(false)}
        onConfirm={() => deleteAllMutation.mutate()}
        isLoading={deleteAllMutation.isPending}
        title="حذف جميع الطلبات"
        description="هل أنت متأكد من حذف جميع الطلبات؟ لا يمكن التراجع عن هذا الإجراء."
      />

      <ProductDetailsModal
        product={viewingProduct}
        isOpen={!!viewingProduct}
        onClose={() => setViewingProduct(null)}
      />
    </div>
  );
};

export default AdminOrders;
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Loader2, CheckSquare, Square } from 'lucide-react';
import { toast } from 'sonner';
import ProductFormModal from './ProductFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { Checkbox } from '@/components/ui/checkbox';

const AdminProducts = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deletingProduct, setDeletingProduct] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBulkDelete, setShowBulkDelete] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*), product_colors(*), product_sizes(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success(t('delete'));
      setDeletingProduct(null);
    },
    onError: () => toast.error(t('error')),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (productIds: string[]) => {
      const { error } = await supabase.from('products').delete().in('id', productIds);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success(`تم حذف ${selectedProducts.length} منتج`);
      setSelectedProducts([]);
      setShowBulkDelete(false);
    },
    onError: () => toast.error(t('error')),
  });

  const toggleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (products) {
      if (selectedProducts.length === products.length) {
        setSelectedProducts([]);
      } else {
        setSelectedProducts(products.map(p => p.id));
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t('products')}</h2>
        <div className="flex gap-2">
          {selectedProducts.length > 0 && (
            <Button variant="destructive" onClick={() => setShowBulkDelete(true)}>
              <Trash2 className="h-5 w-5 mr-2" />
              حذف ({selectedProducts.length})
            </Button>
          )}
          <Button onClick={() => { setEditingProduct(null); setShowForm(true); }} className="gradient-primary">
            <Plus className="h-5 w-5 mr-2" />
            {t('addProduct')}
          </Button>
        </div>
      </div>

      {/* Select All */}
      {products && products.length > 0 && (
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSelectAll}
            className="flex items-center gap-2"
          >
            {selectedProducts.length === products.length ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            {selectedProducts.length === products.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <div key={product.id} className="bg-card rounded-xl p-4 shadow-card relative">
            {/* Checkbox */}
            <div className="absolute top-2 left-2 z-10">
              <Checkbox
                checked={selectedProducts.includes(product.id)}
                onCheckedChange={() => toggleSelectProduct(product.id)}
              />
            </div>

            <div className="aspect-square rounded-lg overflow-hidden bg-secondary mb-3">
              {product.product_images?.[0] ? (
                <img src={product.product_images[0].image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
              )}
            </div>
            <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
            <p className="text-primary font-bold">{product.discount_price || product.price} د.ج</p>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-1 mt-2">
              {product.is_special_offer && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-accent text-accent-foreground">عرض خاص</span>
              )}
              {product.expires_at && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-warning text-warning-foreground">
                  ينتهي: {new Date(product.expires_at).toLocaleDateString('ar')}
                </span>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => { setEditingProduct(product); setShowForm(true); }}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setDeletingProduct(product)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ProductFormModal isOpen={showForm} onClose={() => setShowForm(false)} product={editingProduct} />
      
      {/* Single Delete */}
      <DeleteConfirmModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={() => deleteMutation.mutate(deletingProduct?.id)}
        isLoading={deleteMutation.isPending}
      />

      {/* Bulk Delete */}
      <DeleteConfirmModal
        isOpen={showBulkDelete}
        onClose={() => setShowBulkDelete(false)}
        onConfirm={() => bulkDeleteMutation.mutate(selectedProducts)}
        isLoading={bulkDeleteMutation.isPending}
      />
    </div>
  );
};

export default AdminProducts;
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/product/ProductCard';
import ProductDetailsModal from '@/components/product/ProductDetailsModal';
import { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';

const FlashDeals = () => {
  const { t, dir } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['flash-deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*), product_colors(*), product_sizes(*)')
        .not('discount_price', 'is', null)
        .order('created_at', { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="px-4 py-4" dir={dir}>
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-full px-3 py-4" dir={dir}>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full gradient-primary">
          <Zap className="h-4 w-4 text-primary-foreground fill-primary-foreground flex-shrink-0" />
          <span className="text-sm font-bold text-primary-foreground">{t('flashDeals')}</span>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3">
        {products.map((product, index) => (
          <div 
            key={product.id}
            className="w-[140px] flex-shrink-0 animate-fade-in-up cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => setSelectedProduct(product)}
          >
            <ProductCard product={product} variant="compact" />
          </div>
        ))}
      </div>

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
};

export default FlashDeals;

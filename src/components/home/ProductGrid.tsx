import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/product/ProductCard';
import ProductDetailsModal from '@/components/product/ProductDetailsModal';
import { Loader2 } from 'lucide-react';

interface ProductGridProps {
  title?: string;
}

const ProductGrid = ({ title }: ProductGridProps) => {
  const { t, dir } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*), product_colors(*), product_sizes(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="px-4 py-6 flex justify-center" dir={dir}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="px-4 py-6 text-center" dir={dir}>
        <p className="text-muted-foreground">{t('noProducts')}</p>
      </section>
    );
  }

  return (
    <section className="px-4 py-6" dir={dir}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">{title || t('featuredProducts')}</h2>
        <button className="text-sm text-primary font-medium hover:underline">
          {t('viewAll')}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {products.map((product, index) => (
          <div 
            key={product.id}
            className="animate-fade-in-up cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => setSelectedProduct(product)}
          >
            <ProductCard product={product} />
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

export default ProductGrid;

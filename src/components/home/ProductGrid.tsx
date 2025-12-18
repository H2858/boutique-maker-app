import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/product/ProductCard';
import ProductDetailsModal from '@/components/product/ProductDetailsModal';
import { Loader2, X } from 'lucide-react';

interface ProductGridProps {
  title?: string;
  categoryFilter?: string | null;
  searchQuery?: string;
  onClearFilter?: () => void;
}

const ProductGrid = ({ title, categoryFilter, searchQuery, onClearFilter }: ProductGridProps) => {
  const { t, dir, language } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', categoryFilter, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, product_images(*), product_colors(*), product_sizes(*)');
      
      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }
      
      if (searchQuery && searchQuery.trim()) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      const { data, error } = await query.order('name', { ascending: true });
      if (error) throw error;
      
      // Sort alphabetically based on current language
      return data?.sort((a, b) => {
        return a.name.localeCompare(b.name, language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en');
      });
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
        {categoryFilter && onClearFilter && (
          <button 
            onClick={onClearFilter}
            className="mt-4 text-primary hover:underline"
          >
            {t('viewAll')}
          </button>
        )}
      </section>
    );
  }

  const getCategoryLabel = (cat: string) => {
    const labels: { [key: string]: string } = {
      'men': t('categoryMen'),
      'women': t('categoryWomen'),
      'kids': t('categoryKids'),
      'accessories': t('categoryAccessories'),
    };
    return labels[cat] || cat;
  };

  return (
    <section className="w-full max-w-full px-3 py-4" dir={dir}>
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <h2 className="text-base font-bold text-foreground break-words">
            {categoryFilter ? getCategoryLabel(categoryFilter) : (title || t('featuredProducts'))}
          </h2>
          {categoryFilter && onClearFilter && (
            <button 
              onClick={onClearFilter}
              className="p-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {!categoryFilter && (
          <button className="text-sm text-primary font-medium hover:underline flex-shrink-0">
            {t('viewAll')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        {products.map((product, index) => (
          <div 
            key={product.id}
            className="animate-fade-in-up cursor-pointer w-full"
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
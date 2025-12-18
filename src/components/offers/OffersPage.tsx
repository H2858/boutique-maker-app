import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/product/ProductCard';
import ProductDetailsModal from '@/components/product/ProductDetailsModal';
import { Loader2, Percent, Timer } from 'lucide-react';

const OffersPage = () => {
  const { t, dir } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data: specialOffers, isLoading } = useQuery({
    queryKey: ['special-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*), product_colors(*), product_sizes(*)')
        .or('is_special_offer.eq.true,discount_price.not.is.null')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6" dir={dir}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl gradient-primary">
          <Percent className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{t('offers')}</h1>
          <p className="text-sm text-muted-foreground">{t('specialOffersDescription')}</p>
        </div>
      </div>

      {/* Offers Grid */}
      {specialOffers && specialOffers.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {specialOffers.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="cursor-pointer"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <div className="bg-secondary/50 rounded-full p-6 mb-4">
            <Timer className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">{t('noOffers')}</h2>
          <p className="text-muted-foreground text-center">{t('checkBackLater')}</p>
        </div>
      )}

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default OffersPage;
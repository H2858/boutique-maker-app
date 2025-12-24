import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/product/ProductCard';
import ProductDetailsModal from '@/components/product/ProductDetailsModal';
import { Loader2, Percent, Timer, Flame, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          <Loader2 className="h-10 w-10 animate-spin text-primary relative" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6" dir={dir}>
      {/* Header Banner - Modern Design */}
      <div className="relative overflow-hidden rounded-3xl mb-6 bg-gradient-to-br from-primary via-accent to-pink-600 p-6 min-h-[140px]">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{ 
            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)'
          }} />
          <div className="absolute inset-0" style={{ 
            background: 'radial-gradient(circle at 70% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)'
          }} />
        </div>
        
        {/* Floating icons */}
        <div className="absolute top-4 right-4 animate-bounce-gentle">
          <Sparkles className="h-6 w-6 text-white/40" />
        </div>
        <div className="absolute bottom-4 left-4 animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>
          <Flame className="h-5 w-5 text-white/30" />
        </div>
        
        {/* Main content - centered */}
        <div className="relative flex items-center justify-center gap-4 pt-8">
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-2xl blur-lg animate-pulse" />
            <div className="relative p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Percent className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">{t('offers')}</h1>
            <p className="text-white/80 text-sm mt-1">{t('specialOffersDescription')}</p>
          </div>
        </div>
        
      {/* Offer count badge - positioned properly */}
      {specialOffers && specialOffers.length > 0 && (
        <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/25 backdrop-blur-md border border-white/30">
          <span className="text-white font-bold text-lg">{specialOffers.length}</span>
          <span className="text-white/90 text-sm">{t('offers')}</span>
        </div>
      )}
        
        {/* Decorative elements */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
      </div>

      {/* Offers Grid */}
      {specialOffers && specialOffers.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {specialOffers.map((product, index) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <div className="relative">
            <div className="absolute inset-0 bg-muted rounded-full animate-pulse" />
            <div className="relative bg-secondary/50 rounded-full p-8">
              <Timer className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground mt-6 mb-2">{t('noOffers')}</h2>
          <p className="text-muted-foreground text-center max-w-xs">{t('checkBackLater')}</p>
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

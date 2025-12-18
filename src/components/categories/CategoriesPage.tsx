import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/product/ProductCard';
import ProductDetailsModal from '@/components/product/ProductDetailsModal';
import { Loader2, User, Users, Baby, Watch, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const CategoriesPage = () => {
  const { t, dir, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const categoryConfig = [
    { 
      id: 'men', 
      icon: User, 
      label: t('categoryMen'),
      bg: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      id: 'women', 
      icon: Users, 
      label: t('categoryWomen'),
      bg: 'from-pink-500 to-rose-600',
      lightBg: 'bg-pink-100 dark:bg-pink-900/30',
      iconColor: 'text-pink-600 dark:text-pink-400'
    },
    { 
      id: 'kids', 
      icon: Baby, 
      label: t('categoryKids'),
      bg: 'from-cyan-500 to-teal-600',
      lightBg: 'bg-cyan-100 dark:bg-cyan-900/30',
      iconColor: 'text-cyan-600 dark:text-cyan-400'
    },
    { 
      id: 'accessories', 
      icon: Watch, 
      label: t('categoryAccessories'),
      bg: 'from-amber-500 to-orange-600',
      lightBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400'
    },
  ];

  const { data: products, isLoading } = useQuery({
    queryKey: ['category-products', selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*), product_colors(*), product_sizes(*)')
        .eq('category', selectedCategory)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCategory,
  });

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  if (selectedCategory) {
    const currentCat = categoryConfig.find(c => c.id === selectedCategory);
    
    return (
      <div className="px-4 py-6" dir={dir}>
        {/* Back button and title */}
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 mb-6 text-primary font-medium"
        >
          {dir === 'rtl' ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
          <span>{t('back')}</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          {currentCat && (
            <div className={cn("p-3 rounded-2xl", currentCat.lightBg)}>
              <currentCat.icon className={cn("h-6 w-6", currentCat.iconColor)} />
            </div>
          )}
          <h1 className="text-xl font-bold text-foreground">{currentCat?.label}</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
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
          <div className="text-center py-12 text-muted-foreground">
            {t('noProducts')}
          </div>
        )}

        <ProductDetailsModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-6" dir={dir}>
      <h1 className="text-2xl font-bold text-foreground mb-6">{t('categories')}</h1>

      <div className="grid grid-cols-2 gap-4">
        {categoryConfig.map((category, index) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br text-white",
                "transition-all duration-300 hover:scale-105 hover:shadow-xl",
                "animate-fade-in-up",
                category.bg
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative z-10">
                <Icon className="h-10 w-10 mb-3 opacity-90" />
                <h3 className="text-lg font-bold">{category.label}</h3>
                <div className="flex items-center gap-1 mt-2 text-sm opacity-80">
                  <span>{t('viewAll')}</span>
                  <ArrowIcon className="h-4 w-4" />
                </div>
              </div>
              
              {/* Decorative circle */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-white/5" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesPage;
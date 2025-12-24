import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/product/ProductCard';
import ProductDetailsModal from '@/components/product/ProductDetailsModal';
import { Loader2, User, Users, Baby, Watch, ArrowRight, ArrowLeft, Sparkles, Grid3X3, ChevronRight } from 'lucide-react';
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
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-500/20'
    },
    { 
      id: 'women', 
      icon: Users, 
      label: t('categoryWomen'),
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-500/10',
      iconColor: 'text-pink-500',
      borderColor: 'border-pink-500/20'
    },
    { 
      id: 'kids', 
      icon: Baby, 
      label: t('categoryKids'),
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      borderColor: 'border-emerald-500/20'
    },
    { 
      id: 'accessories', 
      icon: Watch, 
      label: t('categoryAccessories'),
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      borderColor: 'border-amber-500/20'
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
        {/* Back button */}
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 mb-6 text-primary font-semibold group"
        >
          <span className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            {dir === 'rtl' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          </span>
          <span>{t('back')}</span>
        </button>

        {/* Category header */}
        <div className={cn(
          "relative overflow-hidden rounded-2xl p-6 mb-6 bg-gradient-to-br",
          currentCat?.color
        )}>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{ 
              background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)'
            }} />
          </div>
          <div className="relative flex items-center gap-4">
            {currentCat && (
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                <currentCat.icon className="h-8 w-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">{currentCat?.label}</h1>
              <p className="text-white/80 text-sm mt-1">{products?.length || 0} {t('products')}</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              <Loader2 className="h-10 w-10 animate-spin text-primary relative" />
            </div>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product, index) => (
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
            <div className="bg-secondary/50 rounded-full p-6 mb-4">
              <Sparkles className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center">{t('noProducts')}</p>
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
      {/* Modern Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl" />
          <div className="relative p-3 rounded-2xl gradient-primary">
            <Grid3X3 className="h-6 w-6 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('categories')}</h1>
          <p className="text-sm text-muted-foreground">{t('browseCategories')}</p>
        </div>
      </div>

      {/* Modern Categories List */}
      <div className="space-y-3">
        {categoryConfig.map((category, index) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "w-full relative overflow-hidden rounded-2xl p-4",
                "bg-card border transition-all duration-300",
                "hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]",
                "animate-fade-in-up flex items-center gap-4",
                category.borderColor
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Icon Container */}
              <div className={cn(
                "relative flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center",
                category.bgColor
              )}>
                <Icon className={cn("h-7 w-7", category.iconColor)} />
              </div>
              
              {/* Text Content */}
              <div className="flex-1 text-start">
                <h3 className="text-lg font-bold text-foreground">{category.label}</h3>
                <p className="text-sm text-muted-foreground">{t('viewAll')}</p>
              </div>
              
              {/* Arrow */}
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                "bg-secondary/50"
              )}>
                <ChevronRight className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform",
                  dir === 'rtl' && "rotate-180"
                )} />
              </div>

              {/* Gradient line on the side */}
              <div className={cn(
                "absolute top-2 bottom-2 w-1 rounded-full bg-gradient-to-b",
                category.color,
                dir === 'rtl' ? 'right-0' : 'left-0'
              )} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesPage;
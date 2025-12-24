import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/product/ProductCard';
import ProductDetailsModal from '@/components/product/ProductDetailsModal';
import { Loader2, User, Users, Baby, Watch, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
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
      gradient: 'from-blue-500 via-blue-600 to-indigo-700',
      iconBg: 'bg-white/20',
      pattern: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)'
    },
    { 
      id: 'women', 
      icon: Users, 
      label: t('categoryWomen'),
      gradient: 'from-pink-500 via-rose-500 to-fuchsia-600',
      iconBg: 'bg-white/20',
      pattern: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)'
    },
    { 
      id: 'kids', 
      icon: Baby, 
      label: t('categoryKids'),
      gradient: 'from-cyan-400 via-teal-500 to-emerald-600',
      iconBg: 'bg-white/20',
      pattern: 'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)'
    },
    { 
      id: 'accessories', 
      icon: Watch, 
      label: t('categoryAccessories'),
      gradient: 'from-amber-400 via-orange-500 to-red-500',
      iconBg: 'bg-white/20',
      pattern: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)'
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
          currentCat?.gradient
        )}>
          <div 
            className="absolute inset-0 opacity-50"
            style={{ background: currentCat?.pattern }}
          />
          <div className="relative flex items-center gap-4">
            {currentCat && (
              <div className={cn("p-4 rounded-2xl", currentCat.iconBg)}>
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
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl" />
          <div className="relative p-3 rounded-2xl gradient-primary">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('categories')}</h1>
          <p className="text-sm text-muted-foreground">{t('browseCategories')}</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 gap-4">
        {categoryConfig.map((category, index) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br text-white",
                "transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl",
                "animate-fade-in-up active:scale-95",
                "min-h-[140px] flex flex-col justify-between",
                category.gradient
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Pattern overlay */}
              <div 
                className="absolute inset-0 opacity-40"
                style={{ background: category.pattern }}
              />
              
              {/* Icon */}
              <div className={cn("relative p-3 rounded-2xl w-fit", category.iconBg)}>
                <Icon className="h-7 w-7" />
              </div>
              
              {/* Label */}
              <div className="relative mt-auto">
                <h3 className="text-lg font-bold mb-1">{category.label}</h3>
                <div className="flex items-center gap-1 text-sm text-white/80">
                  <span>{t('viewAll')}</span>
                  <ArrowIcon className="h-4 w-4" />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
              <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-white/5" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesPage;

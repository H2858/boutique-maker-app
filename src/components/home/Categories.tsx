import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Shirt, Baby, Watch, Gem, Sparkles, Smartphone, Home, ShoppingBag, Footprints, User } from 'lucide-react';

interface CategoriesProps {
  onCategorySelect?: (category: string) => void;
}

const Categories = ({ onCategorySelect }: CategoriesProps) => {
  const { t, dir } = useLanguage();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .order('category');
      if (error) throw error;
      const unique = [...new Set(data?.map(p => p.category))];
      return unique;
    },
  });

  const categoryConfig: { [key: string]: { bg: string; icon: React.ReactNode; label: string } } = {
    'men': { bg: 'bg-blue-100 dark:bg-blue-900/30', icon: <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />, label: t('categoryMen') },
    'women': { bg: 'bg-pink-100 dark:bg-pink-900/30', icon: <Sparkles className="w-6 h-6 text-pink-600 dark:text-pink-400" />, label: t('categoryWomen') },
    'kids': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', icon: <Baby className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />, label: t('categoryKids') },
    'accessories': { bg: 'bg-amber-100 dark:bg-amber-900/30', icon: <Watch className="w-6 h-6 text-amber-600 dark:text-amber-400" />, label: t('categoryAccessories') },
    'shoes': { bg: 'bg-orange-100 dark:bg-orange-900/30', icon: <Footprints className="w-6 h-6 text-orange-600 dark:text-orange-400" />, label: 'أحذية' },
    'electronics': { bg: 'bg-slate-100 dark:bg-slate-900/30', icon: <Smartphone className="w-6 h-6 text-slate-600 dark:text-slate-400" />, label: 'إلكترونيات' },
    'home': { bg: 'bg-green-100 dark:bg-green-900/30', icon: <Home className="w-6 h-6 text-green-600 dark:text-green-400" />, label: 'منزل' },
  };

  const getConfig = (cat: string) => categoryConfig[cat] || { 
    bg: 'bg-secondary', 
    icon: <ShoppingBag className="w-6 h-6 text-muted-foreground" />, 
    label: cat 
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="px-4 py-6" dir={dir}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">{t('categories')}</h2>
        <button className="text-sm text-primary font-medium hover:underline">
          {t('viewAll')}
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {categories.map((category, index) => {
          const config = getConfig(category);
          return (
            <button
              key={category}
              onClick={() => onCategorySelect?.(category)}
              className="flex flex-col items-center gap-2 group animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-medium ${config.bg}`}>
                {config.icon}
              </div>
              <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                {config.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;
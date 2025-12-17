import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Categories = () => {
  const { t, dir } = useLanguage();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .order('category');
      if (error) throw error;
      // Get unique categories
      const unique = [...new Set(data?.map(p => p.category))];
      return unique;
    },
  });

  const categoryIcons: { [key: string]: { bg: string; emoji: string } } = {
    'ملابس': { bg: 'bg-pink-100 dark:bg-pink-900/30', emoji: '👕' },
    'أحذية': { bg: 'bg-amber-100 dark:bg-amber-900/30', emoji: '👟' },
    'ساعات': { bg: 'bg-blue-100 dark:bg-blue-900/30', emoji: '⌚' },
    'مجوهرات': { bg: 'bg-purple-100 dark:bg-purple-900/30', emoji: '💎' },
    'تجميل': { bg: 'bg-rose-100 dark:bg-rose-900/30', emoji: '✨' },
    'إلكترونيات': { bg: 'bg-slate-100 dark:bg-slate-900/30', emoji: '📱' },
    'منزل': { bg: 'bg-green-100 dark:bg-green-900/30', emoji: '🏠' },
    'أطفال': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', emoji: '👶' },
  };

  const getIcon = (cat: string) => categoryIcons[cat] || { bg: 'bg-secondary', emoji: '📦' };

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
          const icon = getIcon(category);
          return (
            <button
              key={category}
              className="flex flex-col items-center gap-2 group animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-medium ${icon.bg}`}>
                <span className="text-2xl">{icon.emoji}</span>
              </div>
              <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                {category}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;

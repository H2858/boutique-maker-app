import { useLanguage } from '@/contexts/LanguageContext';
import { Heart } from 'lucide-react';

const FavoritesPage = () => {
  const { t, dir } = useLanguage();

  return (
    <div className="px-4 py-6 flex flex-col items-center justify-center min-h-[60vh]" dir={dir}>
      <div className="bg-secondary/50 rounded-full p-6 mb-4">
        <Heart className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">{t('favorites')}</h2>
      <p className="text-muted-foreground text-center">{t('noProducts')}</p>
    </div>
  );
};

export default FavoritesPage;

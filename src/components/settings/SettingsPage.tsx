import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun, Globe, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SettingsPage = () => {
  const { language, setLanguage, t, dir } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const { data: copyrightSetting } = useQuery({
    queryKey: ['copyright-setting'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'copyright')
        .single();
      
      if (error) return 'app dv';
      return data?.value || 'app dv';
    },
  });

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'ar', name: t('arabic'), nativeName: 'العربية' },
    { code: 'en', name: t('english'), nativeName: 'English' },
    { code: 'fr', name: t('french'), nativeName: 'Français' },
    { code: 'ber', name: t('amazigh'), nativeName: 'ⵜⴰⵎⴰⵣⵉⵖⵜ' },
  ];

  return (
    <div className="px-4 py-6" dir={dir}>
      <h1 className="text-2xl font-bold text-foreground mb-6">{t('settings')}</h1>

      {/* Dark Mode */}
      <div className="bg-card rounded-2xl p-4 mb-4 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? (
              <Moon className="h-5 w-5 text-primary" />
            ) : (
              <Sun className="h-5 w-5 text-warning" />
            )}
            <span className="font-medium text-foreground">{t('darkMode')}</span>
          </div>
          <Switch checked={isDark} onCheckedChange={toggleTheme} />
        </div>
      </div>

      {/* Language Selection */}
      <div className="bg-card rounded-2xl p-4 mb-4 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5 text-primary" />
          <span className="font-medium text-foreground">{t('language')}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`p-3 rounded-xl text-center transition-all duration-200 ${
                language === lang.code
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              <span className="block font-medium">{lang.nativeName}</span>
              <span className="block text-xs opacity-80">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Admin Access */}
      <div className="bg-card rounded-2xl p-4 mb-6 shadow-card">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => navigate('/admin')}
        >
          <Lock className="h-4 w-4" />
          {t('adminPanel')}
        </Button>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>{t('copyright')} © {new Date().getFullYear()}</p>
        <p className="font-medium">{copyrightSetting || 'app dv'}</p>
      </div>
    </div>
  );
};

export default SettingsPage;

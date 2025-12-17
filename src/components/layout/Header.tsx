import { Search } from "lucide-react";
import defaultLogo from "@/assets/logo.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const { t, dir } = useLanguage();

  const { data: logoSetting } = useQuery({
    queryKey: ['app-logo-setting'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'app-logo')
        .maybeSingle();
      if (error) throw error;
      return data?.value || '';
    },
  });

  const logoUrl = logoSetting || defaultLogo;
  const showLogo = logoSetting !== '' || !logoSetting;

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-lg border-b border-border/50">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          {(logoSetting === undefined || logoSetting === null || logoSetting !== '') && (
            <img 
              src={logoSetting || defaultLogo} 
              alt="Boutique Mancer" 
              className="h-10 w-auto object-contain" 
            />
          )}
          <span className="hidden sm:block text-lg font-bold text-gradient">
            BOUTIQUE MANCER
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
            <input
              type="search"
              placeholder={t('searchProducts')}
              className={`w-full h-10 ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'} rounded-xl bg-secondary border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all`}
              dir={dir}
            />
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
          <input
            type="search"
            placeholder={t('searchProducts')}
            className={`w-full h-10 ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'} rounded-xl bg-secondary border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all`}
            dir={dir}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
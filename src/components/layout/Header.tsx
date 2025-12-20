import { Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppSettings } from "@/hooks/useAppSettings";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

const Header = ({ onSearch, searchQuery = "" }: HeaderProps) => {
  const { t, dir } = useLanguage();
  const { appName, appLogo } = useAppSettings();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  const clearSearch = () => {
    onSearch?.("");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-lg border-b border-border/50">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img 
            src={appLogo} 
            alt={appName} 
            className="h-10 w-auto object-contain" 
          />
          <span className="hidden sm:block text-lg font-bold text-gradient">
            {appName}
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
            <input
              type="search"
              placeholder={t('searchProducts')}
              value={searchQuery}
              onChange={handleSearchChange}
              className={`w-full h-10 ${dir === 'rtl' ? 'pr-10 pl-10' : 'pl-10 pr-10'} rounded-xl bg-secondary border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all`}
              dir={dir}
            />
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted-foreground/20 flex items-center justify-center hover:bg-muted-foreground/30 transition-colors`}
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
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
            value={searchQuery}
            onChange={handleSearchChange}
            className={`w-full h-10 ${dir === 'rtl' ? 'pr-10 pl-10' : 'pl-10 pr-10'} rounded-xl bg-secondary border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all`}
            dir={dir}
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted-foreground/20 flex items-center justify-center hover:bg-muted-foreground/30 transition-colors`}
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
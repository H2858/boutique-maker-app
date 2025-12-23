import { Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppSettings } from "@/hooks/useAppSettings";
import NotificationsButton from "@/components/notifications/NotificationsButton";

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
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
            <img 
              src={appLogo} 
              alt={appName} 
              className="relative h-10 w-auto object-contain" 
            />
          </div>
          <span className="hidden sm:block text-lg font-bold text-gradient">
            {appName}
          </span>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-sm group-focus-within:bg-primary/10 transition-colors" />
            <Search className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors`} />
            <input
              type="search"
              placeholder={t('searchProducts')}
              value={searchQuery}
              onChange={handleSearchChange}
              className={`relative w-full h-11 ${dir === 'rtl' ? 'pr-11 pl-11' : 'pl-11 pr-11'} rounded-2xl bg-secondary/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all`}
              dir={dir}
            />
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-muted-foreground/20 flex items-center justify-center hover:bg-muted-foreground/30 transition-colors`}
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications Button */}
        <NotificationsButton />
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-xl blur-sm group-focus-within:bg-primary/10 transition-colors" />
          <Search className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors`} />
          <input
            type="search"
            placeholder={t('searchProducts')}
            value={searchQuery}
            onChange={handleSearchChange}
            className={`relative w-full h-11 ${dir === 'rtl' ? 'pr-11 pl-11' : 'pl-11 pr-11'} rounded-xl bg-secondary/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all`}
            dir={dir}
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-muted-foreground/20 flex items-center justify-center hover:bg-muted-foreground/30 transition-colors`}
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

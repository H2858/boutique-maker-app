import { Search, ShoppingCart, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
  onMenuClick?: () => void;
}

const Header = ({ cartCount = 0, onCartClick, onMenuClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-lg border-b border-border/50">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <img src={logo} alt="Boutique Mancer" className="h-10 w-auto object-contain" />
          <span className="hidden sm:block text-lg font-bold text-gradient">
            BOUTIQUE MANCER
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="ابحث عن منتجات..."
              className="w-full h-10 pr-4 pl-10 rounded-xl bg-secondary border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              dir="rtl"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="icon" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">
              3
            </span>
          </Button>
          
          <Button variant="icon" size="icon" className="relative" onClick={onCartClick}>
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center animate-scale-in">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="ابحث عن منتجات..."
            className="w-full h-10 pr-10 pl-4 rounded-xl bg-secondary border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            dir="rtl"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

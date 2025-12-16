import { Home, Grid3X3, Heart, User, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  badge?: number;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const navItems: { id: string; icon: React.ElementType; label: string; badge?: number }[] = [
    { id: "home", icon: Home, label: "الرئيسية" },
    { id: "categories", icon: Grid3X3, label: "الأقسام" },
    { id: "orders", icon: ShoppingBag, label: "طلباتي", badge: 2 },
    { id: "favorites", icon: Heart, label: "المفضلة" },
    { id: "profile", icon: User, label: "حسابي" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border/50 pb-safe animate-slide-in-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-200",
                  isActive && "bg-primary/10"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-all duration-200",
                    isActive && "scale-110"
                  )} />
                </div>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all duration-200",
                isActive && "font-bold"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

import { Home, Grid3X3, Sparkles, Tag, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const { t } = useLanguage();
  
  const navItems = [
    { id: "home", icon: Home, label: t('home') },
    { id: "categories", icon: Grid3X3, label: t('categories') },
    { id: "newArrivals", icon: Sparkles, label: t('newArrivals') },
    { id: "offers", icon: Tag, label: t('offers') },
    { id: "settings", icon: Settings, label: t('settings') },
  ];

  const centerIndex = 2;

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50" 
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
    >
      {/* Glass morphism background */}
      <div className="relative mx-3 mb-2">
        <div className="absolute inset-0 bg-card/90 backdrop-blur-xl rounded-2xl shadow-lg border border-border/50" />
        
        {/* Floating center button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-10">
          <button
            onClick={() => onTabChange(navItems[centerIndex].id)}
            className={cn(
              "relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300",
              activeTab === navItems[centerIndex].id 
                ? "bg-gradient-to-br from-primary via-primary to-accent scale-105" 
                : "bg-gradient-to-br from-primary to-primary-glow hover:scale-105"
            )}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-lg -z-10" />
            {(() => {
              const Icon = navItems[centerIndex].icon;
              return <Icon className="h-6 w-6 text-primary-foreground" />;
            })()}
          </button>
          {/* Label below button */}
          <span className={cn(
            "absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-semibold whitespace-nowrap transition-all duration-200",
            activeTab === navItems[centerIndex].id ? "text-primary" : "text-muted-foreground"
          )}>
            {navItems[centerIndex].label}
          </span>
        </div>

        {/* Navigation items */}
        <div className="relative flex items-center justify-around h-16 px-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isCenter = index === centerIndex;
            
            if (isCenter) {
              return <div key={item.id} className="w-16" />;
            }
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-16 py-2 transition-all duration-300 rounded-xl",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                  isActive && "bg-primary/10"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive && "scale-110"
                  )} />
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-all duration-200",
                  isActive && "font-semibold"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
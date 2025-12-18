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

  // Center item index (index 2 for 5 items)
  const centerIndex = 2;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe animate-slide-in-bottom">
      {/* Floating center button - positioned above the nav bar */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[70px] z-20">
        <button
          onClick={() => onTabChange(navItems[centerIndex].id)}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 border-4 border-background",
            activeTab === navItems[centerIndex].id 
              ? "gradient-primary scale-110 shadow-2xl" 
              : "bg-primary hover:scale-105"
          )}
        >
          {(() => {
            const Icon = navItems[centerIndex].icon;
            return <Icon className="h-7 w-7 text-primary-foreground" />;
          })()}
        </button>
      </div>

      {/* Background bar */}
      <div className="relative bg-card rounded-t-3xl shadow-lg">

        {/* Navigation items */}
        <div className="flex items-center justify-around h-[70px] px-4">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isCenter = index === centerIndex;
            
            // Spacer for center button
            if (isCenter) {
              return <div key={item.id} className="w-16" />;
            }
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-16 py-2 transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive && "scale-110"
                )} />
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
      </div>
    </nav>
  );
};

export default BottomNav;
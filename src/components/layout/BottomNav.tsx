import { Home, Grid3X3, Percent, Settings } from "lucide-react";
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
    { id: "offers", icon: Percent, label: t('offers') },
    { id: "settings", icon: Settings, label: t('settings') },
  ];

  // Find middle index for the floating button
  const middleIndex = Math.floor(navItems.length / 2);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe animate-slide-in-bottom">
      {/* Background with curved notch */}
      <div className="relative">
        {/* SVG curved background */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          height="80"
          viewBox="0 0 400 80"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 L150,20 C160,20 170,0 200,0 C230,0 240,20 250,20 L400,20 L400,80 L0,80 Z"
            className="fill-card"
          />
        </svg>
        
        {/* Floating center button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-10">
          <button
            onClick={() => onTabChange(navItems[middleIndex].id)}
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
              activeTab === navItems[middleIndex].id 
                ? "gradient-primary scale-110" 
                : "bg-primary hover:scale-105"
            )}
          >
            {(() => {
              const Icon = navItems[middleIndex].icon;
              return <Icon className="h-6 w-6 text-primary-foreground" />;
            })()}
          </button>
        </div>

        {/* Navigation items */}
        <div className="relative flex items-end justify-around h-16 px-4 pt-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isCenter = index === middleIndex;
            
            // Skip rendering center item as regular button (it's the floating one)
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
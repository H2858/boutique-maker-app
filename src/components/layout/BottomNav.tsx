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
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe animate-slide-in-bottom">
      {/* Background with curved notch */}
      <div className="relative">
        {/* SVG curved background with rounded corners */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          height="95"
          viewBox="0 0 500 95"
          preserveAspectRatio="none"
        >
          {/* Main rounded bar with notch */}
          <path
            d="M20,25 L190,25 Q210,25 220,5 Q230,-10 250,0 Q270,-10 280,5 Q290,25 310,25 L480,25 Q500,25 500,45 L500,75 Q500,95 480,95 L20,95 Q0,95 0,75 L0,45 Q0,25 20,25 Z"
            className="fill-card"
          />
        </svg>
        
        {/* Floating center button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5 z-10">
          <button
            onClick={() => onTabChange(navItems[centerIndex].id)}
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border-4 border-card",
              activeTab === navItems[centerIndex].id 
                ? "gradient-primary scale-110 shadow-xl" 
                : "bg-primary hover:scale-105"
            )}
          >
            {(() => {
              const Icon = navItems[centerIndex].icon;
              return <Icon className="h-6 w-6 text-primary-foreground" />;
            })()}
          </button>
          {/* Label below button */}
          <span className={cn(
            "absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-medium whitespace-nowrap transition-all duration-200",
            activeTab === navItems[centerIndex].id ? "text-primary font-bold" : "text-muted-foreground"
          )}>
            {navItems[centerIndex].label}
          </span>
        </div>

        {/* Navigation items */}
        <div className="relative flex items-end justify-around h-[80px] px-4 pt-3">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isCenter = index === centerIndex;
            
            if (isCenter) {
              return <div key={item.id} className="w-14" />;
            }
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 w-14 py-2 transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive && "scale-110"
                )} />
                <span className={cn(
                  "text-[9px] font-medium transition-all duration-200",
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
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/hooks/useAppSettings';

const Welcome = () => {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const { appName, appLogo } = useAppSettings();

  const handleGetStarted = () => {
    localStorage.setItem('hasVisited', 'true');
    navigate('/home');
  };

  // Split app name for styling
  const nameParts = appName.split(' ');
  const firstName = nameParts[0] || appName;
  const restName = nameParts.slice(1).join(' ');

  // Generate grid items - all orange with shimmer
  const gridItems = [
    { delay: 0 },
    { delay: 0.5 },
    { delay: 1 },
    { delay: 1.5 },
    { delay: 0.3 },
    { delay: 0.8 },
    { delay: 1.3 },
    { delay: 0.2 },
    { delay: 0.7 },
    { delay: 1.2 },
    { delay: 0.4 },
    { delay: 0.9 },
  ];

  return (
    <div 
      className="min-h-screen flex flex-col bg-background relative overflow-hidden"
      dir={dir}
    >
      {/* Background Grid - All Orange with Shimmer Animation */}
      <div className="absolute inset-0 grid grid-cols-3 gap-2 p-2">
        {gridItems.map((item, index) => (
          <div 
            key={index}
            className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 rounded-xl overflow-hidden shadow-lg shadow-orange-500/30"
            style={{ animationDelay: `${item.delay}s` }}
          >
            {/* Shimmer effect */}
            <div 
              className="absolute inset-0 animate-shimmer-down"
              style={{ animationDelay: `${item.delay}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-transparent" />
            </div>
            {/* Glow border */}
            <div className="absolute inset-0 rounded-xl border-2 border-orange-300/60" />
            {/* Pulse glow effect */}
            <div 
              className="absolute inset-0 animate-pulse-glow rounded-xl"
              style={{ animationDelay: `${item.delay + 0.5}s` }}
            />
          </div>
        ))}
      </div>

      {/* Logo at top center */}
      <div className="relative z-10 pt-10 flex justify-center">
        <div className="bg-background/90 backdrop-blur-md px-5 py-3 rounded-full flex items-center gap-3 shadow-xl border border-border/30">
          <img src={appLogo} alt="Logo" className="w-10 h-10 object-contain" />
          <span className="font-bold text-foreground text-base">{appName}</span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Card */}
      <div className="relative z-10 bg-background rounded-t-[2.5rem] pt-8 pb-10 px-6 shadow-2xl border-t border-border/20">
        {/* Welcome Text */}
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            {t('welcome')}
          </h1>
          <h2 className="text-2xl font-black">
            <span className="text-primary">{firstName}</span>
            {restName && <span className="text-foreground"> {restName}</span>}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
            {t('discoverProducts')}
          </p>
        </div>

        {/* Get Started Button */}
        <Button
          onClick={handleGetStarted}
          size="lg"
          className="w-full py-6 text-base font-bold rounded-full gradient-primary text-primary-foreground shadow-xl transition-all duration-300 active:scale-[0.98]"
        >
          {t('getStarted')}
        </Button>
        
        <p className="text-center text-[10px] text-muted-foreground mt-4">
          {t('agreeTerms')}
        </p>
      </div>
    </div>
  );
};

export default Welcome;

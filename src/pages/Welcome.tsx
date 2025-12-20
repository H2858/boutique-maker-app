import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Welcome = () => {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const { appName, appLogo, isLoading: isAppSettingsLoading } = useAppSettings();

  // Fetch welcome background settings
  const { data: welcomeSettings } = useQuery({
    queryKey: ['welcome-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['welcome-mode', 'welcome-media']);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const welcomeMode = welcomeSettings?.find(s => s.key === 'welcome-mode')?.value || 'default';
  const welcomeMedia = welcomeSettings?.find(s => s.key === 'welcome-media')?.value || '';

  const handleGetStarted = () => {
    localStorage.setItem('hasVisited', 'true');
    navigate('/home');
  };

  // Split app name for styling
  const nameParts = appName.split(' ');
  const firstName = nameParts[0] || appName;
  const restName = nameParts.slice(1).join(' ');

  // Generate asymmetric grid items - varied sizes and positions
  const gridItems = [
    { delay: 0, colSpan: 2, rowSpan: 1 },
    { delay: 0.5, colSpan: 1, rowSpan: 2 },
    { delay: 1, colSpan: 1, rowSpan: 1 },
    { delay: 1.5, colSpan: 1, rowSpan: 1 },
    { delay: 0.3, colSpan: 2, rowSpan: 1 },
    { delay: 0.8, colSpan: 1, rowSpan: 1 },
    { delay: 1.3, colSpan: 1, rowSpan: 2 },
    { delay: 0.2, colSpan: 2, rowSpan: 1 },
  ];

  const isVideo = welcomeMedia && (welcomeMedia.endsWith('.mp4') || welcomeMedia.endsWith('.webm') || welcomeMedia.endsWith('.mov'));

  return (
    <div 
      className="min-h-screen flex flex-col bg-background relative overflow-hidden"
      dir={dir}
    >
      {/* Background - Custom Media or Default Grid */}
      {welcomeMode === 'custom' && welcomeMedia ? (
        <div className="absolute inset-0">
          {isVideo ? (
            <video 
              src={welcomeMedia} 
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img 
              src={welcomeMedia} 
              alt="Welcome Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ) : (
        <div className="absolute inset-0 grid grid-cols-3 auto-rows-fr gap-2 p-2">
          {gridItems.map((item, index) => (
            <div 
              key={index}
              className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 rounded-xl overflow-hidden shadow-lg shadow-orange-500/30"
              style={{ 
                animationDelay: `${item.delay}s`,
                gridColumn: `span ${item.colSpan}`,
                gridRow: `span ${item.rowSpan}`,
              }}
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
      )}

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

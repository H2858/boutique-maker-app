import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

const Welcome = () => {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();

  const handleGetStarted = () => {
    localStorage.setItem('hasVisited', 'true');
    navigate('/home');
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-background relative overflow-hidden"
      dir={dir}
    >
      {/* Background Grid with Animated Elements */}
      <div className="absolute inset-0 grid grid-cols-3 gap-2 p-2 opacity-80">
        {/* Row 1 */}
        <div className="bg-gradient-to-br from-secondary to-secondary/60 rounded-xl aspect-[3/4]" />
        <div className="bg-gradient-to-br from-muted to-muted/60 rounded-xl row-span-2" />
        <div className="bg-gradient-to-br from-secondary/80 to-secondary/40 rounded-xl aspect-[3/4]" />
        
        {/* Row 2 */}
        <div className="relative bg-gradient-to-br from-primary to-accent rounded-xl aspect-[3/4] overflow-hidden">
          {/* Animated shimmer overlay */}
          <div className="absolute inset-0 animate-shimmer-down">
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-secondary/60 to-muted/60 rounded-xl aspect-[3/4]" />
        
        {/* Row 3 */}
        <div className="bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl aspect-[3/4]" />
        <div className="relative bg-gradient-to-br from-accent to-primary rounded-xl row-span-2 overflow-hidden">
          {/* Animated shimmer overlay with delay */}
          <div className="absolute inset-0 animate-shimmer-down-delayed">
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-secondary/70 to-secondary/30 rounded-xl aspect-[3/4]" />
        
        {/* Row 4 */}
        <div className="bg-gradient-to-br from-muted/60 to-secondary/40 rounded-xl aspect-[3/4]" />
        <div className="bg-gradient-to-br from-secondary/50 to-muted/50 rounded-xl aspect-[3/4]" />
      </div>

      {/* Logo at top center */}
      <div className="relative z-10 pt-10 flex justify-center">
        <div className="bg-background/90 backdrop-blur-md px-5 py-3 rounded-full flex items-center gap-3 shadow-xl border border-border/30">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <span className="font-bold text-foreground text-base">BOUTIQUE MANCER</span>
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
            <span className="text-primary">BOUTIQUE</span>
            <span className="text-foreground"> MANCER</span>
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
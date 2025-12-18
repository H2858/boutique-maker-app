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

  // Placeholder gradient backgrounds for the masonry grid
  const gridItems = [
    'from-primary/80 to-primary/40',
    'from-secondary to-secondary/60',
    'from-accent/70 to-accent/30',
    'from-primary/60 to-secondary/80',
    'from-accent/50 to-primary/60',
    'from-secondary/70 to-accent/50',
    'from-primary/50 to-accent/70',
    'from-secondary/60 to-primary/40',
  ];

  return (
    <div 
      className="min-h-screen flex flex-col bg-background relative overflow-hidden"
      dir={dir}
    >
      {/* Background Masonry Grid */}
      <div className="absolute inset-0 grid grid-cols-3 gap-1.5 p-1.5 opacity-90">
        {gridItems.map((gradient, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-br ${gradient} rounded-lg ${
              index % 3 === 1 ? 'row-span-2' : ''
            } ${index === 0 || index === 5 ? 'aspect-[3/4]' : ''}`}
            style={{
              minHeight: index % 3 === 1 ? '200px' : '100px',
            }}
          />
        ))}
      </div>

      {/* Logo at top center */}
      <div className="relative z-10 pt-8 flex justify-center">
        <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-bold text-foreground text-sm">BOUTIQUE MANCER</span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Card */}
      <div className="relative z-10 bg-background rounded-t-[2rem] pt-8 pb-10 px-6 shadow-2xl">
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
          className="w-full py-6 text-base font-bold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-300 active:scale-[0.98]"
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

import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Sparkles, Star } from 'lucide-react';
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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary to-background relative overflow-hidden"
      dir={dir}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full gradient-primary opacity-20 animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-accent/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-40 left-1/4 w-24 h-24 rounded-full gradient-primary opacity-15 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-10 w-16 h-16 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: '1.5s' }} />
        <Sparkles className="absolute top-1/4 right-1/4 w-8 h-8 text-primary/40 animate-bounce-subtle" />
        <Star className="absolute bottom-1/3 left-1/3 w-6 h-6 text-accent/40 animate-bounce-subtle" style={{ animationDelay: '0.3s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 animate-fade-in-up">
        {/* Logo */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 gradient-primary rounded-full blur-3xl opacity-30 scale-150" />
          <img 
            src={logo} 
            alt="Boutique Mancer" 
            className="w-32 h-32 object-contain relative z-10 drop-shadow-2xl"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          {t('welcome')}
        </h1>
        <h2 className="text-4xl sm:text-5xl font-bold text-gradient mb-6">
          BOUTIQUE MANCER
        </h2>

        {/* Description */}
        <p className="text-lg text-muted-foreground mb-12 max-w-md">
          {t('discoverProducts')}
        </p>

        {/* Shopping Bag Icon */}
        <div className="mb-8 p-6 rounded-full bg-card shadow-glow">
          <ShoppingBag className="w-12 h-12 text-primary" />
        </div>

        {/* Get Started Button */}
        <Button
          onClick={handleGetStarted}
          size="lg"
          className="px-12 py-6 text-lg font-bold rounded-2xl gradient-primary text-primary-foreground shadow-glow hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {t('getStarted')}
        </Button>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 to-transparent" />
    </div>
  );
};

export default Welcome;

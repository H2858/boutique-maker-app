import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Sparkles, Star, ArrowLeft } from 'lucide-react';
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
      className="min-h-screen flex flex-col bg-gradient-to-br from-background via-secondary/50 to-background relative overflow-hidden"
      dir={dir}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-5 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating icons */}
        <Sparkles className="absolute top-20 right-20 w-6 h-6 text-primary/30 animate-bounce" style={{ animationDuration: '3s' }} />
        <Star className="absolute top-1/3 left-10 w-5 h-5 text-accent/30 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
        <ShoppingBag className="absolute bottom-1/3 right-16 w-7 h-7 text-primary/20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Logo with glow */}
        <div className="relative mb-8 animate-fade-in">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-150" />
          <div className="relative bg-card/80 backdrop-blur-sm p-6 rounded-3xl shadow-2xl">
            <img 
              src={logo} 
              alt="Boutique Mancer" 
              className="w-28 h-28 object-contain"
            />
          </div>
        </div>

        {/* Text content */}
        <div className="text-center space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-3xl font-bold text-foreground">
            {t('welcome')}
          </h1>
          <h2 className="text-4xl font-black text-gradient">
            BOUTIQUE MANCER
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
            {t('discoverProducts')}
          </p>
        </div>

        {/* Features */}
        <div className="flex gap-6 mt-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {['✨ عروض حصرية', '🚚 توصيل سريع', '💎 جودة عالية'].map((feature, i) => (
            <div key={i} className="text-center">
              <span className="text-xs text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom section */}
      <div className="px-6 pb-12 relative z-10 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <Button
          onClick={handleGetStarted}
          size="lg"
          className="w-full py-7 text-lg font-bold rounded-2xl gradient-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
        >
          {t('getStarted')}
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <p className="text-center text-xs text-muted-foreground mt-4">
          {t('agreeTerms')}
        </p>
      </div>
    </div>
  );
};

export default Welcome;
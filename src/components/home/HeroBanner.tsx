import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroBanner = () => {
  const { dir } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      title: "تخفيضات الموسم",
      subtitle: "خصم يصل إلى 70%",
      gradient: "from-primary via-primary-glow to-accent",
    },
    {
      id: 2,
      title: "وصل حديثاً",
      subtitle: "تشكيلة جديدة",
      gradient: "from-accent via-pink-500 to-primary",
    },
    {
      id: 3,
      title: "شحن مجاني",
      subtitle: "للطلبات الكبيرة",
      gradient: "from-success via-emerald-400 to-teal-500",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative overflow-hidden rounded-2xl mx-4 mt-4">
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(${dir === 'rtl' ? currentSlide * 100 : -currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={cn(
              "min-w-full h-40 sm:h-48 md:h-56 rounded-2xl bg-gradient-to-l flex items-center justify-between px-6 sm:px-8",
              banner.gradient
            )}
            dir={dir}
          >
            <div className="text-primary-foreground space-y-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{banner.title}</h2>
              <p className="text-sm sm:text-base opacity-90">{banner.subtitle}</p>
            </div>
            <div className="hidden sm:block">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary-foreground/20 backdrop-blur-sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              currentSlide === index 
                ? "w-6 bg-primary-foreground" 
                : "w-2 bg-primary-foreground/50"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;

import { useState, useEffect, useRef, TouchEvent } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const HeroBanner = () => {
  const { dir } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  const { data: banners } = useQuery({
    queryKey: ['hero-banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Fallback banners if database is empty
  const defaultBanners = [
    { id: '1', title: "تخفيضات الموسم", subtitle: "خصم يصل إلى 70%", gradient: "from-primary via-primary-glow to-accent", image_url: null, video_url: null },
    { id: '2', title: "وصل حديثاً", subtitle: "تشكيلة جديدة", gradient: "from-accent via-pink-500 to-primary", image_url: null, video_url: null },
    { id: '3', title: "شحن مجاني", subtitle: "للطلبات الكبيرة", gradient: "from-success via-emerald-400 to-teal-500", image_url: null, video_url: null },
  ];

  const displayBanners = banners && banners.length > 0 ? banners : defaultBanners;
  const currentBanner = displayBanners[currentSlide];

  // Auto-advance timer - only if not video or if we should advance
  useEffect(() => {
    if (displayBanners.length <= 1) return;
    
    // If current banner is a video, don't auto-advance (wait for video to end)
    if (currentBanner?.video_url && isVideoPlaying) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [displayBanners.length, currentBanner?.video_url, isVideoPlaying]);

  // Handle video end - advance to next slide
  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
    if (displayBanners.length > 1) {
      setCurrentSlide((prev) => (prev + 1) % displayBanners.length);
    }
  };

  // Handle video play
  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold && displayBanners.length > 1) {
      if (diff > 0) {
        setCurrentSlide((prev) => (prev + 1) % displayBanners.length);
      } else {
        setCurrentSlide((prev) => (prev - 1 + displayBanners.length) % displayBanners.length);
      }
    }
  };

  if (displayBanners.length === 0) return null;

  return (
    <div 
      className="relative overflow-hidden rounded-2xl mx-4 mt-4"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(${dir === 'rtl' ? currentSlide * 100 : -currentSlide * 100}%)` }}
      >
        {displayBanners.map((banner: any, index: number) => (
          <div
            key={banner.id}
            className={cn(
              "min-w-full h-40 sm:h-48 md:h-56 rounded-2xl flex items-center justify-center px-6 sm:px-8 relative overflow-hidden",
              !banner.image_url && !banner.video_url && `bg-gradient-to-l ${banner.gradient}`
            )}
            dir={dir}
          >
            {banner.video_url ? (
              <>
                <video 
                  ref={(el) => {
                    if (el) videoRefs.current.set(banner.id, el);
                  }}
                  src={banner.video_url} 
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  autoPlay={index === currentSlide}
                  playsInline
                  onEnded={handleVideoEnded}
                  onPlay={handleVideoPlay}
                />
                <div className="absolute inset-0 bg-black/30" />
                {(banner.title || banner.subtitle) && (
                  <div className="relative z-10 text-white text-center space-y-2">
                    {banner.title && <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{banner.title}</h2>}
                    {banner.subtitle && <p className="text-sm sm:text-base opacity-90">{banner.subtitle}</p>}
                  </div>
                )}
              </>
            ) : banner.image_url ? (
              <>
                <img 
                  src={banner.image_url} 
                  alt={banner.title || ''} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                {(banner.title || banner.subtitle) && (
                  <div className="relative z-10 text-white text-center space-y-2">
                    {banner.title && <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{banner.title}</h2>}
                    {banner.subtitle && <p className="text-sm sm:text-base opacity-90">{banner.subtitle}</p>}
                  </div>
                )}
              </>
            ) : (
              <div className="text-primary-foreground text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{banner.title}</h2>
                <p className="text-sm sm:text-base opacity-90">{banner.subtitle}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      {displayBanners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {displayBanners.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentSlide === index 
                  ? "bg-white w-4" 
                  : "bg-white/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;

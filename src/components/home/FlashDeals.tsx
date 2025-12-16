import { useState, useEffect } from "react";
import { Zap, Clock } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

const flashProducts = [
  {
    id: 1,
    name: "حقيبة يد نسائية فاخرة",
    price: 89,
    originalPrice: 199,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
    rating: 4.8,
    sold: 234,
    discount: 55,
  },
  {
    id: 2,
    name: "ساعة ذكية رياضية",
    price: 149,
    originalPrice: 299,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.9,
    sold: 567,
    discount: 50,
  },
  {
    id: 3,
    name: "سماعات لاسلكية",
    price: 79,
    originalPrice: 159,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.7,
    sold: 891,
    discount: 50,
  },
  {
    id: 4,
    name: "نظارة شمسية أنيقة",
    price: 59,
    originalPrice: 120,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    rating: 4.6,
    sold: 432,
    discount: 51,
  },
];

const FlashDeals = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 32, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="px-4 py-6" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent/10">
            <Zap className="h-4 w-4 text-accent fill-accent" />
            <span className="text-sm font-bold text-accent">عروض خاطفة</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <div className="flex items-center gap-1 text-sm font-mono">
            <span className="bg-foreground text-background px-1.5 py-0.5 rounded">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-foreground text-background px-1.5 py-0.5 rounded">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-foreground text-background px-1.5 py-0.5 rounded">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {flashProducts.map((product, index) => (
          <div 
            key={product.id} 
            className="min-w-[160px] animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProductCard product={product} variant="compact" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlashDeals;

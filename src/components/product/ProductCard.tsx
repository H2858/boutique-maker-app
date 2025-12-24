import { Timer, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  is_special_offer?: boolean;
  offer_end_date?: string | null;
  product_images: ProductImage[];
}

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

const ProductCard = ({ product, variant = "default" }: ProductCardProps) => {
  const { t } = useLanguage();

  const primaryImage = product.product_images?.find(img => img.is_primary) || product.product_images?.[0];
  const discount = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  // Calculate remaining time for offer
  const getOfferTimeRemaining = () => {
    if (!product.is_special_offer || !product.offer_end_date) return null;
    const now = new Date();
    const end = new Date(product.offer_end_date);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const offerTimeRemaining = getOfferTimeRemaining();

  return (
    <div className={cn(
      "group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 w-full flex flex-col",
      "border border-border/50 hover:border-primary/30",
      variant === "compact" && "min-w-0"
    )}>
      {/* Offer Timer Badge */}
      {offerTimeRemaining && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-accent via-accent to-primary text-white px-3 py-2 flex items-center justify-center gap-2">
          <Timer className="h-3.5 w-3.5 flex-shrink-0 animate-pulse" />
          <span className="text-xs font-bold">{offerTimeRemaining}</span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-full pt-[100%] bg-gradient-to-br from-muted/30 to-muted/50">
        {primaryImage ? (
          <img
            src={primaryImage.image_url}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center text-muted-foreground">
            <Sparkles className="h-8 w-8 opacity-30" />
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 overflow-hidden rounded-xl">
            <div className="relative px-2.5 py-1.5 bg-gradient-to-r from-accent to-primary text-white">
              <span className="text-xs font-bold">-{discount}%</span>
            </div>
          </div>
        )}
        
        {/* New badge for non-discount items */}
        {!discount && !offerTimeRemaining && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-primary/90 text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            {t('new')}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1 min-h-[80px]">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug mb-auto group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-base font-bold text-primary">
            {product.discount_price || product.price} د.ج
          </span>
          {product.discount_price && (
            <span className="text-xs text-muted-foreground line-through decoration-accent/50">
              {product.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

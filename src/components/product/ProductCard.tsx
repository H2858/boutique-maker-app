import { Timer } from "lucide-react";
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
      "group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-medium transition-all duration-300",
      variant === "compact" && "min-w-[160px]"
    )}>
      {/* Offer Timer Badge */}
      {offerTimeRemaining && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-accent/90 text-accent-foreground px-2 py-1 flex items-center justify-center gap-1">
          <Timer className="h-3 w-3" />
          <span className="text-xs font-bold">{offerTimeRemaining}</span>
        </div>
      )}

      {/* Image Container */}
      <div className={cn(
        "relative aspect-square overflow-hidden bg-secondary",
        offerTimeRemaining && "mt-0"
      )}>
        {primaryImage ? (
          <img
            src={primaryImage.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No Image
          </div>
        )}
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className={cn(
            "absolute right-2 px-2 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-bold",
            offerTimeRemaining ? "top-2" : "top-2"
          )}>
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            {product.discount_price || product.price} د.ج
          </span>
          {product.discount_price && (
            <span className="text-xs text-muted-foreground line-through">
              {product.price} د.ج
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

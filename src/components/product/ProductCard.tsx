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
      "group relative bg-card rounded-2xl shadow-card hover:shadow-md transition-all duration-300 w-full flex flex-col",
      variant === "compact" && "min-w-0"
    )}>
      {/* Offer Timer Badge */}
      {offerTimeRemaining && (
        <div className="w-full z-10 bg-accent/90 text-accent-foreground px-2 py-1 flex items-center justify-center gap-1">
          <Timer className="h-3 w-3 flex-shrink-0" />
          <span className="text-xs font-bold">{offerTimeRemaining}</span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-square w-full bg-secondary">
        {primaryImage ? (
          <img
            src={primaryImage.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No Image
          </div>
        )}
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-bold">
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-foreground mb-2 break-words whitespace-normal leading-snug">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex flex-wrap items-center gap-1 mt-auto">
          <span className="text-base font-bold text-primary">
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

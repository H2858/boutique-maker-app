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
      "group relative bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-full flex flex-col",
      variant === "compact" && "min-w-0"
    )}>
      {/* Offer Timer Badge */}
      {offerTimeRemaining && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-accent/95 text-accent-foreground px-2 py-1.5 flex items-center justify-center gap-1.5 rounded-t-xl">
          <Timer className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="text-xs font-bold">{offerTimeRemaining}</span>
        </div>
      )}

      {/* Image Container - Fixed aspect ratio */}
      <div className="relative w-full pt-[100%] bg-muted/50">
        {primaryImage ? (
          <img
            src={primaryImage.image_url}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            No Image
          </div>
        )}
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-accent text-accent-foreground text-[10px] font-bold shadow-sm">
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5 flex flex-col flex-1 min-h-[70px]">
        <h3 className="text-xs font-medium text-foreground line-clamp-2 leading-tight mb-auto">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-sm font-bold text-primary">
            {product.discount_price || product.price} د.ج
          </span>
          {product.discount_price && (
            <span className="text-[10px] text-muted-foreground line-through">
              {product.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

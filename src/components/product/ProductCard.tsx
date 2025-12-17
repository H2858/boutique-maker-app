import { useState } from "react";
import { Heart, Star } from "lucide-react";
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
  product_images: ProductImage[];
}

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

const ProductCard = ({ product, variant = "default" }: ProductCardProps) => {
  const { t } = useLanguage();
  const [isFavorite, setIsFavorite] = useState(false);

  const primaryImage = product.product_images?.find(img => img.is_primary) || product.product_images?.[0];
  const discount = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  return (
    <div className={cn(
      "group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-medium transition-all duration-300",
      variant === "compact" && "min-w-[160px]"
    )}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
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
          <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-bold">
            -{discount}%
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
          className={cn(
            "absolute top-2 left-2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-all duration-200",
            isFavorite && "bg-accent text-accent-foreground"
          )}
        >
          <Heart className={cn(
            "h-4 w-4 transition-all",
            isFavorite && "fill-current scale-110"
          )} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            {product.discount_price || product.price} ر.س
          </span>
          {product.discount_price && (
            <span className="text-xs text-muted-foreground line-through">
              {product.price} ر.س
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

import { useState } from "react";
import { Heart, Star, ShoppingCart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  sold: number;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

const ProductCard = ({ product, variant = "default" }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <div className={cn(
      "group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-medium transition-all duration-300",
      variant === "compact" && "min-w-[160px]"
    )}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-bold">
            -{product.discount}%
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
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

        {/* Quick Add Button */}
        <button
          onClick={handleAddToCart}
          className={cn(
            "absolute bottom-2 right-2 w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-glow transition-all duration-200 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
            isAdding && "animate-bounce-subtle bg-success"
          )}
        >
          {isAdding ? (
            <ShoppingCart className="h-4 w-4" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-3" dir="rtl">
        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Rating & Sold */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-warning fill-warning" />
            <span className="text-xs font-medium text-foreground">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-xs text-muted-foreground">{product.sold} مبيعات</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">{product.price} ر.س</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {product.originalPrice} ر.س
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

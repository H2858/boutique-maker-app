import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Phone, X, Timer, ChevronLeft, ChevronRight } from 'lucide-react';
import OrderFormModal from './OrderFormModal';
import { cn } from '@/lib/utils';

interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
}

interface ProductColor {
  id: string;
  color_name: string;
  color_hex: string;
}

interface ProductSize {
  id: string;
  size: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  category: string;
  store_location: string | null;
  phone_number: string | null;
  is_special_offer?: boolean;
  offer_end_date?: string | null;
  product_images: ProductImage[];
  product_colors: ProductColor[];
  product_sizes: ProductSize[];
}

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailsModal = ({ product, isOpen, onClose }: ProductDetailsModalProps) => {
  const { t, dir } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const images = product?.product_images || [];
  const colors = product?.product_colors || [];
  const sizes = product?.product_sizes || [];

  // Auto-play images
  useEffect(() => {
    if (images.length > 1 && isOpen) {
      autoPlayRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [images.length, isOpen]);

  // Reset index when modal opens
  useEffect(() => {
    if (isOpen) setCurrentImageIndex(0);
  }, [isOpen]);

  if (!product) return null;

  const goToPrevImage = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    // Restart auto-play
    if (images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
    }
  };

  const goToNextImage = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    // Restart auto-play
    if (images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
    }
  };

  const discount = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const openGoogleMaps = () => {
    if (product.store_location) {
      const query = encodeURIComponent(product.store_location);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  // Calculate remaining time for offer
  const getOfferTimeRemaining = () => {
    if (!product.offer_end_date) return null;
    const now = new Date();
    const end = new Date(product.offer_end_date);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} ${t('days')} ${hours} ${t('hours')}`;
    return `${hours} ${t('hours')}`;
  };

  const offerTimeRemaining = getOfferTimeRemaining();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 [&>button]:hidden" dir={dir}>
          <DialogHeader className="sr-only">
            <DialogTitle>{product.name}</DialogTitle>
          </DialogHeader>
          
          {/* Image Gallery with Arrows */}
          <div className="relative aspect-square bg-secondary overflow-hidden">
            {images.length > 0 ? (
              <>
                <div 
                  className="flex transition-transform duration-300 h-full"
                  style={{ transform: `translateX(${dir === 'rtl' ? '' : '-'}${currentImageIndex * 100}%)` }}
                >
                  {images.map((img) => (
                    <img
                      key={img.id}
                      src={img.image_url}
                      alt={product.name}
                      className="min-w-full h-full object-cover"
                    />
                  ))}
                </div>
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors z-10"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={goToNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors z-10"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
                
                {/* Image indicators */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          "h-2 rounded-full transition-all",
                          index === currentImageIndex 
                            ? 'bg-primary w-6' 
                            : 'w-2 bg-card/60'
                        )}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
            
            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-accent text-accent-foreground font-bold">
                -{discount}%
              </div>
            )}
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Offer Timer */}
            {offerTimeRemaining && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/20">
                <Timer className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-accent">
                  {t('offerEndsIn')}: {offerTimeRemaining}
                </span>
              </div>
            )}

            {/* Name & Price */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">{product.name}</h2>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-primary">
                  {product.discount_price || product.price} د.ج
                </span>
                {product.discount_price && (
                  <span className="text-lg text-muted-foreground line-through">
                    {product.price} د.ج
                  </span>
                )}
              </div>
            </div>

            {/* Colors */}
            {colors.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">{t('availableColors')}</h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <div key={color.id} className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-border shadow-sm"
                        style={{ backgroundColor: color.color_hex }}
                      />
                      <span className="text-sm text-muted-foreground">{color.color_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">{t('availableSizes')}</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <span
                      key={size.id}
                      className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium"
                    >
                      {size.size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">{t('description')}</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Store Info */}
            <div className="space-y-3 pt-4 border-t border-border">
              {product.store_location && (
                <button
                  onClick={openGoogleMaps}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors w-full text-start"
                >
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="underline">{product.store_location}</span>
                </button>
              )}
              {product.phone_number && (
                <a 
                  href={`tel:${product.phone_number}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-5 w-5 text-primary" />
                  <span dir="ltr">{product.phone_number}</span>
                </a>
              )}
            </div>

            {/* Order Button */}
            <Button
              onClick={() => setShowOrderForm(true)}
              className="w-full py-6 text-lg font-bold rounded-xl gradient-primary text-primary-foreground"
            >
              {t('orderProduct')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <OrderFormModal
        isOpen={showOrderForm}
        onClose={() => setShowOrderForm(false)}
        product={product}
        colors={colors}
        sizes={sizes}
      />
    </>
  );
};

export default ProductDetailsModal;
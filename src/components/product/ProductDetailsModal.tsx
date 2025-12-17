import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Phone, ChevronLeft, ChevronRight, X } from 'lucide-react';
import OrderFormModal from './OrderFormModal';

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

  if (!product) return null;

  const images = product.product_images || [];
  const colors = product.product_colors || [];
  const sizes = product.product_sizes || [];

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const discount = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0" dir={dir}>
          <DialogHeader className="sr-only">
            <DialogTitle>{product.name}</DialogTitle>
          </DialogHeader>
          
          {/* Image Gallery */}
          <div className="relative aspect-square bg-secondary">
            {images.length > 0 ? (
              <>
                <img
                  src={images[currentImageIndex]?.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex 
                              ? 'bg-primary w-6' 
                              : 'bg-card/60'
                          }`}
                        />
                      ))}
                    </div>
                  </>
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
            {/* Name & Price */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">{product.name}</h2>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-primary">
                  {product.discount_price || product.price} ر.س
                </span>
                {product.discount_price && (
                  <span className="text-lg text-muted-foreground line-through">
                    {product.price} ر.س
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
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{product.store_location}</span>
                </div>
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

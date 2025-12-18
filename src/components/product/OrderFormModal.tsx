import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Minus, Plus } from 'lucide-react';

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
}

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  colors: ProductColor[];
  sizes: ProductSize[];
}

const OrderFormModal = ({ isOpen, onClose, product, colors, sizes }: OrderFormModalProps) => {
  const { t, dir } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerLocation: '',
    selectedColors: [] as string[],
    selectedSizes: [] as string[],
    notes: '',
    quantity: 1,
  });

  const handleColorToggle = (colorName: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(colorName)
        ? prev.selectedColors.filter((c) => c !== colorName)
        : [...prev.selectedColors, colorName],
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter((s) => s !== size)
        : [...prev.selectedSizes, size],
    }));
  };

  const updateQuantity = (delta: number) => {
    setFormData((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerPhone || !formData.customerLocation) {
      toast.error(t('error'));
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('orders').insert({
        product_id: product.id,
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        customer_location: formData.customerLocation,
        selected_colors: formData.selectedColors,
        selected_sizes: formData.selectedSizes,
        notes: formData.notes || null,
        quantity: formData.quantity,
      });

      if (error) throw error;

      toast.success(t('orderSuccess'));
      setFormData({
        customerName: '',
        customerPhone: '',
        customerLocation: '',
        selectedColors: [],
        selectedSizes: [],
        notes: '',
        quantity: 1,
      });
      onClose();
    } catch (error) {
      console.error('Order error:', error);
      toast.error(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto rounded-2xl" dir={dir}>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold break-words">{t('orderForm')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('yourName')} *
            </label>
            <Input
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder={t('yourName')}
              required
            />
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('yourPhone')} *
            </label>
            <Input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              placeholder={t('yourPhone')}
              dir="ltr"
              required
            />
          </div>

          {/* Customer Location */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('yourLocation')} *
            </label>
            <Input
              value={formData.customerLocation}
              onChange={(e) => setFormData({ ...formData, customerLocation: e.target.value })}
              placeholder={t('yourLocation')}
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('quantity')}
            </label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(-1)}
                disabled={formData.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-bold w-12 text-center">{formData.quantity}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Colors */}
          {colors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('selectColors')}
              </label>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <label
                    key={color.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={formData.selectedColors.includes(color.color_name)}
                      onCheckedChange={() => handleColorToggle(color.color_name)}
                    />
                    <div
                      className="w-5 h-5 rounded-full border border-border"
                      style={{ backgroundColor: color.color_hex }}
                    />
                    <span className="text-sm">{color.color_name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('selectSizes')}
              </label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <label
                    key={size.id}
                    className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
                      formData.selectedSizes.includes(size.size)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.selectedSizes.includes(size.size)}
                      onChange={() => handleSizeToggle(size.size)}
                    />
                    {size.size}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('notes')}
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t('notes')}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 text-lg font-bold rounded-xl gradient-primary text-primary-foreground"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              t('submitOrder')
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderFormModal;
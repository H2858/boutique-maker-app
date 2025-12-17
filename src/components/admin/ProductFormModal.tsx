import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, X, Upload } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

const ProductFormModal = ({ isOpen, onClose, product }: ProductFormModalProps) => {
  const { t, dir } = useLanguage();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', discountPrice: '', category: '',
    storeLocation: '', phoneNumber: '',
  });
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
  const [newSize, setNewSize] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '', description: product.description || '',
        price: product.price?.toString() || '', discountPrice: product.discount_price?.toString() || '',
        category: product.category || '', storeLocation: product.store_location || '',
        phoneNumber: product.phone_number || '',
      });
      setColors(product.product_colors?.map((c: any) => ({ name: c.color_name, hex: c.color_hex })) || []);
      setSizes(product.product_sizes?.map((s: any) => s.size) || []);
      setImages(product.product_images?.map((i: any) => i.image_url) || []);
    } else {
      setFormData({ name: '', description: '', price: '', discountPrice: '', category: '', storeLocation: '', phoneNumber: '' });
      setColors([]); setSizes([]); setImages([]);
    }
  }, [product, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('product-images').upload(fileName, file);
      if (error) { toast.error(t('error')); continue; }
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setImages(prev => [...prev, publicUrl]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) { toast.error(t('error')); return; }
    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name, description: formData.description || null,
        price: parseFloat(formData.price), discount_price: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        category: formData.category, store_location: formData.storeLocation || null, phone_number: formData.phoneNumber || null,
      };

      let productId = product?.id;
      if (product) {
        await supabase.from('products').update(productData).eq('id', product.id);
        await supabase.from('product_images').delete().eq('product_id', product.id);
        await supabase.from('product_colors').delete().eq('product_id', product.id);
        await supabase.from('product_sizes').delete().eq('product_id', product.id);
      } else {
        const { data, error } = await supabase.from('products').insert(productData).select().single();
        if (error) throw error;
        productId = data.id;
      }

      if (images.length > 0) {
        await supabase.from('product_images').insert(images.map((url, i) => ({ product_id: productId, image_url: url, is_primary: i === 0 })));
      }
      if (colors.length > 0) {
        await supabase.from('product_colors').insert(colors.map(c => ({ product_id: productId, color_name: c.name, color_hex: c.hex })));
      }
      if (sizes.length > 0) {
        await supabase.from('product_sizes').insert(sizes.map(s => ({ product_id: productId, size: s })));
      }

      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success(t('save'));
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir={dir}>
        <DialogHeader>
          <DialogTitle>{product ? t('editProduct') : t('addProduct')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder={t('productName') + ' *'} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <Input type="number" placeholder={t('price') + ' *'} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            <Input type="number" placeholder={t('discountPrice')} value={formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: e.target.value})} />
          </div>
          <Input placeholder={t('category') + ' *'} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
          <Textarea placeholder={t('description')} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <Input placeholder={t('storeLocation')} value={formData.storeLocation} onChange={e => setFormData({...formData, storeLocation: e.target.value})} />
          <Input placeholder={t('phoneNumber')} value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} dir="ltr" />

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('uploadImages')}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((url, i) => (
                <div key={i} className="relative w-16 h-16">
                  <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button type="button" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
                    <X className="h-3 w-3 text-destructive-foreground" />
                  </button>
                </div>
              ))}
              <label className="w-16 h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('colors')}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {colors.map((c, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-lg text-sm">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.hex }} />
                  {c.name}
                  <button type="button" onClick={() => setColors(prev => prev.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder={t('colors')} value={newColor.name} onChange={e => setNewColor({...newColor, name: e.target.value})} className="flex-1" />
              <input type="color" value={newColor.hex} onChange={e => setNewColor({...newColor, hex: e.target.value})} className="w-10 h-10 rounded cursor-pointer" />
              <Button type="button" size="icon" onClick={() => { if (newColor.name) { setColors([...colors, newColor]); setNewColor({ name: '', hex: '#000000' }); } }}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('sizes')}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {sizes.map((s, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-lg text-sm">
                  {s}
                  <button type="button" onClick={() => setSizes(prev => prev.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder={t('sizes')} value={newSize} onChange={e => setNewSize(e.target.value)} className="flex-1" />
              <Button type="button" size="icon" onClick={() => { if (newSize) { setSizes([...sizes, newSize]); setNewSize(''); } }}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">{t('cancel')}</Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 gradient-primary">
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : t('save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;

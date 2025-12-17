import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, X, Upload, Image } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const CATEGORIES = [
  { value: 'men', labelKey: 'categoryMen' },
  { value: 'women', labelKey: 'categoryWomen' },
  { value: 'kids', labelKey: 'categoryKids' },
  { value: 'accessories', labelKey: 'categoryAccessories' },
];

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

const ProductFormModal = ({ isOpen, onClose, product }: ProductFormModalProps) => {
  const { t, dir } = useLanguage();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadPromises: Promise<string | null>[] = [];

    for (const file of Array.from(files)) {
      const promise = (async () => {
        try {
          // Generate unique filename
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });
          
          if (uploadError) {
            console.error('Upload error:', uploadError);
            return null;
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
          
          return publicUrl;
        } catch (error) {
          console.error('Error uploading file:', error);
          return null;
        }
      })();
      
      uploadPromises.push(promise);
    }

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((url): url is string => url !== null);
    
    if (successfulUploads.length > 0) {
      setImages(prev => [...prev, ...successfulUploads]);
      toast.success(`تم رفع ${successfulUploads.length} صورة بنجاح`);
    }
    
    if (successfulUploads.length < files.length) {
      toast.error(`فشل رفع ${files.length - successfulUploads.length} صورة`);
    }

    setIsUploading(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) { 
      toast.error(t('error')); 
      return; 
    }
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
      queryClient.invalidateQueries({ queryKey: ['products'] });
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
            <Input type="number" placeholder={t('price') + ' (د.ج) *'} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            <Input type="number" placeholder={t('discountPrice') + ' (د.ج)'} value={formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: e.target.value})} />
          </div>
          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={t('category') + ' *'} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {t(cat.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea placeholder={t('description')} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <Input placeholder={t('storeLocation')} value={formData.storeLocation} onChange={e => setFormData({...formData, storeLocation: e.target.value})} />
          <Input placeholder={t('phoneNumber')} value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} dir="ltr" />

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('uploadImages')}</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {images.map((url, i) => (
                <div key={i} className="relative w-20 h-20 group">
                  <img src={url} alt="" className="w-full h-full object-cover rounded-lg border border-border" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(i)} 
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-destructive-foreground" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 text-[10px] bg-primary text-primary-foreground px-1 rounded">
                      رئيسية
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div 
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              )}
              <span className="text-sm text-muted-foreground">
                {isUploading ? 'جاري الرفع...' : 'اضغط لرفع الصور'}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                يمكنك رفع عدة صور في وقت واحد
              </span>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleImageUpload} 
                className="hidden" 
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('colors')}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {colors.map((c, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-lg text-sm">
                  <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
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
            <Button type="submit" disabled={isSubmitting || isUploading} className="flex-1 gradient-primary">
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : t('save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
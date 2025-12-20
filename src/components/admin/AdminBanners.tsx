import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Loader2, Upload, Image, Video } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DeleteConfirmModal from './DeleteConfirmModal';

const GRADIENT_OPTIONS = [
  { value: 'from-primary via-primary-glow to-accent', label: 'أساسي' },
  { value: 'from-accent via-pink-500 to-primary', label: 'وردي' },
  { value: 'from-success via-emerald-400 to-teal-500', label: 'أخضر' },
  { value: 'from-blue-500 via-blue-400 to-cyan-500', label: 'أزرق' },
  { value: 'from-purple-500 via-violet-400 to-pink-500', label: 'بنفسجي' },
  { value: 'from-orange-500 via-amber-400 to-yellow-500', label: 'برتقالي' },
];

const AdminBanners = () => {
  const { t, dir } = useLanguage();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [deletingBanner, setDeletingBanner] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    gradient: GRADIENT_OPTIONS[0].value,
    is_active: true,
    sort_order: 0,
    image_url: '',
    video_url: '',
  });

  const { data: banners, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `banner-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      setFormData({ ...formData, image_url: publicUrl });
      toast.success('تم رفع الصورة');
    } catch (error) {
      console.error(error);
      toast.error(t('error'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingBanner) {
        const { error } = await supabase
          .from('hero_banners')
          .update(formData)
          .eq('id', editingBanner.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hero_banners')
          .insert(formData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      queryClient.invalidateQueries({ queryKey: ['hero-banners'] });
      toast.success(t('save'));
      handleCloseForm();
    },
    onError: () => toast.error(t('error')),
  });

  const deleteMutation = useMutation({
    mutationFn: async (bannerId: string) => {
      const { error } = await supabase.from('hero_banners').delete().eq('id', bannerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      queryClient.invalidateQueries({ queryKey: ['hero-banners'] });
      toast.success(t('delete'));
      setDeletingBanner(null);
    },
    onError: () => toast.error(t('error')),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('hero_banners')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      queryClient.invalidateQueries({ queryKey: ['hero-banners'] });
    },
    onError: () => toast.error(t('error')),
  });

  const handleOpenForm = (banner?: any) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle,
        gradient: banner.gradient,
        is_active: banner.is_active,
        sort_order: banner.sort_order,
        image_url: banner.image_url || '',
        video_url: banner.video_url || '',
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        gradient: GRADIENT_OPTIONS[0].value,
        is_active: true,
        sort_order: banners?.length || 0,
        image_url: '',
        video_url: '',
      });
    }
    setShowForm(true);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('حجم الفيديو كبير جداً (الحد الأقصى 50MB)');
      return;
    }

    setIsUploadingVideo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `video-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      setFormData({ ...formData, video_url: publicUrl, image_url: '' });
      toast.success('تم رفع الفيديو');
    } catch (error) {
      console.error(error);
      toast.error(t('error'));
    } finally {
      setIsUploadingVideo(false);
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBanner(null);
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">الشريط الإعلاني</h2>
        <Button onClick={() => handleOpenForm()} className="gradient-primary">
          <Plus className="h-5 w-5 mr-2" />
          إضافة إعلان
        </Button>
      </div>

      <div className="grid gap-4">
        {banners?.map((banner: any) => (
          <div 
            key={banner.id} 
            className={`rounded-xl overflow-hidden relative ${
              banner.image_url || banner.video_url ? '' : `bg-gradient-to-l ${banner.gradient}`
            }`}
          >
            {banner.video_url ? (
              <div className="relative">
                <video src={banner.video_url} className="w-full h-40 object-cover" muted loop autoPlay playsInline />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-white">
                    <h3 className="text-xl font-bold">{banner.title}</h3>
                    <p className="opacity-90">{banner.subtitle}</p>
                  </div>
                </div>
              </div>
            ) : banner.image_url ? (
              <div className="relative">
                <img src={banner.image_url} alt={banner.title} className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-xl font-bold">{banner.title}</h3>
                    <p className="opacity-90">{banner.subtitle}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-primary-foreground">
                <div className="text-center">
                  <h3 className="text-xl font-bold">{banner.title}</h3>
                  <p className="opacity-90">{banner.subtitle}</p>
                </div>
              </div>
            )}
            <div className="absolute top-2 right-2 flex items-center gap-2">
              <Switch
                checked={banner.is_active}
                onCheckedChange={(checked) => toggleActiveMutation.mutate({ id: banner.id, is_active: checked })}
              />
              <Button size="sm" variant="secondary" onClick={() => handleOpenForm(banner)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setDeletingBanner(banner)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      <Dialog open={showForm} onOpenChange={handleCloseForm}>
        <DialogContent dir={dir}>
          <DialogHeader>
            <DialogTitle>{editingBanner ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">العنوان</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="تخفيضات الموسم"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">النص الفرعي</label>
              <Input
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="خصم يصل إلى 70%"
              />
            </div>

            {/* Media Upload - Image or Video */}
            <div>
              <label className="block text-sm font-medium mb-2">وسائط الإعلان (صورة أو فيديو قصير)</label>
              
              {formData.video_url ? (
                <div className="relative rounded-lg overflow-hidden mb-2">
                  <video src={formData.video_url} className="w-full h-32 object-cover" muted loop autoPlay playsInline />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, video_url: '' })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : formData.image_url ? (
                <div className="relative rounded-lg overflow-hidden mb-2">
                  <img src={formData.image_url} alt="" className="w-full h-32 object-cover" />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, image_url: '' })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {/* Image upload */}
                  <div 
                    onClick={() => !isUploading && !isUploadingVideo && fileInputRef.current?.click()}
                    className={`border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors ${isUploading ? 'opacity-50' : ''}`}
                  >
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : (
                      <>
                        <Image className="h-6 w-6 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">رفع صورة</span>
                      </>
                    )}
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                      disabled={isUploading || isUploadingVideo}
                    />
                  </div>
                  
                  {/* Video upload */}
                  <div 
                    onClick={() => !isUploading && !isUploadingVideo && videoInputRef.current?.click()}
                    className={`border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors ${isUploadingVideo ? 'opacity-50' : ''}`}
                  >
                    {isUploadingVideo ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : (
                      <>
                        <Video className="h-6 w-6 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">رفع فيديو</span>
                      </>
                    )}
                    <input 
                      ref={videoInputRef}
                      type="file" 
                      accept="video/*" 
                      onChange={handleVideoUpload} 
                      className="hidden" 
                      disabled={isUploading || isUploadingVideo}
                    />
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">الحد الأقصى للفيديو: 50MB</p>
            </div>

            {!formData.image_url && !formData.video_url && (
              <div>
                <label className="block text-sm font-medium mb-2">اللون</label>
                <div className="grid grid-cols-3 gap-2">
                  {GRADIENT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, gradient: option.value })}
                      className={`h-12 rounded-lg bg-gradient-to-l ${option.value} ${
                        formData.gradient === option.value ? 'ring-2 ring-foreground ring-offset-2' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">ترتيب الظهور</label>
              <Input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">نشط</label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseForm} className="flex-1">
                {t('cancel')}
              </Button>
              <Button 
                onClick={() => saveMutation.mutate()} 
                disabled={saveMutation.isPending || !formData.title || !formData.subtitle}
                className="flex-1 gradient-primary"
              >
                {saveMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : t('save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmModal
        isOpen={!!deletingBanner}
        onClose={() => setDeletingBanner(null)}
        onConfirm={() => deleteMutation.mutate(deletingBanner?.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminBanners;
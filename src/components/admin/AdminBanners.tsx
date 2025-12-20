import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Image, Video } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import DeleteConfirmModal from "./DeleteConfirmModal";

const GRADIENT_OPTIONS = [
  { label: "أحمر - برتقالي", value: "from-primary via-primary-glow to-accent" },
  { label: "وردي", value: "from-accent via-pink-500 to-primary" },
  { label: "أخضر", value: "from-success via-emerald-400 to-teal-500" },
  { label: "أزرق", value: "from-blue-600 via-blue-500 to-cyan-400" },
  { label: "بنفسجي", value: "from-purple-600 via-purple-500 to-pink-500" },
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

  const { data: banners } = useQuery({
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
      
      setFormData({ ...formData, image_url: publicUrl, video_url: '' });
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
      const { error } = await supabase.from('hero_banners').update({ is_active }).eq('id', id);
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
        title: banner.title || '',
        subtitle: banner.subtitle || '',
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

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBanner(null);
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

  // Check if form has enough data to save (either media or text content)
  const canSave = formData.image_url || formData.video_url || (formData.title && formData.subtitle);

  return (
    <div className="space-y-6" dir={dir}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الإعلانات</h2>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="h-4 w-4 mr-2" />
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
                    <h3 className="text-xl font-bold">{banner.title || ''}</h3>
                    <p className="opacity-90">{banner.subtitle || ''}</p>
                  </div>
                </div>
              </div>
            ) : banner.image_url ? (
              <div className="relative">
                <img src={banner.image_url} alt={banner.title || ''} className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-xl font-bold">{banner.title || ''}</h3>
                    <p className="opacity-90">{banner.subtitle || ''}</p>
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

      <Dialog open={showForm} onOpenChange={handleCloseForm}>
        <DialogContent dir={dir}>
          <DialogHeader>
            <DialogTitle>{editingBanner ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">العنوان (اختياري)</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="تخفيضات الموسم"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">النص الفرعي (اختياري)</label>
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
              ) : null}

              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || isUploadingVideo}
                  className="flex-1"
                >
                  <Image className="h-4 w-4 mr-2" />
                  {isUploading ? 'جاري الرفع...' : 'رفع صورة'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={isUploading || isUploadingVideo}
                  className="flex-1"
                >
                  <Video className="h-4 w-4 mr-2" />
                  {isUploadingVideo ? 'جاري الرفع...' : 'رفع فيديو'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">الحد الأقصى لحجم الفيديو: 50MB</p>
            </div>

            {/* Gradient selection (only if no image/video) */}
            {!formData.image_url && !formData.video_url && (
              <div>
                <label className="block text-sm font-medium mb-2">لون الخلفية</label>
                <div className="grid grid-cols-5 gap-2">
                  {GRADIENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`h-12 rounded-lg bg-gradient-to-l ${opt.value} transition-all ${
                        formData.gradient === opt.value ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      onClick={() => setFormData({ ...formData, gradient: opt.value })}
                      title={opt.label}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <span>نشط</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">ترتيب العرض</label>
              <Input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={() => saveMutation.mutate()}
              disabled={!canSave || saveMutation.isPending}
            >
              {saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmModal
        isOpen={!!deletingBanner}
        onClose={() => setDeletingBanner(null)}
        onConfirm={() => deleteMutation.mutate(deletingBanner?.id)}
      />
    </div>
  );
};

export default AdminBanners;

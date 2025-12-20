import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Upload, Trash2, Phone, Facebook, Instagram, Twitter, Youtube, Globe, Mail, Image, Video, Sparkles } from 'lucide-react';
import defaultLogo from '@/assets/logo.png';
import DeleteConfirmModal from './DeleteConfirmModal';

const SOCIAL_LINKS = [
  { key: 'contact-phone', label: 'رقم الهاتف', icon: Phone, placeholder: '+213 555 123 456' },
  { key: 'contact-email', label: 'البريد الإلكتروني', icon: Mail, placeholder: 'email@example.com' },
  { key: 'contact-facebook', label: 'فيسبوك', icon: Facebook, placeholder: 'https://facebook.com/...' },
  { key: 'contact-instagram', label: 'انستغرام', icon: Instagram, placeholder: 'https://instagram.com/...' },
  { key: 'contact-twitter', label: 'تويتر / X', icon: Twitter, placeholder: 'https://twitter.com/...' },
  { key: 'contact-youtube', label: 'يوتيوب', icon: Youtube, placeholder: 'https://youtube.com/...' },
  { key: 'contact-website', label: 'الموقع الإلكتروني', icon: Globe, placeholder: 'https://...' },
];

const AdminSettings = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [copyright, setCopyright] = useState('');
  const [appName, setAppName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [showDeleteLogo, setShowDeleteLogo] = useState(false);
  const [socialValues, setSocialValues] = useState<Record<string, string>>({});
  const [welcomeMode, setWelcomeMode] = useState('default');
  const [welcomeMedia, setWelcomeMedia] = useState('');
  const [isUploadingWelcome, setIsUploadingWelcome] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const welcomeInputRef = useRef<HTMLInputElement>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('settings').select('*');
      if (error) throw error;
      
      const copyrightSetting = data?.find(s => s.key === 'copyright');
      const logoSetting = data?.find(s => s.key === 'app-logo');
      const appNameSetting = data?.find(s => s.key === 'app-name');
      const welcomeModeSetting = data?.find(s => s.key === 'welcome-mode');
      const welcomeMediaSetting = data?.find(s => s.key === 'welcome-media');
      
      setCopyright(copyrightSetting?.value || 'app dv');
      setLogoUrl(logoSetting?.value || '');
      setAppName(appNameSetting?.value || 'BOUTIQUE MANCER');
      setWelcomeMode(welcomeModeSetting?.value || 'default');
      setWelcomeMedia(welcomeMediaSetting?.value || '');
      
      // Set social values
      const socialData: Record<string, string> = {};
      SOCIAL_LINKS.forEach(link => {
        const setting = data?.find(s => s.key === link.key);
        socialData[link.key] = setting?.value || '';
      });
      setSocialValues(socialData);
      
      return data;
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data: existingData } = await supabase
        .from('settings')
        .select('id')
        .eq('key', key)
        .maybeSingle();

      if (existingData) {
        const { error } = await supabase
          .from('settings')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('key', key);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('settings')
          .insert({ key, value });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      queryClient.invalidateQueries({ queryKey: ['all-settings'] });
      queryClient.invalidateQueries({ queryKey: ['copyright-setting'] });
      queryClient.invalidateQueries({ queryKey: ['app-logo-setting'] });
      queryClient.invalidateQueries({ queryKey: ['app-name-setting'] });
      queryClient.invalidateQueries({ queryKey: ['app-settings'] });
      queryClient.invalidateQueries({ queryKey: ['welcome-settings'] });
      toast.success(t('save'));
    },
    onError: (error) => {
      console.error('Settings update error:', error);
      toast.error(t('error'));
    },
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });
      
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setLogoUrl(publicUrl);
      await updateSettingMutation.mutateAsync({ key: 'app-logo', value: publicUrl });
    } catch (error) {
      console.error(error);
      toast.error(t('error'));
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteLogo = async () => {
    setLogoUrl('');
    await updateSettingMutation.mutateAsync({ key: 'app-logo', value: '' });
    setShowDeleteLogo(false);
  };

  const handleSaveCopyright = () => {
    updateSettingMutation.mutate({ key: 'copyright', value: copyright });
  };

  const handleSaveAppName = () => {
    updateSettingMutation.mutate({ key: 'app-name', value: appName });
  };

  const handleSaveSocialLink = (key: string) => {
    updateSettingMutation.mutate({ key, value: socialValues[key] || '' });
  };

  const handleWelcomeMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingWelcome(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `welcome-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });
      
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setWelcomeMedia(publicUrl);
      await updateSettingMutation.mutateAsync({ key: 'welcome-media', value: publicUrl });
      await updateSettingMutation.mutateAsync({ key: 'welcome-mode', value: 'custom' });
      setWelcomeMode('custom');
    } catch (error) {
      console.error(error);
      toast.error(t('error'));
    } finally {
      setIsUploadingWelcome(false);
      if (welcomeInputRef.current) welcomeInputRef.current.value = '';
    }
  };

  const handleSetDefaultWelcome = async () => {
    setWelcomeMode('default');
    await updateSettingMutation.mutateAsync({ key: 'welcome-mode', value: 'default' });
  };

  const handleDeleteWelcomeMedia = async () => {
    setWelcomeMedia('');
    setWelcomeMode('default');
    await updateSettingMutation.mutateAsync({ key: 'welcome-media', value: '' });
    await updateSettingMutation.mutateAsync({ key: 'welcome-mode', value: 'default' });
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const isWelcomeVideo = welcomeMedia && (welcomeMedia.endsWith('.mp4') || welcomeMedia.endsWith('.webm') || welcomeMedia.endsWith('.mov'));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{t('settings')}</h2>
      
      {/* Welcome Screen Customization */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <label className="block text-sm font-medium text-foreground mb-4">
          تخصيص الواجهة الترحيبية
        </label>
        
        {/* Mode Selection */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleSetDefaultWelcome}
            className={`p-4 rounded-xl border-2 transition-all ${
              welcomeMode === 'default' 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Sparkles className={`h-8 w-8 mx-auto mb-2 ${welcomeMode === 'default' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-sm font-medium ${welcomeMode === 'default' ? 'text-primary' : 'text-foreground'}`}>
              التصميم الافتراضي
            </span>
            <p className="text-xs text-muted-foreground mt-1">المستطيلات البرتقالية</p>
          </button>
          
          <button
            onClick={() => welcomeInputRef.current?.click()}
            className={`p-4 rounded-xl border-2 transition-all ${
              welcomeMode === 'custom' 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Image className={`h-8 w-8 mx-auto mb-2 ${welcomeMode === 'custom' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-sm font-medium ${welcomeMode === 'custom' ? 'text-primary' : 'text-foreground'}`}>
              صورة / فيديو مخصص
            </span>
            <p className="text-xs text-muted-foreground mt-1">رفع صورة أو فيديو</p>
          </button>
        </div>

        <input 
          type="file" 
          accept="image/*,video/*" 
          onChange={handleWelcomeMediaUpload} 
          ref={welcomeInputRef} 
          className="hidden" 
        />

        {isUploadingWelcome && (
          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">جاري الرفع...</span>
          </div>
        )}

        {/* Preview of custom media */}
        {welcomeMode === 'custom' && welcomeMedia && (
          <div className="mt-4 space-y-3">
            <div className="relative aspect-[9/16] max-w-[200px] rounded-xl overflow-hidden border-2 border-border">
              {isWelcomeVideo ? (
                <video 
                  src={welcomeMedia} 
                  className="w-full h-full object-cover"
                  muted
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
                <img 
                  src={welcomeMedia} 
                  alt="Welcome Background" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => welcomeInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                تغيير
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteWelcomeMedia}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                حذف
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Logo Management */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <label className="block text-sm font-medium text-foreground mb-4">
          {t('appLogo')}
        </label>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-xl bg-secondary flex items-center justify-center overflow-hidden border-2 border-border">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <img src={defaultLogo} alt="Default Logo" className="w-full h-full object-contain opacity-50" />
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <input type="file" accept="image/*" onChange={handleLogoUpload} ref={fileInputRef} className="hidden" />
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploadingLogo}>
              {isUploadingLogo ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              {logoUrl ? t('replaceLogo') : t('uploadLogo')}
            </Button>
            
            {logoUrl && (
              <Button type="button" variant="destructive" size="sm" onClick={() => setShowDeleteLogo(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t('deleteLogo')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* App Name Settings */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <label className="block text-sm font-medium text-foreground mb-2">اسم التطبيق</label>
        <Input value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="BOUTIQUE MANCER" className="mb-4" />
        <Button onClick={handleSaveAppName} disabled={updateSettingMutation.isPending} className="gradient-primary">
          {updateSettingMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : t('save')}
        </Button>
      </div>

      {/* Copyright Settings */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <label className="block text-sm font-medium text-foreground mb-2">{t('copyright')}</label>
        <Input value={copyright} onChange={(e) => setCopyright(e.target.value)} placeholder="app dv" className="mb-4" />
        <Button onClick={handleSaveCopyright} disabled={updateSettingMutation.isPending} className="gradient-primary">
          {updateSettingMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : t('save')}
        </Button>
      </div>

      {/* Social Links */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">روابط التواصل الاجتماعي</h3>
        <div className="space-y-4">
          {SOCIAL_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <div key={link.key} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">{link.label}</label>
                  <div className="flex gap-2">
                    <Input
                      value={socialValues[link.key] || ''}
                      onChange={(e) => setSocialValues({ ...socialValues, [link.key]: e.target.value })}
                      placeholder={link.placeholder}
                      dir="ltr"
                      className="flex-1"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleSaveSocialLink(link.key)}
                      disabled={updateSettingMutation.isPending}
                    >
                      {t('save')}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Logo Confirmation */}
      <DeleteConfirmModal
        isOpen={showDeleteLogo}
        onClose={() => setShowDeleteLogo(false)}
        onConfirm={handleDeleteLogo}
        isLoading={updateSettingMutation.isPending}
      />
    </div>
  );
};

export default AdminSettings;
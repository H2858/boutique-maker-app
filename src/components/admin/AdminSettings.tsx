import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Upload, Trash2 } from 'lucide-react';
import defaultLogo from '@/assets/logo.png';

const AdminSettings = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [copyright, setCopyright] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('settings').select('*');
      if (error) throw error;
      const copyrightSetting = data?.find(s => s.key === 'copyright');
      const logoSetting = data?.find(s => s.key === 'app-logo');
      setCopyright(copyrightSetting?.value || 'app dv');
      setLogoUrl(logoSetting?.value || '');
      return data;
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      // First check if setting exists
      const { data: existingData } = await supabase
        .from('settings')
        .select('id')
        .eq('key', key)
        .maybeSingle();

      if (existingData) {
        // Update existing setting
        const { error } = await supabase
          .from('settings')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('key', key);
        if (error) throw error;
      } else {
        // Insert new setting
        const { error } = await supabase
          .from('settings')
          .insert({ key, value });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      queryClient.invalidateQueries({ queryKey: ['copyright-setting'] });
      queryClient.invalidateQueries({ queryKey: ['app-logo-setting'] });
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
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteLogo = async () => {
    setLogoUrl('');
    await updateSettingMutation.mutateAsync({ key: 'app-logo', value: '' });
  };

  const handleSaveCopyright = () => {
    updateSettingMutation.mutate({ key: 'copyright', value: copyright });
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{t('settings')}</h2>
      
      {/* Logo Management */}
      <div className="bg-card rounded-xl p-6 shadow-card max-w-md">
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
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingLogo}
            >
              {isUploadingLogo ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {logoUrl ? t('replaceLogo') : t('uploadLogo')}
            </Button>
            
            {logoUrl && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDeleteLogo}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('deleteLogo')}
              </Button>
            )}
          </div>
        </div>
        
        {!logoUrl && (
          <p className="text-xs text-muted-foreground">
            {t('noLogoMessage')}
          </p>
        )}
      </div>

      {/* Copyright Settings */}
      <div className="bg-card rounded-xl p-6 shadow-card max-w-md">
        <label className="block text-sm font-medium text-foreground mb-2">
          {t('copyright')}
        </label>
        <Input
          value={copyright}
          onChange={(e) => setCopyright(e.target.value)}
          placeholder="app dv"
          className="mb-4"
        />
        <Button 
          onClick={handleSaveCopyright} 
          disabled={updateSettingMutation.isPending} 
          className="gradient-primary"
        >
          {updateSettingMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : t('save')}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
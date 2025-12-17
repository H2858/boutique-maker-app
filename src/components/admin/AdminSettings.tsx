import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AdminSettings = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [copyright, setCopyright] = useState('');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('settings').select('*');
      if (error) throw error;
      const copyrightSetting = data?.find(s => s.key === 'copyright');
      setCopyright(copyrightSetting?.value || 'app dv');
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'copyright', value: copyright }, { onConflict: 'key' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      queryClient.invalidateQueries({ queryKey: ['copyright-setting'] });
      toast.success(t('save'));
    },
    onError: () => toast.error(t('error')),
  });

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">{t('settings')}</h2>
      
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
        <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending} className="gradient-primary">
          {updateMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : t('save')}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;

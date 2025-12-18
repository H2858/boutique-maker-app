import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lock, Mail, Loader2 } from 'lucide-react';
import defaultLogo from '@/assets/logo.png';
import { useQuery } from '@tanstack/react-query';

const AdminLogin = () => {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: logoSetting } = useQuery({
    queryKey: ['app-logo-setting'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'app-logo')
        .maybeSingle();
      if (error) throw error;
      return data?.value || '';
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (roleError || roleData?.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Unauthorized');
      }

      toast.success(t('login'));
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir={dir}>
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-card p-8">
          <div className="flex flex-col items-center mb-8">
            <img 
              src={logoSetting || defaultLogo} 
              alt="Logo" 
              className="w-20 h-20 object-contain mb-4" 
            />
            <h1 className="text-2xl font-bold text-foreground">{t('adminPanel')}</h1>
            <p className="text-muted-foreground">{t('login')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder={t('email')}
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder={t('password')}
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 font-bold rounded-xl gradient-primary text-primary-foreground"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : t('login')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
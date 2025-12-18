import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun, Globe, Lock, Phone, Facebook, Instagram, Youtube, Twitter, Globe2, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SettingsPage = () => {
  const { language, setLanguage, t, dir } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const { data: settings } = useQuery({
    queryKey: ['all-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('settings').select('*');
      if (error) throw error;
      return data;
    },
  });

  const getSetting = (key: string) => settings?.find(s => s.key === key)?.value || '';

  const copyrightSetting = getSetting('copyright') || 'app dv';
  const phoneLink = getSetting('contact-phone');
  const facebookLink = getSetting('contact-facebook');
  const instagramLink = getSetting('contact-instagram');
  const twitterLink = getSetting('contact-twitter');
  const youtubeLink = getSetting('contact-youtube');
  const websiteLink = getSetting('contact-website');
  const emailLink = getSetting('contact-email');

  const socialLinks = [
    { key: 'phone', value: phoneLink, icon: Phone, color: 'text-green-600', href: `tel:${phoneLink}` },
    { key: 'facebook', value: facebookLink, icon: Facebook, color: 'text-blue-600', href: facebookLink },
    { key: 'instagram', value: instagramLink, icon: Instagram, color: 'text-pink-600', href: instagramLink },
    { key: 'twitter', value: twitterLink, icon: Twitter, color: 'text-sky-500', href: twitterLink },
    { key: 'youtube', value: youtubeLink, icon: Youtube, color: 'text-red-600', href: youtubeLink },
    { key: 'website', value: websiteLink, icon: Globe2, color: 'text-primary', href: websiteLink },
    { key: 'email', value: emailLink, icon: Mail, color: 'text-orange-500', href: `mailto:${emailLink}` },
  ].filter(link => link.value);

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'ar', name: t('arabic'), nativeName: 'العربية' },
    { code: 'en', name: t('english'), nativeName: 'English' },
    { code: 'fr', name: t('french'), nativeName: 'Français' },
    { code: 'ber', name: t('amazigh'), nativeName: 'ⵜⴰⵎⴰⵣⵉⵖⵜ' },
  ];

  return (
    <div className="px-4 py-6" dir={dir}>
      <h1 className="text-2xl font-bold text-foreground mb-6">{t('settings')}</h1>

      {/* Dark Mode */}
      <div className="bg-card rounded-2xl p-4 mb-4 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? (
              <Moon className="h-5 w-5 text-primary" />
            ) : (
              <Sun className="h-5 w-5 text-warning" />
            )}
            <span className="font-medium text-foreground">{t('darkMode')}</span>
          </div>
          <div dir="ltr">
            <Switch checked={isDark} onCheckedChange={toggleTheme} />
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <div className="bg-card rounded-2xl p-4 mb-4 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5 text-primary" />
          <span className="font-medium text-foreground">{t('language')}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`p-3 rounded-xl text-center transition-all duration-200 ${
                language === lang.code
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              <span className="block font-medium">{lang.nativeName}</span>
              <span className="block text-xs opacity-80">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Social Links */}
      {socialLinks.length > 0 && (
        <div className="bg-card rounded-2xl p-4 mb-4 shadow-card">
          <h3 className="font-medium text-foreground mb-4">{t('contactUs')}</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.key}
                  href={link.href}
                  target={link.key !== 'phone' && link.key !== 'email' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-full bg-secondary flex items-center justify-center transition-all hover:scale-110 ${link.color}`}
                >
                  <Icon className="h-6 w-6" />
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Admin Access */}
      <div className="bg-card rounded-2xl p-4 mb-6 shadow-card">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => navigate('/admin')}
        >
          <Lock className="h-4 w-4" />
          {t('adminPanel')}
        </Button>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>{t('copyright')} © {new Date().getFullYear()}</p>
        <p className="font-medium">{copyrightSetting}</p>
      </div>
    </div>
  );
};

export default SettingsPage;
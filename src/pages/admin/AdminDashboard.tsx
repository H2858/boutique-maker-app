import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, Settings, LogOut } from 'lucide-react';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminSettings from '@/components/admin/AdminSettings';

const AdminDashboard = () => {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin');
      return;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleData?.role !== 'admin') {
      navigate('/admin');
      return;
    }

    setIsAuthorized(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  if (!isAuthorized) return null;

  const tabs = [
    { id: 'products', icon: Package, label: t('manageProducts') },
    { id: 'orders', icon: ShoppingCart, label: t('manageOrders') },
    { id: 'settings', icon: Settings, label: t('manageSettings') },
  ];

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="container flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">{t('adminPanel')}</h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-2" />
            {t('logout')}
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-card border-b border-border">
        <div className="container flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="container py-6">
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
};

export default AdminDashboard;

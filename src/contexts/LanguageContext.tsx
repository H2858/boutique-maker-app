import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en' | 'fr' | 'ber';

interface Translations {
  [key: string]: {
    ar: string;
    en: string;
    fr: string;
    ber: string;
  };
}

export const translations: Translations = {
  // Navigation
  home: { ar: 'الرئيسية', en: 'Home', fr: 'Accueil', ber: 'ⴰⵙⵏⵓⴱⴳ' },
  categories: { ar: 'الأقسام', en: 'Categories', fr: 'Catégories', ber: 'ⵜⴰⴳⴳⴰⵢⵉⵏ' },
  favorites: { ar: 'المفضلة', en: 'Favorites', fr: 'Favoris', ber: 'ⵉⵎⵓⵔⴰⵏ' },
  settings: { ar: 'الإعدادات', en: 'Settings', fr: 'Paramètres', ber: 'ⵉⵙⵖⴰⵍ' },
  offers: { ar: 'العروض', en: 'Offers', fr: 'Offres', ber: 'ⵉⵙⵜⴰⵢⵏ' },
  newArrivals: { ar: 'الجديد', en: 'New', fr: 'Nouveau', ber: 'ⴰⵎⴰⵢⵏⵓ' },
  
  // Welcome
  welcome: { ar: 'مرحباً بك في', en: 'Welcome to', fr: 'Bienvenue à', ber: 'ⴰⵏⵙⵓⴼ ⵖⵔ' },
  getStarted: { ar: 'ابدأ الآن', en: 'GET STARTED', fr: 'COMMENCER', ber: 'ⴱⴷⵓ' },
  discoverProducts: { ar: 'اكتشف أفضل المنتجات بأسعار مميزة', en: 'Discover the best products at great prices', fr: 'Découvrez les meilleurs produits à des prix exceptionnels', ber: 'ⴰⴼ ⵉⴼⵔⴷⵉⵙⵏ ⵉⴼⵓⵍⴽⵉⵏ' },
  agreeTerms: { ar: 'بالمتابعة، أنت توافق على شروط الاستخدام', en: 'By continuing, you agree to our terms', fr: 'En continuant, vous acceptez nos conditions', ber: 'ⵙ ⵓⴽⵎⵎⵍ, ⵜⵇⴱⵍⴷ ⵜⵉⵡⵜⵉⵍⵉⵏ' },
  
  // Products
  products: { ar: 'المنتجات', en: 'Products', fr: 'Produits', ber: 'ⵉⴼⵔⴷⵉⵙⵏ' },
  featuredProducts: { ar: 'منتجات مميزة', en: 'Featured Products', fr: 'Produits en vedette', ber: 'ⵉⴼⵔⴷⵉⵙⵏ ⵉⵎⵓⵔⴰⵏ' },
  viewAll: { ar: 'عرض الكل', en: 'View All', fr: 'Voir tout', ber: 'ⵥⵔ ⴽⵓⵍⵍⵓ' },
  sales: { ar: 'مبيعات', en: 'sales', fr: 'ventes', ber: 'ⵜⵉⵣⵏⵣⵉⵡⵉⵏ' },
  orderProduct: { ar: 'طلب المنتج', en: 'Order Product', fr: 'Commander', ber: 'ⴰⵣⵣⵏⵣ' },
  productDetails: { ar: 'تفاصيل المنتج', en: 'Product Details', fr: 'Détails du produit', ber: 'ⵉⵙⴼⴽⴰ ⵏ ⵓⴼⵔⴷⵉⵙ' },
  availableColors: { ar: 'الألوان المتوفرة', en: 'Available Colors', fr: 'Couleurs disponibles', ber: 'ⵉⴽⵍⴰⵏ ⵉⵍⵍⴰⵏ' },
  availableSizes: { ar: 'المقاسات المتوفرة', en: 'Available Sizes', fr: 'Tailles disponibles', ber: 'ⵜⵉⵖⵣⵉ ⵉⵍⵍⴰⵏ' },
  description: { ar: 'الوصف', en: 'Description', fr: 'Description', ber: 'ⴰⴳⵍⴰⵎ' },
  storeLocation: { ar: 'موقع المحل', en: 'Store Location', fr: 'Emplacement du magasin', ber: 'ⴰⴷⵖⴰⵔ ⵏ ⵜⵃⴰⵏⵓⵜ' },
  phoneNumber: { ar: 'رقم الهاتف', en: 'Phone Number', fr: 'Numéro de téléphone', ber: 'ⵓⵟⵟⵓⵏ ⵏ ⵜⵉⵍⵉⴼⵓⵏ' },
  viewProduct: { ar: 'عرض المنتج', en: 'View Product', fr: 'Voir le produit', ber: 'ⵥⵔ ⴰⴼⵔⴷⵉⵙ' },
  
  // Order Form
  orderForm: { ar: 'نموذج الطلب', en: 'Order Form', fr: 'Formulaire de commande', ber: 'ⵜⴰⵍⵖⴰ ⵏ ⵓⵣⵣⵏⵣ' },
  yourName: { ar: 'اسمك', en: 'Your Name', fr: 'Votre nom', ber: 'ⵉⵙⵎ ⵏⵏⴽ' },
  yourPhone: { ar: 'رقم هاتفك', en: 'Your Phone', fr: 'Votre téléphone', ber: 'ⵜⵉⵍⵉⴼⵓⵏ ⵏⵏⴽ' },
  yourLocation: { ar: 'موقعك الجغرافي', en: 'Your Location', fr: 'Votre emplacement', ber: 'ⴰⴷⵖⴰⵔ ⵏⵏⴽ' },
  selectColors: { ar: 'اختر الألوان', en: 'Select Colors', fr: 'Sélectionner les couleurs', ber: 'ⵙⵜⵉ ⵉⴽⵍⴰⵏ' },
  selectSizes: { ar: 'اختر المقاسات', en: 'Select Sizes', fr: 'Sélectionner les tailles', ber: 'ⵙⵜⵉ ⵜⵉⵖⵣⵉ' },
  notes: { ar: 'ملاحظات', en: 'Notes', fr: 'Notes', ber: 'ⵜⵉⵏⵥⵉⵢⵉⵏ' },
  submitOrder: { ar: 'إرسال الطلب', en: 'Submit Order', fr: 'Soumettre la commande', ber: 'ⴰⵣⵏ ⴰⵣⵣⵏⵣ' },
  orderSuccess: { ar: 'تم إرسال طلبك بنجاح!', en: 'Your order has been submitted successfully!', fr: 'Votre commande a été soumise avec succès!', ber: 'ⵉⵜⵜⵡⴰⵣⵏ ⵓⵣⵣⵏⵣ ⵏⵏⴽ!' },
  quantity: { ar: 'الكمية', en: 'Quantity', fr: 'Quantité', ber: 'ⵜⴰⵎⴰⴽⵜ' },
  
  // Settings
  language: { ar: 'اللغة', en: 'Language', fr: 'Langue', ber: 'ⵜⵓⵜⵍⴰⵢⵜ' },
  darkMode: { ar: 'الوضع الليلي', en: 'Dark Mode', fr: 'Mode sombre', ber: 'ⴰⵙⴽⴽⵉⵍ ⴰⴱⴻⵔⴽⴰⵏ' },
  arabic: { ar: 'العربية', en: 'Arabic', fr: 'Arabe', ber: 'ⵜⴰⵄⵔⴰⴱⵜ' },
  english: { ar: 'الإنجليزية', en: 'English', fr: 'Anglais', ber: 'ⵜⴰⵏⴳⵍⵉⵣⵜ' },
  french: { ar: 'الفرنسية', en: 'French', fr: 'Français', ber: 'ⵜⴰⴼⵔⴰⵏⵙⵉⵙⵜ' },
  amazigh: { ar: 'الأمازيغية', en: 'Amazigh', fr: 'Amazigh', ber: 'ⵜⴰⵎⴰⵣⵉⵖⵜ' },
  copyright: { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved', fr: 'Tous droits réservés', ber: 'ⴰⴽⴽ ⵉⵣⵔⴼⴰⵏ ⵜⵜⵡⴰⵃⵔⵣⵏ' },
  contactUs: { ar: 'تواصل معنا', en: 'Contact Us', fr: 'Contactez-nous', ber: 'ⵎⵢⴰⵡⴰⴹ ⴷⵉⴷⵏⵖ' },
  
  // Admin
  adminPanel: { ar: 'لوحة التحكم', en: 'Admin Panel', fr: 'Panneau d\'administration', ber: 'ⴰⴳⵎⵔ ⵏ ⵓⵙⵙⵓⴷⵓ' },
  login: { ar: 'تسجيل الدخول', en: 'Login', fr: 'Connexion', ber: 'ⴰⴽⵛⴰⵎ' },
  email: { ar: 'البريد الإلكتروني', en: 'Email', fr: 'Email', ber: 'ⵉⵎⴰⵢⵍ' },
  password: { ar: 'كلمة المرور', en: 'Password', fr: 'Mot de passe', ber: 'ⵜⴰⴳⵓⵔⵉ ⵜⵓⴼⴼⵉⵔⵜ' },
  addProduct: { ar: 'إضافة منتج', en: 'Add Product', fr: 'Ajouter un produit', ber: 'ⵔⵏⵓ ⴰⴼⵔⴷⵉⵙ' },
  editProduct: { ar: 'تعديل المنتج', en: 'Edit Product', fr: 'Modifier le produit', ber: 'ⵙⵏⴼⵍ ⴰⴼⵔⴷⵉⵙ' },
  deleteProduct: { ar: 'حذف المنتج', en: 'Delete Product', fr: 'Supprimer le produit', ber: 'ⴽⴽⵙ ⴰⴼⵔⴷⵉⵙ' },
  orders: { ar: 'الطلبات', en: 'Orders', fr: 'Commandes', ber: 'ⵉⵣⵣⵏⵣⴰⵏ' },
  productName: { ar: 'اسم المنتج', en: 'Product Name', fr: 'Nom du produit', ber: 'ⵉⵙⵎ ⵏ ⵓⴼⵔⴷⵉⵙ' },
  price: { ar: 'السعر', en: 'Price', fr: 'Prix', ber: 'ⴰⵙⵡⴰⵎ' },
  discountPrice: { ar: 'السعر بعد الخصم', en: 'Discount Price', fr: 'Prix réduit', ber: 'ⴰⵙⵡⴰⵎ ⵓⵙⵜⴰⵢ' },
  category: { ar: 'القسم', en: 'Category', fr: 'Catégorie', ber: 'ⵜⴰⴳⴳⴰⵢⵜ' },
  categoryMen: { ar: 'الرجال', en: 'Men', fr: 'Hommes', ber: 'ⵉⵔⴳⴰⵣⵏ' },
  categoryWomen: { ar: 'النساء', en: 'Women', fr: 'Femmes', ber: 'ⵜⵉⵎⵖⴰⵔⵉⵏ' },
  categoryKids: { ar: 'الأطفال', en: 'Kids', fr: 'Enfants', ber: 'ⵉⵃⵏⵊⵉⵔⵏ' },
  categoryAccessories: { ar: 'الإكسسوارات', en: 'Accessories', fr: 'Accessoires', ber: 'ⵉⵎⵓⵙⵙⵓⵜⵏ' },
  save: { ar: 'حفظ', en: 'Save', fr: 'Enregistrer', ber: 'ⵃⵔⵣ' },
  cancel: { ar: 'إلغاء', en: 'Cancel', fr: 'Annuler', ber: 'ⵙⵔ' },
  delete: { ar: 'حذف', en: 'Delete', fr: 'Supprimer', ber: 'ⴽⴽⵙ' },
  confirmDelete: { ar: 'هل تريد حذف هذا العنصر؟', en: 'Do you want to delete this item?', fr: 'Voulez-vous supprimer cet élément?', ber: 'ⵜⵅⵙⴷ ⴰⴷ ⵜⴽⴽⵙⴷ ⴰⵢⴰ?' },
  yes: { ar: 'نعم', en: 'Yes', fr: 'Oui', ber: 'ⵢⴰⵀ' },
  no: { ar: 'لا', en: 'No', fr: 'Non', ber: 'ⵓⵀⵓ' },
  uploadImages: { ar: 'رفع الصور', en: 'Upload Images', fr: 'Télécharger des images', ber: 'ⵙⴰⵍⵉ ⵜⵉⵡⵍⴰⴼⵉⵏ' },
  colors: { ar: 'الألوان', en: 'Colors', fr: 'Couleurs', ber: 'ⵉⴽⵍⴰⵏ' },
  sizes: { ar: 'المقاسات', en: 'Sizes', fr: 'Tailles', ber: 'ⵜⵉⵖⵣⵉ' },
  logout: { ar: 'تسجيل الخروج', en: 'Logout', fr: 'Déconnexion', ber: 'ⴼⴼⵖ' },
  manageProducts: { ar: 'إدارة المنتجات', en: 'Manage Products', fr: 'Gérer les produits', ber: 'ⵙⵡⵓⴷⴷⵓ ⵉⴼⵔⴷⵉⵙⵏ' },
  manageOrders: { ar: 'إدارة الطلبات', en: 'Manage Orders', fr: 'Gérer les commandes', ber: 'ⵙⵡⵓⴷⴷⵓ ⵉⵣⵣⵏⵣⴰⵏ' },
  manageSettings: { ar: 'إدارة الإعدادات', en: 'Manage Settings', fr: 'Gérer les paramètres', ber: 'ⵙⵡⵓⴷⴷⵓ ⵉⵙⵖⴰⵍ' },
  searchProducts: { ar: 'ابحث عن منتجات...', en: 'Search products...', fr: 'Rechercher des produits...', ber: 'ⵔⵣⵓ ⵉⴼⵔⴷⵉⵙⵏ...' },
  flashDeals: { ar: 'عروض خاطفة', en: 'Flash Deals', fr: 'Offres Flash', ber: 'ⵉⵙⵜⴰⵢⵏ' },
  noProducts: { ar: 'لا توجد منتجات', en: 'No products found', fr: 'Aucun produit trouvé', ber: 'ⵓⵔ ⵍⵍⵉⵏ ⵉⴼⵔⴷⵉⵙⵏ' },
  loading: { ar: 'جاري التحميل...', en: 'Loading...', fr: 'Chargement...', ber: 'ⵉⵜⵜⴰⵣⵏ...' },
  error: { ar: 'حدث خطأ', en: 'An error occurred', fr: 'Une erreur est survenue', ber: 'ⵜⵍⵍⴰ ⵜⵓⴽⴽⵔⴷⴰ' },
  customerName: { ar: 'اسم الزبون', en: 'Customer Name', fr: 'Nom du client', ber: 'ⵉⵙⵎ ⵏ ⵓⵎⵙⴰⵖ' },
  customerPhone: { ar: 'هاتف الزبون', en: 'Customer Phone', fr: 'Téléphone du client', ber: 'ⵜⵉⵍⵉⴼⵓⵏ ⵏ ⵓⵎⵙⴰⵖ' },
  customerLocation: { ar: 'موقع الزبون', en: 'Customer Location', fr: 'Emplacement du client', ber: 'ⴰⴷⵖⴰⵔ ⵏ ⵓⵎⵙⴰⵖ' },
  orderDate: { ar: 'تاريخ الطلب', en: 'Order Date', fr: 'Date de commande', ber: 'ⴰⵙⴰⴽⵓⴷ ⵏ ⵓⵣⵣⵏⵣ' },
  actions: { ar: 'الإجراءات', en: 'Actions', fr: 'Actions', ber: 'ⵜⵉⴳⴰⵡⵉⵏ' },
  appLogo: { ar: 'شعار التطبيق', en: 'App Logo', fr: 'Logo de l\'application', ber: 'ⴰⵎⴰⵜⴰⵔ ⵏ ⵓⵙⵏⵙ' },
  uploadLogo: { ar: 'رفع الشعار', en: 'Upload Logo', fr: 'Télécharger le logo', ber: 'ⵙⴰⵍⵉ ⴰⵎⴰⵜⴰⵔ' },
  replaceLogo: { ar: 'استبدال الشعار', en: 'Replace Logo', fr: 'Remplacer le logo', ber: 'ⵙⵏⴼⵍ ⴰⵎⴰⵜⴰⵔ' },
  deleteLogo: { ar: 'حذف الشعار', en: 'Delete Logo', fr: 'Supprimer le logo', ber: 'ⴽⴽⵙ ⴰⵎⴰⵜⴰⵔ' },
  noLogoMessage: { ar: 'لا يوجد شعار مخصص. سيتم استخدام الشعار الافتراضي.', en: 'No custom logo. Default logo will be used.', fr: 'Pas de logo personnalisé. Le logo par défaut sera utilisé.', ber: 'ⵓⵔ ⵉⵍⵍⵉ ⵓⵎⴰⵜⴰⵔ. ⴰⴷ ⵉⵜⵜⵓⵙⵎⵔⵙ ⵓⵎⴰⵜⴰⵔ ⴰⵎⵣⵡⴰⵔⵓ.' },
  
  // Offers
  specialOffer: { ar: 'عرض خاص', en: 'Special Offer', fr: 'Offre spéciale', ber: 'ⴰⵙⵜⴰⵢ ⴰⵎⵥⵍⴰⵢ' },
  specialOffersDescription: { ar: 'أفضل العروض والتخفيضات', en: 'Best offers and discounts', fr: 'Meilleures offres et réductions', ber: 'ⵉⵙⵜⴰⵢⵏ ⵉⴼⵓⵍⴽⵉⵏ' },
  noOffers: { ar: 'لا توجد عروض حالياً', en: 'No offers available', fr: 'Pas d\'offres disponibles', ber: 'ⵓⵔ ⵍⵍⵉⵏ ⵉⵙⵜⴰⵢⵏ' },
  checkBackLater: { ar: 'تحقق لاحقاً', en: 'Check back later', fr: 'Revenez plus tard', ber: 'ⵓⵖⴰⵍ ⵜⵥⵔⴷ' },
  offerEndsIn: { ar: 'ينتهي العرض في', en: 'Offer ends in', fr: 'L\'offre se termine dans', ber: 'ⴰⵙⵜⴰⵢ ⵉⴽⵎⵎⵍ ⴳ' },
  days: { ar: 'يوم', en: 'days', fr: 'jours', ber: 'ⵓⵙⵙⴰⵏ' },
  hours: { ar: 'ساعة', en: 'hours', fr: 'heures', ber: 'ⵜⵉⵙⵔⴰⴳⵉⵏ' },
  productExpiration: { ar: 'انتهاء صلاحية المنتج', en: 'Product Expiration', fr: 'Expiration du produit', ber: 'ⴰⴽⵎⴰⵍ ⵏ ⵓⴼⵔⴷⵉⵙ' },
  
  // New Arrivals
  newArrivalsDescription: { ar: 'أحدث المنتجات المضافة', en: 'Latest products added', fr: 'Derniers produits ajoutés', ber: 'ⵉⴼⵔⴷⵉⵙⵏ ⵉⵎⴰⵢⵏⵓⵜⵏ' },
  noNewProducts: { ar: 'لا توجد منتجات جديدة', en: 'No new products', fr: 'Pas de nouveaux produits', ber: 'ⵓⵔ ⵍⵍⵉⵏ ⵉⴼⵔⴷⵉⵙⵏ ⵉⵎⴰⵢⵏⵓⵜⵏ' },
  
  // Categories
  back: { ar: 'رجوع', en: 'Back', fr: 'Retour', ber: 'ⵓⵖⴰⵍ' },
  
  // Social
  socialLinks: { ar: 'روابط التواصل', en: 'Social Links', fr: 'Liens sociaux', ber: 'ⵉⵙⵖⵏⴰⵏ ⵏ ⵜⵎⵢⴰⵡⴰⴹⵜ' },
  phone: { ar: 'الهاتف', en: 'Phone', fr: 'Téléphone', ber: 'ⵜⵉⵍⵉⴼⵓⵏ' },
  website: { ar: 'الموقع', en: 'Website', fr: 'Site web', ber: 'ⴰⵙⵉⵜ' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' || language === 'ber' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const dir = language === 'ar' || language === 'ber' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
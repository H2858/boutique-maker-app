-- Add INSERT policy for settings table so admins can add new settings
CREATE POLICY "Admins can insert settings" 
ON public.settings 
FOR INSERT 
WITH CHECK (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::text))));

-- Create hero_banners table for admin-editable banners
CREATE TABLE public.hero_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  gradient TEXT NOT NULL DEFAULT 'from-primary via-primary-glow to-accent',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on hero_banners
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- Banners viewable by everyone
CREATE POLICY "Hero banners are viewable by everyone" 
ON public.hero_banners 
FOR SELECT 
USING (true);

-- Admins can insert banners
CREATE POLICY "Admins can insert hero banners" 
ON public.hero_banners 
FOR INSERT 
WITH CHECK (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::text))));

-- Admins can update banners
CREATE POLICY "Admins can update hero banners" 
ON public.hero_banners 
FOR UPDATE 
USING (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::text))));

-- Admins can delete banners
CREATE POLICY "Admins can delete hero banners" 
ON public.hero_banners 
FOR DELETE 
USING (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::text))));

-- Add trigger for updated_at
CREATE TRIGGER update_hero_banners_updated_at
BEFORE UPDATE ON public.hero_banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default banners
INSERT INTO public.hero_banners (title, subtitle, gradient, sort_order) VALUES
('تخفيضات الموسم', 'خصم يصل إلى 70%', 'from-primary via-primary-glow to-accent', 1),
('وصل حديثاً', 'تشكيلة جديدة', 'from-accent via-pink-500 to-primary', 2),
('شحن مجاني', 'للطلبات الكبيرة', 'from-success via-emerald-400 to-teal-500', 3);
-- Add special offer and expiration columns to products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_special_offer boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS offer_duration_days integer DEFAULT null,
ADD COLUMN IF NOT EXISTS offer_end_date timestamp with time zone DEFAULT null,
ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone DEFAULT null;

-- Add image_url column to hero_banners for image uploads
ALTER TABLE public.hero_banners 
ADD COLUMN IF NOT EXISTS image_url text DEFAULT null;

-- Add quantity column to orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS quantity integer DEFAULT 1;
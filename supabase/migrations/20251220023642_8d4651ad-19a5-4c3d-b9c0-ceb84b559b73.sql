-- Add video_url column to hero_banners table for video ads support
ALTER TABLE public.hero_banners 
ADD COLUMN video_url text NULL;
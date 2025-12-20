-- Make title and subtitle optional in hero_banners table
ALTER TABLE public.hero_banners 
ALTER COLUMN title DROP NOT NULL,
ALTER COLUMN subtitle DROP NOT NULL;

-- Set default values for title and subtitle
ALTER TABLE public.hero_banners 
ALTER COLUMN title SET DEFAULT '',
ALTER COLUMN subtitle SET DEFAULT '';
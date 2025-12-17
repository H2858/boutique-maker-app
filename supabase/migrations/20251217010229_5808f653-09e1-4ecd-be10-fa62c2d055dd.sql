-- Fix the admin role to lowercase
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = 'c8988792-30ea-433f-8a0f-6f5b7d03ab19';

-- Add logo setting if not exists
INSERT INTO public.settings (key, value) 
VALUES ('app-logo', '')
ON CONFLICT (key) DO NOTHING;
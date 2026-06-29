ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS college text,
  ADD COLUMN IF NOT EXISTS degree text,
  ADD COLUMN IF NOT EXISTS graduation_year integer,
  ADD COLUMN IF NOT EXISTS skills_summary text,
  ADD COLUMN IF NOT EXISTS onboarded boolean NOT NULL DEFAULT false;
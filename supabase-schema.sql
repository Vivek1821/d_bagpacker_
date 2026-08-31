-- ==============================================================================
-- 🎬 CREATOR PORTFOLIO & CMS ENGINE — SUPABASE SQL SCHEMA
-- Run this entire script in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ==============================================================================

-- 1. POSTS TABLE (Content Vault)
CREATE TABLE IF NOT EXISTS public.posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Cinematic',
  type TEXT NOT NULL DEFAULT 'reel',
  views TEXT NOT NULL DEFAULT '0',
  likes TEXT NOT NULL DEFAULT '0',
  published BOOLEAN NOT NULL DEFAULT true,
  media_url TEXT,
  date TEXT NOT NULL DEFAULT CURRENT_DATE::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. REELS TABLE (9:16 Feed)
CREATE TABLE IF NOT EXISTS public.reels (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT,
  thumbnail TEXT DEFAULT '🎬',
  views TEXT NOT NULL DEFAULT '0',
  likes TEXT NOT NULL DEFAULT '0',
  category TEXT NOT NULL DEFAULT 'Cinematic',
  published BOOLEAN NOT NULL DEFAULT true,
  date TEXT NOT NULL DEFAULT CURRENT_DATE::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PROJECTS TABLE (Brand Campaigns)
CREATE TABLE IF NOT EXISTS public.projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  deliverables TEXT,
  results TEXT,
  budget TEXT,
  emoji TEXT DEFAULT '🗂️',
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. GEAR TABLE (Production Rig)
CREATE TABLE IF NOT EXISTS public.gear (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Camera',
  "desc" TEXT,
  emoji TEXT DEFAULT '📷',
  badge TEXT DEFAULT 'In Studio',
  in_rig BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. INQUIRIES TABLE (Brand Inbox)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id BIGSERIAL PRIMARY KEY,
  brand_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  budget_range TEXT,
  deliverables TEXT[] DEFAULT '{}',
  timeline TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. STATS TABLE (Numbers That Speak)
CREATE TABLE IF NOT EXISTS public.stats (
  id BIGSERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  suffix TEXT NOT NULL DEFAULT '',
  "desc" TEXT,
  category TEXT DEFAULT 'Metric',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. BUSINESS PROFILE TABLE
CREATE TABLE IF NOT EXISTS public.business_profile (
  id BIGINT PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL DEFAULT 'Vivek Creates',
  handle TEXT NOT NULL DEFAULT '@vivek.creates',
  email TEXT NOT NULL DEFAULT 'hello@vivekcreates.in',
  phone TEXT DEFAULT '+91 98765 43210',
  location TEXT DEFAULT 'Mumbai, India',
  bio TEXT DEFAULT 'Full-time cinematic storyteller creating high-retention commercial reels and UGC campaigns.',
  instagram TEXT DEFAULT 'https://instagram.com/vivek.creates',
  youtube TEXT DEFAULT 'https://youtube.com/@vivek.creates',
  primary_rate TEXT DEFAULT '₹35,000 / Reel',
  retainer_rate TEXT DEFAULT '₹1,50,000 / Month',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY & OPEN ACCESS POLICIES (Public Reads + CMS Inserts)
-- ==============================================================================

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gear ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profile ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access for website demo
CREATE POLICY "Allow public all access on posts" ON public.posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on reels" ON public.reels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on gear" ON public.gear FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on stats" ON public.stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on business_profile" ON public.business_profile FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- SEED INITIAL MOCK DATA
-- ==============================================================================

INSERT INTO public.posts (title, category, type, views, likes, published, date) VALUES
('Golden Hour Bali — FX3 + 24mm', 'Cinematic', 'reel', '5.2M', '421K', true, '2025-08-20'),
('OnePlus Open First Impressions Hook', 'UGC', 'reel', '3.8M', '198K', true, '2025-08-18'),
('Day in My Life — Full-Time Creator', 'Lifestyle', 'reel', '7.1M', '562K', true, '2025-08-15'),
('Mumbai Monsoon — 4K Cinematic Sequence', 'Travel', 'reel', '4.4M', '334K', true, '2025-08-12'),
('When WiFi Cuts Out Mid-Collab', 'Skits', 'reel', '8.3M', '712K', true, '2025-08-08'),
('Color Grading in DaVinci in 60s', 'Tutorial', 'reel', '1.7M', '89K', true, '2025-08-02')
ON CONFLICT DO NOTHING;

INSERT INTO public.reels (title, url, thumbnail, views, likes, category, published, date) VALUES
('Golden Hour Bali — FX3 + 24mm', 'https://instagram.com/reel/1', '🌅', '5.2M', '421K', 'Cinematic', true, '2025-08-20'),
('OnePlus Open First Impressions', 'https://instagram.com/reel/2', '📱', '3.8M', '198K', 'UGC', true, '2025-08-18'),
('Day in My Life — Creator Edition', 'https://instagram.com/reel/3', '🎬', '7.1M', '562K', 'Lifestyle', true, '2025-08-15')
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (title, client, deliverables, results, budget, emoji, status) VALUES
('Galaxy S25 Launch Series', 'Samsung India', '3 Reels, 5 Story Sets, Raw B-roll', '8.3M views, 340% sales lift', '₹4,50,000', '📱', 'Completed'),
('Air Max Day Campaign', 'Nike India', '1 Hero Reel, 2 UGC Cutdowns', '5.2M views, 18K link clicks', '₹3,20,000', '👟', 'Completed'),
('Monsoon Audio Series', 'Spotify India', '4 Podcast Teasers + Story Ads', '3.8M views, 24K new listeners', '₹2,80,000', '🎵', 'Active')
ON CONFLICT DO NOTHING;

INSERT INTO public.gear (name, category, "desc", emoji, badge, in_rig) VALUES
('Sony FX3 Cinema Line', 'Camera', 'Full-frame 4K 120fps 10-bit 4:2:2 cinema camera', '📷', 'A-Cam Cinema', true),
('Sony FE 24-70mm f/2.8 GM II', 'Camera', 'Flagship standard zoom G-Master lens', '🔭', 'Hero Lens', true),
('Rode Wireless PRO', 'Audio', '32-bit float dual wireless recording kit', '🎙️', 'Wireless Audio', true),
('DaVinci Resolve Studio 19', 'Editing', 'ACES color grading suite and NLE workstation', '🎨', 'Color & NLE', true)
ON CONFLICT DO NOTHING;

INSERT INTO public.stats (label, value, suffix, "desc", category) VALUES
('Instagram Followers', 284, 'K', 'Active community with 8.4% engagement rate', 'Social'),
('YouTube Subscribers', 52, 'K', 'Cinematic long-form & Shorts audience', 'Social'),
('Total Content Views', 47, 'M+', 'Organic lifetime views across channels', 'Social'),
('Brand Partnerships', 120, '+', 'Completed campaigns for global & Indian brands', 'Collabs'),
('Avg Engagement Rate', 8, '.4%', '3.5x higher than industry standard average', 'Collabs'),
('5-Star Reviews', 50, '+', '100% on-time delivery track record', 'Collabs')
ON CONFLICT DO NOTHING;

INSERT INTO public.business_profile (id, name, handle, email, phone, location, bio, instagram, youtube, primary_rate, retainer_rate) VALUES
(1, 'Vivek Creates', '@vivek.creates', 'hello@vivekcreates.in', '+91 98765 43210', 'Mumbai, India', 'Full-time cinematic storyteller creating high-retention commercial reels and UGC campaigns.', 'https://instagram.com/vivek.creates', 'https://youtube.com/@vivek.creates', '₹35,000 / Reel', '₹1,50,000 / Month')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email;

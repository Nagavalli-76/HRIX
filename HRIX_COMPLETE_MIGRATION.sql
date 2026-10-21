-- ==============================================================================
-- HRIX PLATFORM - SAFE COMPLETE MIGRATION SCRIPT
-- Combines all 5 migration files into one safe, idempotent script.
-- Designed to be applied to a fresh Supabase project.
-- Run this in the Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/alnaiwujmefifujyxuym/sql/new
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM ENUMS & TYPES (all idempotent via DO $$ blocks)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('creator', 'brand', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE category_type AS ENUM (
      'Fashion', 'Food', 'Fitness', 'Education', 'Technology',
      'Beauty', 'Travel', 'Lifestyle', 'Gaming', 'Finance', 'Real Estate'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE city_type AS ENUM (
      'Hyderabad', 'Kakinada', 'Rajahmundry', 'Vijayawada',
      'Visakhapatnam', 'Bengaluru', 'Chennai', 'Mumbai', 'Remote'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE social_platform AS ENUM ('Instagram', 'YouTube', 'X', 'LinkedIn');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE trust_state AS ENUM (
      'registered-creator', 'verified-creator', 'verified-brand',
      'verified-campaign', 'verification-pending', 'action-required'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE campaign_status AS ENUM ('open', 'closing-soon', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('submitted', 'shortlisted', 'accepted', 'rejected', 'withdrawn');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Ensure 'withdrawn' exists if the enum was created previously
DO $$ BEGIN
  ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'withdrawn';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE collaboration_status AS ENUM (
      'pending', 'accepted', 'active', 'content-submitted',
      'under-review', 'revision-requested', 'approved', 'published', 'completed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_kind AS ENUM (
      'new-campaign', 'campaign-match', 'application-submitted',
      'application-accepted', 'application-rejected', 'new-message',
      'content-review', 'revision-requested', 'content-approved',
      'payment', 'subscription', 'application-withdrawn'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Ensure 'application-withdrawn' exists if the enum was created previously
DO $$ BEGIN
  ALTER TYPE notification_kind ADD VALUE IF NOT EXISTS 'application-withdrawn';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'past-due', 'canceled', 'none');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status AS ENUM ('paid', 'due', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_brand_directory_access(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  IF check_user_id IS NULL THEN
    RETURN false;
  END IF;

  IF public.is_admin(check_user_id) THEN
    RETURN true;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.brand_profiles bp
    JOIN public.user_subscriptions us ON us.user_id = bp.user_id
    JOIN public.subscription_plans sp ON sp.id = us.plan_id
    WHERE bp.user_id = check_user_id
      AND bp.trust = 'verified-brand'
      AND bp.status = 'active'
      AND us.status = 'active'
      AND us.renews_on IS NOT NULL
      AND us.renews_on > timezone('utc'::text, now())
      AND (sp.type = 'brand-access' OR sp.id = 'brand-directory-access')
      AND sp.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. CORE TABLES

-- PROFILES (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'creator',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- CREATOR PROFILES
CREATE TABLE IF NOT EXISTS public.creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  category category_type NOT NULL DEFAULT 'Lifestyle',
  niche TEXT DEFAULT '',
  city city_type NOT NULL DEFAULT 'Hyderabad',
  languages TEXT[] DEFAULT ARRAY['English']::TEXT[],
  follower_count INTEGER NOT NULL DEFAULT 0,
  engagement_rate NUMERIC(5,2) NOT NULL DEFAULT 0.0,
  starting_rate_inr NUMERIC(10,2) NOT NULL DEFAULT 0.0,
  profile_image_url TEXT,
  trust trust_state NOT NULL DEFAULT 'registered-creator',
  availability BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- BRAND PROFILES
CREATE TABLE IF NOT EXISTS public.brand_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT DEFAULT '',
  industry category_type NOT NULL DEFAULT 'Technology',
  city city_type NOT NULL DEFAULT 'Hyderabad',
  website TEXT,
  trust trust_state NOT NULL DEFAULT 'verification-pending',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- SOCIAL ACCOUNTS
CREATE TABLE IF NOT EXISTS public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  platform social_platform NOT NULL,
  handle TEXT NOT NULL,
  followers INTEGER NOT NULL DEFAULT 0,
  engagement_rate NUMERIC(5,2) NOT NULL DEFAULT 0.0,
  profile_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(creator_id, platform)
);

-- PORTFOLIO ITEMS
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  brand TEXT,
  category category_type NOT NULL DEFAULT 'Lifestyle',
  media_url TEXT,
  external_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- CAMPAIGNS
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  category category_type NOT NULL DEFAULT 'Lifestyle',
  city city_type NOT NULL DEFAULT 'Remote',
  budget_inr NUMERIC(10,2) NOT NULL DEFAULT 0.0,
  deliverables TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  platforms social_platform[] NOT NULL DEFAULT ARRAY[]::social_platform[],
  deadline DATE NOT NULL,
  status campaign_status NOT NULL DEFAULT 'open',
  trust trust_state NOT NULL DEFAULT 'verified-campaign',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- CAMPAIGN APPLICATIONS
CREATE TABLE IF NOT EXISTS public.campaign_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  proposal TEXT,
  expected_price NUMERIC(10,2),
  match_score INTEGER NOT NULL DEFAULT 85,
  status application_status NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(campaign_id, creator_id)
);

-- COLLABORATIONS
CREATE TABLE IF NOT EXISTS public.collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.campaign_applications(id) ON DELETE SET NULL,
  status collaboration_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- COLLABORATION EVENTS / TIMELINE
CREATE TABLE IF NOT EXISTS public.collaboration_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_id UUID NOT NULL REFERENCES public.collaborations(id) ON DELETE CASCADE,
  status collaboration_status NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- SHORTLISTED CREATORS (Brand Wishlist)
CREATE TABLE IF NOT EXISTS public.shortlisted_creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(brand_id, creator_id)
);

-- CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- CONVERSATION PARTICIPANTS
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(conversation_id, user_id)
);

-- MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  is_system BOOLEAN NOT NULL DEFAULT false,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind notification_kind NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- VERIFICATION REQUESTS
CREATE TABLE IF NOT EXISTS public.verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('creator', 'brand')),
  entity_id UUID NOT NULL,
  document_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  status trust_state NOT NULL DEFAULT 'verification-pending',
  admin_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  reviewed_at TIMESTAMPTZ,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- SUBSCRIPTION PLANS
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  type TEXT NOT NULL DEFAULT 'registration',
  badge TEXT,
  features TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  duration_days INTEGER DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- USER SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES public.subscription_plans(id),
  status subscription_status NOT NULL DEFAULT 'active',
  renews_on TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- INVOICES
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount_inr NUMERIC(10,2) NOT NULL,
  status invoice_status NOT NULL DEFAULT 'paid',
  issued_on DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_slug ON public.creator_profiles(slug);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_user_id ON public.creator_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_category ON public.creator_profiles(category);
CREATE INDEX IF NOT EXISTS idx_brand_profiles_slug ON public.brand_profiles(slug);
CREATE INDEX IF NOT EXISTS idx_brand_profiles_user_id ON public.brand_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_slug ON public.campaigns(slug);
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON public.campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaign_applications_campaign_id ON public.campaign_applications(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_applications_creator_id ON public.campaign_applications(creator_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_creator_id ON public.collaborations(creator_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_campaign_id ON public.collaborations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
-- From migration 20260928000000
CREATE INDEX IF NOT EXISTS idx_notifications_unread_user
  ON public.notifications(user_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user
  ON public.conversation_participants(user_id, conversation_id);
-- From migration 20260928100000
CREATE UNIQUE INDEX IF NOT EXISTS idx_collaborations_campaign_creator
  ON public.collaborations(campaign_id, creator_id);

-- 6. AUTOMATIC TIMESTAMP TRIGGERS
CREATE OR REPLACE TRIGGER set_profiles_timestamp BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER set_creator_profiles_timestamp BEFORE UPDATE ON public.creator_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER set_brand_profiles_timestamp BEFORE UPDATE ON public.brand_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER set_social_accounts_timestamp BEFORE UPDATE ON public.social_accounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER set_portfolio_items_timestamp BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER set_campaigns_timestamp BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER set_campaign_applications_timestamp BEFORE UPDATE ON public.campaign_applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER set_collaborations_timestamp BEFORE UPDATE ON public.collaborations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER set_conversations_timestamp BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER set_subscription_plans_timestamp BEFORE UPDATE ON public.subscription_plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER set_user_subscriptions_timestamp BEFORE UPDATE ON public.user_subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 1. Grant schema usage and permissions to supabase_auth_admin
GRANT USAGE ON SCHEMA public TO supabase_auth_admin, anon, authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO postgres, service_role, supabase_auth_admin;
GRANT ALL ON TABLE public.creator_profiles TO postgres, service_role, supabase_auth_admin;
GRANT ALL ON TABLE public.brand_profiles TO postgres, service_role, supabase_auth_admin;

-- 7. AUTH TRIGGER: Automatically insert public.profiles on auth.users creation
-- NOTE: 'admin' role CANNOT be granted via signup metadata - blocked below.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_role public.user_role := 'creator';
  v_full_name text;
  v_slug text;
BEGIN
  -- Parse role from user metadata (admin role CANNOT be self-assigned via signup)
  IF NEW.raw_user_meta_data->>'role' = 'brand' THEN
    v_role := 'brand';
  ELSE
    v_role := 'creator';
  END IF;

  v_full_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    split_part(NEW.email, '@', 1)
  );

  -- Insert profile (idempotent)
  INSERT INTO public.profiles (id, role, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    v_role,
    v_full_name,
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create corresponding role record if creator or brand
  IF v_role = 'creator' THEN
    v_slug := lower(regexp_replace(v_full_name, '[^a-zA-Z0-9]', '-', 'g')) || '-' || substring(NEW.id::text, 1, 6);
    INSERT INTO public.creator_profiles (user_id, username, slug, display_name)
    VALUES (
      NEW.id,
      COALESCE(
        NULLIF(lower(regexp_replace(NEW.raw_user_meta_data->>'username', '[^a-z0-9_]', '', 'g')), ''),
        lower(split_part(NEW.email, '@', 1)) || substring(NEW.id::text, 1, 4)
      ),
      v_slug,
      v_full_name
    )
    ON CONFLICT (user_id) DO NOTHING;
  ELSIF v_role = 'brand' THEN
    v_slug := lower(regexp_replace(v_full_name, '[^a-zA-Z0-9]', '-', 'g')) || '-' || substring(NEW.id::text, 1, 6);
    INSERT INTO public.brand_profiles (user_id, brand_name, slug)
    VALUES (
      NEW.id,
      v_full_name,
      v_slug
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block auth
    RAISE WARNING 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin, postgres, service_role;

-- 8. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shortlisted_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- PROFILES Policies
DO $$ BEGIN
  CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL USING (public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Service role can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CREATOR PROFILES Policies
DO $$ BEGIN
  CREATE POLICY "Creator profiles viewable by verified paying brands, admins, and owner" ON public.creator_profiles
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()) OR public.has_brand_directory_access(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Creators can update own creator profile" ON public.creator_profiles FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Creators can insert own creator profile" ON public.creator_profiles FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins have full access to creator profiles" ON public.creator_profiles FOR ALL USING (public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- BRAND PROFILES Policies
DO $$ BEGIN
  CREATE POLICY "Brand profiles viewable by everyone" ON public.brand_profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Brands can update own brand profile" ON public.brand_profiles FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Brands can insert own brand profile" ON public.brand_profiles FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins have full access to brand profiles" ON public.brand_profiles FOR ALL USING (public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- SOCIAL ACCOUNTS Policies
DO $$ BEGIN
  CREATE POLICY "Social accounts viewable by verified paying brands, admins, and owner" ON public.social_accounts
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = creator_id AND cp.user_id = auth.uid())
      OR public.is_admin(auth.uid())
      OR public.has_brand_directory_access(auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Creators can manage own social accounts" ON public.social_accounts
    FOR ALL USING (EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = creator_id AND cp.user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- PORTFOLIO ITEMS Policies
DO $$ BEGIN
  CREATE POLICY "Portfolio items viewable by verified paying brands, admins, and owner" ON public.portfolio_items
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = creator_id AND cp.user_id = auth.uid())
      OR public.is_admin(auth.uid())
      OR public.has_brand_directory_access(auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Creators can manage own portfolio" ON public.portfolio_items
    FOR ALL USING (EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = creator_id AND cp.user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CAMPAIGNS Policies
DO $$ BEGIN
  CREATE POLICY "Campaigns viewable by everyone" ON public.campaigns FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Brands can manage own campaigns" ON public.campaigns
    FOR ALL USING (EXISTS (SELECT 1 FROM public.brand_profiles bp WHERE bp.id = brand_id AND bp.user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins have full access to campaigns" ON public.campaigns FOR ALL USING (public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CAMPAIGN APPLICATIONS Policies
DO $$ BEGIN
  CREATE POLICY "Creators can view own applications" ON public.campaign_applications
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = creator_id AND cp.user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Brands can view applications to their campaigns" ON public.campaign_applications
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.campaigns c JOIN public.brand_profiles bp ON bp.id = c.brand_id
              WHERE c.id = campaign_id AND bp.user_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Creators can insert applications" ON public.campaign_applications
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = creator_id AND cp.user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Brands can update application status" ON public.campaign_applications
    FOR UPDATE USING (
      EXISTS (SELECT 1 FROM public.campaigns c JOIN public.brand_profiles bp ON bp.id = c.brand_id
              WHERE c.id = campaign_id AND bp.user_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins have full access to applications" ON public.campaign_applications FOR ALL USING (public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Creators can withdraw own applications"
    ON public.campaign_applications FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = creator_id AND cp.user_id = auth.uid()))
    WITH CHECK (
      status::text = 'withdrawn'
      AND EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = creator_id AND cp.user_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- COLLABORATIONS Policies
DO $$ BEGIN
  CREATE POLICY "Participants can view collaborations" ON public.collaborations
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = creator_id AND cp.user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM public.campaigns c JOIN public.brand_profiles bp ON bp.id = c.brand_id
                 WHERE c.id = campaign_id AND bp.user_id = auth.uid())
      OR public.is_admin(auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Brands and Creators can update collaborations" ON public.collaborations
    FOR UPDATE USING (
      EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = creator_id AND cp.user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM public.campaigns c JOIN public.brand_profiles bp ON bp.id = c.brand_id
                 WHERE c.id = campaign_id AND bp.user_id = auth.uid())
      OR public.is_admin(auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Creators can create collaborations from own accepted applications"
    ON public.collaborations FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.campaign_applications a
        JOIN public.creator_profiles cp ON cp.id = a.creator_id
        WHERE a.id = application_id
          AND a.campaign_id = campaign_id
          AND a.creator_id = creator_id
          AND a.status = 'accepted'
          AND cp.user_id = auth.uid()
      )
      OR public.is_admin(auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Brands can create collaborations for own accepted applications"
    ON public.collaborations FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.campaign_applications a
        JOIN public.campaigns c ON c.id = a.campaign_id
        JOIN public.brand_profiles bp ON bp.id = c.brand_id
        WHERE a.id = application_id
          AND a.campaign_id = campaign_id
          AND a.creator_id = creator_id
          AND a.status = 'accepted'
          AND bp.user_id = auth.uid()
      )
      OR public.is_admin(auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- COLLABORATION EVENTS Policies
DO $$ BEGIN
  CREATE POLICY "Participants can view collaboration events" ON public.collaboration_events
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.collaborations col WHERE col.id = collaboration_id AND (
          EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = col.creator_id AND cp.user_id = auth.uid())
          OR EXISTS (SELECT 1 FROM public.campaigns c JOIN public.brand_profiles bp ON bp.id = c.brand_id
                     WHERE c.id = col.campaign_id AND bp.user_id = auth.uid())
        )
      )
      OR public.is_admin(auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Participants can insert collaboration events" ON public.collaboration_events
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.collaborations col WHERE col.id = collaboration_id AND (
          EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = col.creator_id AND cp.user_id = auth.uid())
          OR EXISTS (SELECT 1 FROM public.campaigns c JOIN public.brand_profiles bp ON bp.id = c.brand_id
                     WHERE c.id = col.campaign_id AND bp.user_id = auth.uid())
        )
      )
      OR public.is_admin(auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- SHORTLISTED CREATORS Policies
DO $$ BEGIN
  CREATE POLICY "Brands can manage own shortlisted creators" ON public.shortlisted_creators
    FOR ALL USING (EXISTS (SELECT 1 FROM public.brand_profiles bp WHERE bp.id = brand_id AND bp.user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CONVERSATIONS & PARTICIPANTS & MESSAGES Policies
DO $$ BEGIN
  CREATE POLICY "Users can view their conversations" ON public.conversations
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = id AND cp.user_id = auth.uid())
      OR public.is_admin(auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Participants can update conversation timestamps" ON public.conversations
    FOR UPDATE USING (
      EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = id AND cp.user_id = auth.uid())
    )
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Participants can view other participants" ON public.conversation_participants
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.conversation_participants cp2 WHERE cp2.conversation_id = conversation_id AND cp2.user_id = auth.uid())
      OR public.is_admin(auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can join conversations as themselves" ON public.conversation_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can view messages in their conversations" ON public.messages
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid())
      OR public.is_admin(auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can send messages to their conversations" ON public.messages
    FOR INSERT WITH CHECK (
      auth.uid() = sender_id AND
      EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Participants can mark messages read" ON public.messages
    FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = messages.conversation_id AND cp.user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = messages.conversation_id AND cp.user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Participants can mark received messages read" ON public.messages
    FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- NOTIFICATIONS Policies
DO $$ BEGIN
  CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can create own notifications" ON public.notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can delete own notifications" ON public.notifications
    FOR DELETE USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- VERIFICATION REQUESTS Policies
DO $$ BEGIN
  CREATE POLICY "Users can view own verification requests" ON public.verification_requests
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can submit verification requests" ON public.verification_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins can update verification requests" ON public.verification_requests
    FOR UPDATE USING (public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ADMIN AUDIT LOGS Policies
DO $$ BEGIN
  CREATE POLICY "Only admins can view audit logs" ON public.admin_audit_logs
    FOR SELECT USING (public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins can insert audit logs" ON public.admin_audit_logs
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- SUBSCRIPTION PLANS Policies
DO $$ BEGIN
  CREATE POLICY "Subscription plans viewable by everyone" ON public.subscription_plans FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Only admins can modify subscription plans" ON public.subscription_plans
    FOR ALL USING (public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- USER SUBSCRIPTIONS Policies
DO $$ BEGIN
  CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- INVOICES Policies
DO $$ BEGIN
  CREATE POLICY "Users can view own invoices" ON public.invoices
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 9. STORAGE POLICIES
DO $$ BEGIN
  CREATE POLICY "Public Read for Public Buckets" ON storage.objects
    FOR SELECT USING (bucket_id IN ('avatars', 'logos', 'portfolio', 'campaign_assets'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users upload owned public assets" ON storage.objects FOR INSERT
    WITH CHECK (
      auth.role() = 'authenticated'
      AND bucket_id IN ('avatars', 'logos', 'portfolio', 'campaign_assets')
      AND (storage.foldername(name))[1] = auth.uid()::text
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users update owned public assets" ON storage.objects FOR UPDATE
    USING (owner = auth.uid() AND bucket_id IN ('avatars', 'logos', 'portfolio', 'campaign_assets'))
    WITH CHECK (owner = auth.uid() AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users delete owned public assets" ON storage.objects FOR DELETE
    USING (owner = auth.uid() AND bucket_id IN ('avatars', 'logos', 'portfolio', 'campaign_assets'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view own verification documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'verifications' AND (auth.uid() = owner OR public.is_admin(auth.uid())));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users upload own verification documents" ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'verifications'
      AND auth.role() = 'authenticated'
      AND (storage.foldername(name))[1] = auth.uid()::text
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users delete own verification documents" ON storage.objects FOR DELETE
    USING (bucket_id = 'verifications' AND (owner = auth.uid() OR public.is_admin(auth.uid())));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 10. SEED DATA: Subscription Plans
INSERT INTO public.subscription_plans (id, name, tagline, price, type, badge, features, duration_days, is_active)
VALUES
  (
    'entry', 'HRIX Entry', 'Register and set up your creator profile.', 99.00, 'registration', NULL,
    ARRAY['HRIX creator registration','Creator profile setup','Creator profile visibility',
          'Access to the HRIX creator ecosystem','Profile completion tracking',
          'Basic opportunity access when available','Creator dashboard'],
    30, true
  ),
  (
    'profile-audit', 'Profile Audit', 'Get a personalized review of your creator profile.', 499.00, 'service', NULL,
    ARRAY['Personal profile audit','Content/profile presentation review','Bio optimization suggestions',
          'Profile positioning suggestions','Portfolio improvement suggestions','Platform presence review',
          'Audience presentation review','Personalized checklist','Actionable recommendations'],
    365, true
  ),
  (
    'creator-growth', 'Creator Growth', 'Turn your profile into a brand-ready creator presence.', 999.00, 'service',
    'Complete Creator Package',
    ARRAY['Everything in Profile Audit','Complete profile positioning review','Personal creator positioning strategy',
          'Content direction suggestions','Portfolio restructuring recommendations','Brand-readiness checklist',
          'Personalized creator growth roadmap','Recommended next steps','One structured strategy report'],
    365, true
  ),
  (
    'brand-directory-access', 'Brand Directory Access', 'Full access to browse verified creators and direct outreach.', 2999.00, 'brand-access',
    'Brand Plan',
    ARRAY['Full creator directory access','Filter by category, city, and engagement',
          'View full creator portfolios & audience metrics','Direct creator messaging & communication',
          'Campaign pitching & collaboration management','Verified brand badge'],
    30, true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, tagline = EXCLUDED.tagline, price = EXCLUDED.price,
  type = EXCLUDED.type, badge = EXCLUDED.badge, features = EXCLUDED.features,
  duration_days = EXCLUDED.duration_days, is_active = EXCLUDED.is_active;

-- 11. BACKFILL PROFILES FOR EXISTING AUTH USERS
DO $$
DECLARE
  u RECORD;
  v_role user_role;
  v_full_name text;
  v_slug text;
BEGIN
  FOR u IN SELECT * FROM auth.users LOOP
    IF u.raw_user_meta_data->>'role' = 'brand' THEN
      v_role := 'brand';
    ELSE
      v_role := 'creator';
    END IF;

    v_full_name := COALESCE(
      NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
      NULLIF(TRIM(u.raw_user_meta_data->>'name'), ''),
      split_part(u.email, '@', 1)
    );

    INSERT INTO public.profiles (id, role, full_name, email, avatar_url)
    VALUES (u.id, v_role, v_full_name, u.email, u.raw_user_meta_data->>'avatar_url')
    ON CONFLICT (id) DO NOTHING;

    IF v_role = 'creator' THEN
      v_slug := lower(regexp_replace(v_full_name, '[^a-zA-Z0-9]', '-', 'g')) || '-' || substring(u.id::text, 1, 6);
      INSERT INTO public.creator_profiles (user_id, username, slug, display_name)
      VALUES (
        u.id,
        lower(split_part(u.email, '@', 1)) || substring(u.id::text, 1, 4),
        v_slug,
        v_full_name
      )
      ON CONFLICT (user_id) DO NOTHING;
    ELSIF v_role = 'brand' THEN
      v_slug := lower(regexp_replace(v_full_name, '[^a-zA-Z0-9]', '-', 'g')) || '-' || substring(u.id::text, 1, 6);
      INSERT INTO public.brand_profiles (user_id, brand_name, slug)
      VALUES (u.id, v_full_name, v_slug)
      ON CONFLICT (user_id) DO NOTHING;
    END IF;
  END LOOP;
END $$;

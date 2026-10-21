-- ==============================================================================
-- HRIX PLATFORM MIGRATION: BRAND DIRECTORY ACCESS & PRICING UPDATES
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/alnaiwujmefifujyxuym/sql/new
-- ==============================================================================

-- 1. UPDATE SUBSCRIPTION PLANS (Annual billing for creator services + Brand Directory Access)
INSERT INTO public.subscription_plans (id, name, tagline, price, type, badge, features, duration_days, is_active)
VALUES
  (
    'entry', 'HRIX Entry', 'Register and set up your creator profile.', 99.00, 'registration', NULL,
    ARRAY[
      'HRIX creator registration',
      'Creator profile setup',
      'Creator profile visibility',
      'Access to the HRIX creator ecosystem',
      'Profile completion tracking',
      'Basic opportunity access when available',
      'Creator dashboard'
    ],
    30, true
  ),
  (
    'profile-audit', 'Profile Audit', 'Get a personalized review of your creator profile.', 499.00, 'service', NULL,
    ARRAY[
      'Personal profile audit',
      'Content/profile presentation review',
      'Bio optimization suggestions',
      'Profile positioning suggestions',
      'Portfolio improvement suggestions',
      'Platform presence review',
      'Audience presentation review',
      'Personalized checklist',
      'Actionable recommendations'
    ],
    365, true
  ),
  (
    'creator-growth', 'Creator Growth', 'Turn your profile into a brand-ready creator presence.', 999.00, 'service',
    'Complete Creator Package',
    ARRAY[
      'Everything in Profile Audit',
      'Complete profile positioning review',
      'Personal creator positioning strategy',
      'Content direction suggestions',
      'Portfolio restructuring recommendations',
      'Brand-readiness checklist',
      'Personalized creator growth roadmap',
      'Recommended next steps',
      'One structured strategy report'
    ],
    365, true
  ),
  (
    'brand-directory-access', 'Brand Directory Access', 'Full access to browse verified creators and direct outreach.', 2999.00, 'brand-access',
    'Brand Plan',
    ARRAY[
      'Full creator directory access',
      'Filter by category, city, and engagement',
      'View full creator portfolios & audience metrics',
      'Direct creator messaging & communication',
      'Campaign pitching & collaboration management',
      'Verified brand badge'
    ],
    30, true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  price = EXCLUDED.price,
  type = EXCLUDED.type,
  badge = EXCLUDED.badge,
  features = EXCLUDED.features,
  duration_days = EXCLUDED.duration_days,
  is_active = EXCLUDED.is_active,
  updated_at = timezone('utc'::text, now());

-- 2. HELPER FUNCTION: CHECK BRAND DIRECTORY ACCESS ENTITLEMENT
CREATE OR REPLACE FUNCTION public.has_brand_directory_access(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  IF check_user_id IS NULL THEN
    RETURN false;
  END IF;

  -- Administrators always have full access
  IF public.is_admin(check_user_id) THEN
    RETURN true;
  END IF;

  -- User must be a verified brand with an active brand-access subscription
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

GRANT EXECUTE ON FUNCTION public.has_brand_directory_access(uuid) TO anon, authenticated, service_role;

-- 3. RESTRICT CREATOR PROFILES RLS
DROP POLICY IF EXISTS "Creator profiles viewable by everyone" ON public.creator_profiles;
DROP POLICY IF EXISTS "Creator profiles viewable by verified paying brands, admins, and owner" ON public.creator_profiles;

CREATE POLICY "Creator profiles viewable by verified paying brands, admins, and owner"
  ON public.creator_profiles FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_admin(auth.uid())
    OR public.has_brand_directory_access(auth.uid())
  );

-- 4. RESTRICT SOCIAL ACCOUNTS RLS
DROP POLICY IF EXISTS "Social accounts viewable by everyone" ON public.social_accounts;
DROP POLICY IF EXISTS "Social accounts viewable by verified paying brands, admins, and owner" ON public.social_accounts;

CREATE POLICY "Social accounts viewable by verified paying brands, admins, and owner"
  ON public.social_accounts FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = creator_id AND cp.user_id = auth.uid())
    OR public.is_admin(auth.uid())
    OR public.has_brand_directory_access(auth.uid())
  );

-- 5. RESTRICT PORTFOLIO ITEMS RLS
DROP POLICY IF EXISTS "Portfolio items viewable by everyone" ON public.portfolio_items;
DROP POLICY IF EXISTS "Portfolio items viewable by verified paying brands, admins, and owner" ON public.portfolio_items;

CREATE POLICY "Portfolio items viewable by verified paying brands, admins, and owner"
  ON public.portfolio_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = creator_id AND cp.user_id = auth.uid())
    OR public.is_admin(auth.uid())
    OR public.has_brand_directory_access(auth.uid())
  );

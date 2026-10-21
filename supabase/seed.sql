-- ==============================================================================
-- HRIX PLATFORM SEED DATA
-- seed.sql
-- ==============================================================================

-- 1. CREATOR MEMBERSHIP PLANS (Production & Development Single Source of Truth)
-- Configurable products/plans: ₹99, ₹499, ₹999
INSERT INTO public.subscription_plans (id, name, tagline, price, type, badge, features, duration_days, is_active)
VALUES
  (
    'entry',
    'HRIX Entry',
    'Register and set up your creator profile.',
    99.00,
    'registration',
    NULL,
    ARRAY[
      'HRIX creator registration',
      'Creator profile setup',
      'Creator profile visibility',
      'Access to the HRIX creator ecosystem',
      'Profile completion tracking',
      'Basic opportunity access when available',
      'Creator dashboard'
    ],
    30,
    true
  ),
  (
    'profile-audit',
    'Profile Audit',
    'Get a personalized review of your creator profile.',
    499.00,
    'service',
    NULL,
    ARRAY[
      'Personal profile audit',
      'Content/profile presentation review',
      'Bio optimization suggestions',
      'Profile positioning suggestions',
      'Portfolio improvement suggestions',
      'Platform presence review',
      'Audience presentation review',
      'Personalized improvement checklist',
      'Actionable recommendations'
    ],
    30,
    true
  ),
  (
    'creator-growth',
    'Creator Growth',
    'Turn your profile into a brand-ready creator presence.',
    999.00,
    'service',
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
    30,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  price = EXCLUDED.price,
  type = EXCLUDED.type,
  badge = EXCLUDED.badge,
  features = EXCLUDED.features,
  duration_days = EXCLUDED.duration_days,
  is_active = EXCLUDED.is_active;

-- ==============================================================================
-- 2. DEVELOPMENT SEED DATA (DO NOT RUN IN PRODUCTION)
-- The section below is strictly for local development and QA testing.
-- To run dev seed data, verify your environment is not production.
-- ==============================================================================

-- Example sample brand profile for development testing (requires existing user)
-- Note: Real production users are created through Supabase Auth (Sign Up).

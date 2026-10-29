-- HRIX security hardening: profile privacy, immutable authorization fields,
-- and explicit administrator provisioning.
--
-- Apply this migration manually to the intended Supabase project after review.
-- It is intentionally separate from the initial migration because that migration
-- may already have been applied in production.

-- User-controlled Auth metadata may select only the supported self-service roles.
-- Administrator accounts must be provisioned through a controlled database/admin
-- process, never through public signup metadata.
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
  IF NEW.raw_user_meta_data->>'role' = 'brand' THEN
    v_role := 'brand';
  END IF;

  v_full_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    split_part(NEW.email, '@', 1)
  );

  INSERT INTO public.profiles (id, role, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    v_role,
    v_full_name,
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  IF v_role = 'creator' THEN
    v_slug := lower(regexp_replace(v_full_name, '[^a-zA-Z0-9]', '-', 'g'))
      || '-' || substring(NEW.id::text, 1, 6);
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
  ELSE
    v_slug := lower(regexp_replace(v_full_name, '[^a-zA-Z0-9]', '-', 'g'))
      || '-' || substring(NEW.id::text, 1, 6);
    INSERT INTO public.brand_profiles (user_id, brand_name, slug)
    VALUES (NEW.id, v_full_name, v_slug)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Keep the helper safe if it is called from an RLS expression.
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
      AND role = 'admin'::public.user_role
  );
$$;

-- Do not expose the account table. Application-facing public profile data is
-- provided separately below, with no account identifiers or contact fields.
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can update editable profile fields"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Column privileges provide a database-level guard even if a client bypasses
-- the application's profile forms. Admin/service-role paths retain full access.
REVOKE UPDATE (id, role, email, status, created_at, updated_at)
  ON public.profiles FROM anon, authenticated;
GRANT UPDATE (full_name, phone, avatar_url, bio)
  ON public.profiles TO authenticated;

-- Minimal public creator presentation layer. It deliberately excludes user_id,
-- social handles, follower metrics, email, phone, and internal account fields.
DROP VIEW IF EXISTS public.public_creator_profiles;
CREATE VIEW public.public_creator_profiles
WITH (security_invoker = false)
AS
SELECT
  id,
  slug,
  display_name,
  category,
  city,
  bio,
  starting_rate_inr,
  availability,
  created_at
FROM public.creator_profiles
WHERE status = 'active'
  AND trust IN ('registered-creator'::public.trust_state, 'verified-creator'::public.trust_state);

GRANT SELECT ON public.public_creator_profiles TO anon, authenticated;

-- Harden the security-definer trigger's execution context and keep its
-- execution limited to Supabase Auth and server roles.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin, postgres, service_role;


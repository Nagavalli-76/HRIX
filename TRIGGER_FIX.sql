-- ==============================================================================
-- FIX AUTH TRIGGER SEARCH PATH & PERMISSIONS
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/alnaiwujmefifujyxuym/sql/new
-- ==============================================================================

-- 1. Grant schema usage and permissions to supabase_auth_admin
GRANT USAGE ON SCHEMA public TO supabase_auth_admin, anon, authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO postgres, service_role, supabase_auth_admin;
GRANT ALL ON TABLE public.creator_profiles TO postgres, service_role, supabase_auth_admin;
GRANT ALL ON TABLE public.brand_profiles TO postgres, service_role, supabase_auth_admin;

-- 2. Recreate handle_new_user with explicit search_path and public.user_role type
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
    RAISE WARNING 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- 3. Re-link the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin, postgres, service_role;

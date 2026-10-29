-- HRIX Stage 1.2 corrective migration.
-- This migration fixes the gaps in 20261023000000_security_hardening_profiles_and_admin.sql.

-- Keep the database and server-side authorization checks on the same explicit
-- administrator allowlist. Changes to this table must be made by a trusted
-- migration or service-role workflow; it is not exposed to client roles.
CREATE TABLE IF NOT EXISTS public.admin_allowlist (
  email text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

INSERT INTO public.admin_allowlist (email)
VALUES ('hrixofficial@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Provision only an already-existing, exact-match Auth account and profile.
-- Missing accounts/profiles are intentionally left for a trusted manual
-- provisioning workflow; no profile or Auth user is created here.
DO $$
DECLARE
  v_admin_id uuid;
  v_updated integer;
BEGIN
  SELECT id
  INTO v_admin_id
  FROM auth.users
  WHERE lower(email) = 'hrixofficial@gmail.com'
  LIMIT 1;

  IF v_admin_id IS NULL THEN
    RAISE NOTICE 'HRIX admin Auth user hrixofficial@gmail.com was not found; no profile was promoted';
    RETURN;
  END IF;

  UPDATE public.profiles
  SET role = 'admin'::public.user_role
  WHERE id = v_admin_id
    AND lower(email) = 'hrixofficial@gmail.com';

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  IF v_updated = 0 THEN
    RAISE NOTICE 'HRIX admin profile was not found or did not match hrixofficial@gmail.com; no profile was promoted';
  END IF;
END;
$$;

REVOKE ALL ON public.admin_allowlist FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  IF user_id IS NULL THEN
    RETURN false;
  END IF;

  -- A client may only ask about its own identity. Trusted database roles may
  -- use the parameter for server-side workflows.
  IF auth.uid() IS NOT NULL
     AND user_id <> auth.uid()
     AND auth.role() NOT IN ('service_role', 'supabase_auth_admin', 'postgres') THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.profiles p
    JOIN auth.users u ON u.id = p.id
    JOIN public.admin_allowlist a
      ON lower(a.email) = lower(u.email)
    WHERE p.id = user_id
      AND p.role = 'admin'::public.user_role
      AND lower(p.email) = lower(u.email)
      -- HRIX currently has one authorized administrator. Keep the protected
      -- allowlist as a provisioning record, but do not let an additional
      -- trusted entry create database-only admin access.
      AND lower(a.email) = 'hrixofficial@gmail.com'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon, authenticated, service_role;

-- Column grants cannot protect a table when a role also has table-level UPDATE
-- privileges. Enforce the invariant in a trigger instead. Admin JWTs and
-- trusted server/database roles retain their intended ability to update
-- authorization fields.
CREATE OR REPLACE FUNCTION public.prevent_profile_authorization_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NULL
     OR auth.role() IN ('service_role', 'supabase_auth_admin', 'postgres')
     OR public.is_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;

  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.role IS DISTINCT FROM OLD.role
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.email IS DISTINCT FROM OLD.email
     OR NEW.created_at IS DISTINCT FROM OLD.created_at
     OR NEW.updated_at IS DISTINCT FROM OLD.updated_at THEN
    RAISE EXCEPTION 'Authorization-sensitive profile fields cannot be changed by this role'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_profile_authorization_changes ON public.profiles;
CREATE TRIGGER prevent_profile_authorization_changes
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_authorization_changes();

-- The old view was owned by a privileged role and granted to anon, so its
-- omitted columns did not make the directory public-safe. Remove that bypass;
-- callers must use creator_profiles, whose RLS requires the owner, an
-- authorized admin, or an active verified paying brand.
DROP VIEW IF EXISTS public.public_creator_profiles;

-- Keep direct profile updates narrow even though the trigger is the invariant.
REVOKE UPDATE ON public.profiles FROM anon, authenticated;
GRANT UPDATE (full_name, phone, avatar_url, bio) ON public.profiles TO authenticated;

REVOKE EXECUTE ON FUNCTION public.prevent_profile_authorization_changes() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.prevent_profile_authorization_changes() TO authenticated, service_role;

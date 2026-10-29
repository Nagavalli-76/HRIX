-- Read-only preflight checks for
-- 20261024000000_razorpay_payment_ledger.sql.
-- Run this file only in the isolated development Supabase SQL Editor.
--
-- The migration is expected to create the payment_* tables and payment RPCs.
-- profiles, subscription_plans, user_subscriptions, and invoices are expected
-- to exist from the earlier schema migrations.

-- Confirm the objects that must already exist and the objects expected from the
-- Razorpay migration. to_regclass returns NULL instead of raising an error.
SELECT object_name,
       expected_state,
       to_regclass(object_name) IS NOT NULL AS exists_now
FROM (
  VALUES
    ('public.profiles'::text, 'must already exist'),
    ('public.subscription_plans'::text, 'must already exist'),
    ('public.user_subscriptions'::text, 'must already exist'),
    ('public.invoices'::text, 'must already exist'),
    ('public.payment_orders'::text, 'created by Razorpay migration'),
    ('public.payments'::text, 'created by Razorpay migration'),
    ('public.payment_webhook_events'::text, 'created by Razorpay migration')
) AS expected_objects(object_name, expected_state)
ORDER BY object_name;

-- Existing duplicate subscriptions would block the unique
-- user_subscriptions(user_id, plan_id) index. Check both the table and the
-- required columns before parsing the dynamic SELECT.
DO $$
DECLARE
  duplicate_row record;
BEGIN
  IF to_regclass('public.user_subscriptions') IS NULL THEN
    RAISE NOTICE 'BLOCKER: duplicate subscription check could not run because public.user_subscriptions is absent';
  ELSIF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'user_subscriptions'
      AND column_name IN ('user_id', 'plan_id')
    GROUP BY table_schema, table_name
    HAVING COUNT(*) = 2
  ) THEN
    RAISE NOTICE 'BLOCKER: duplicate subscription check could not run because public.user_subscriptions.user_id or plan_id is absent';
  ELSE
    FOR duplicate_row IN EXECUTE
      'SELECT user_id, plan_id, COUNT(*) AS row_count
       FROM public.user_subscriptions
       GROUP BY user_id, plan_id
       HAVING COUNT(*) > 1
       ORDER BY row_count DESC'
    LOOP
      RAISE NOTICE 'DUPLICATE SUBSCRIPTION user_id=% plan_id=% row_count=%',
        duplicate_row.user_id, duplicate_row.plan_id, duplicate_row.row_count;
    END LOOP;
  END IF;
END
$$;

-- Existing duplicate non-null invoice payment IDs would block the partial
-- invoices(payment_id) unique index. payment_id is added by the Razorpay
-- migration, so a pre-migration invoices table commonly lacks this column.
DO $$
DECLARE
  duplicate_row record;
BEGIN
  IF to_regclass('public.invoices') IS NULL THEN
    RAISE NOTICE 'BLOCKER: duplicate invoice payment check could not run because public.invoices is absent';
  ELSIF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'invoices'
      AND column_name = 'payment_id'
  ) THEN
    RAISE NOTICE 'BLOCKER: public.invoices.payment_id is absent; the duplicate invoice payment check could not run and the Razorpay migration prerequisite is not yet satisfied';
  ELSE
    FOR duplicate_row IN EXECUTE
      'SELECT payment_id, COUNT(*) AS row_count
       FROM public.invoices
       WHERE payment_id IS NOT NULL
       GROUP BY payment_id
       HAVING COUNT(*) > 1
       ORDER BY row_count DESC'
    LOOP
      RAISE NOTICE 'DUPLICATE INVOICE PAYMENT payment_id=% row_count=%',
        duplicate_row.payment_id, duplicate_row.row_count;
    END LOOP;
  END IF;
END
$$;

-- Inspect the columns required by the existing schema and the Razorpay
-- migration. Missing rows identify missing or renamed columns without causing
-- the diagnostic to fail when a payment table has not yet been created.
WITH expected_columns(table_name, column_name, expected_type, expected_nullable, expected_state) AS (
  VALUES
    ('profiles', 'id', 'uuid', 'NO', 'existing prerequisite'),
    ('subscription_plans', 'id', 'text', 'NO', 'existing prerequisite'),
    ('subscription_plans', 'price', 'numeric', 'NO', 'existing prerequisite'),
    ('subscription_plans', 'duration_days', 'integer', 'YES', 'existing prerequisite'),
    ('subscription_plans', 'is_active', 'boolean', 'NO', 'existing prerequisite'),
    ('user_subscriptions', 'user_id', 'uuid', 'NO', 'existing prerequisite'),
    ('user_subscriptions', 'plan_id', 'text', 'NO', 'existing prerequisite'),
    ('user_subscriptions', 'status', 'USER-DEFINED', 'NO', 'existing prerequisite'),
    ('user_subscriptions', 'renews_on', 'timestamp with time zone', 'YES', 'existing prerequisite'),
    ('invoices', 'user_id', 'uuid', 'NO', 'existing prerequisite'),
    ('invoices', 'amount_inr', 'numeric', 'NO', 'existing prerequisite'),
    ('invoices', 'status', 'USER-DEFINED', 'NO', 'existing prerequisite'),
    ('invoices', 'payment_id', 'text', 'YES', 'added by Razorpay migration'),
    ('invoices', 'order_id', 'text', 'YES', 'added by Razorpay migration'),
    ('payment_orders', 'id', 'uuid', 'NO', 'created by Razorpay migration'),
    ('payment_orders', 'user_id', 'uuid', 'NO', 'created by Razorpay migration'),
    ('payment_orders', 'plan_id', 'text', 'NO', 'created by Razorpay migration'),
    ('payment_orders', 'razorpay_order_id', 'text', 'NO', 'created by Razorpay migration'),
    ('payment_orders', 'amount_paise', 'integer', 'NO', 'created by Razorpay migration'),
    ('payment_orders', 'currency', 'text', 'NO', 'created by Razorpay migration'),
    ('payment_orders', 'status', 'text', 'NO', 'created by Razorpay migration'),
    ('payment_orders', 'failed_payment_id', 'text', 'YES', 'created by Razorpay migration'),
    ('payment_orders', 'failure_reason', 'text', 'YES', 'created by Razorpay migration'),
    ('payments', 'id', 'uuid', 'NO', 'created by Razorpay migration'),
    ('payments', 'user_id', 'uuid', 'NO', 'created by Razorpay migration'),
    ('payments', 'payment_order_id', 'uuid', 'NO', 'created by Razorpay migration'),
    ('payments', 'plan_id', 'text', 'NO', 'created by Razorpay migration'),
    ('payments', 'razorpay_payment_id', 'text', 'NO', 'created by Razorpay migration'),
    ('payments', 'razorpay_signature', 'text', 'YES', 'created by Razorpay migration'),
    ('payments', 'webhook_signature', 'text', 'YES', 'created by Razorpay migration'),
    ('payments', 'verification_source', 'text', 'NO', 'created by Razorpay migration'),
    ('payments', 'amount_paise', 'integer', 'NO', 'created by Razorpay migration'),
    ('payments', 'currency', 'text', 'NO', 'created by Razorpay migration'),
    ('payments', 'status', 'text', 'NO', 'created by Razorpay migration'),
    ('payment_webhook_events', 'event_id', 'text', 'NO', 'created by Razorpay migration'),
    ('payment_webhook_events', 'event_type', 'text', 'NO', 'created by Razorpay migration'),
    ('payment_webhook_events', 'payload', 'jsonb', 'NO', 'created by Razorpay migration')
)
SELECT e.table_name,
       e.column_name,
       e.expected_type,
       e.expected_nullable,
       e.expected_state,
       c.data_type AS actual_type,
       c.is_nullable AS actual_nullable,
       c.udt_name AS actual_udt_name,
       c.table_name IS NOT NULL AS column_exists
FROM expected_columns e
LEFT JOIN information_schema.columns c
  ON c.table_schema = 'public'
 AND c.table_name = e.table_name
 AND c.column_name = e.column_name
ORDER BY e.table_name, e.column_name;

-- Inspect existing constraints using relation OIDs and schema names rather
-- than conrelid::regclass text comparisons. Missing relations simply produce
-- no rows.
SELECT n.nspname AS schema_name,
       cls.relname AS table_name,
       con.conname,
       con.contype,
       pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
JOIN pg_class cls ON cls.oid = con.conrelid
JOIN pg_namespace n ON n.oid = cls.relnamespace
WHERE n.nspname = 'public'
  AND cls.relname IN (
    'profiles',
    'subscription_plans',
    'user_subscriptions',
    'invoices',
    'payment_orders',
    'payments',
    'payment_webhook_events'
  )
ORDER BY cls.relname, con.conname;

-- Inspect existing indexes, including definitions that may conflict with the
-- migration's IF NOT EXISTS index names or uniqueness requirements.
SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles',
    'subscription_plans',
    'user_subscriptions',
    'invoices',
    'payment_orders',
    'payments',
    'payment_webhook_events'
  )
ORDER BY tablename, indexname;

-- Confirm RLS is enabled and inspect the effective policies.
SELECT n.nspname AS schema_name,
       c.relname AS table_name,
       c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS force_rls
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
    'profiles',
    'subscription_plans',
    'user_subscriptions',
    'invoices',
    'payment_orders',
    'payments',
    'payment_webhook_events'
  )
ORDER BY c.relname;

SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles',
    'subscription_plans',
    'user_subscriptions',
    'invoices',
    'payment_orders',
    'payments',
    'payment_webhook_events'
  )
ORDER BY tablename, policyname;

-- Inspect table-level grants separately from RLS. A policy cannot grant a
-- privilege that the role does not have, and RLS does not remove table grants.
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles',
    'subscription_plans',
    'user_subscriptions',
    'invoices',
    'payment_orders',
    'payments',
    'payment_webhook_events'
  )
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY table_name, grantee, privilege_type;

-- Report all overloads, owners, SECURITY DEFINER state, and function
-- configuration. The payment RPCs are expected to exist only after the
-- Razorpay migration has been applied.
SELECT n.nspname AS schema_name,
       p.proname AS function_name,
       p.oid::regprocedure AS identity,
       pg_get_function_identity_arguments(p.oid) AS identity_arguments,
       p.prosecdef AS security_definer,
       pg_get_userbyid(p.proowner) AS owner,
       p.proconfig AS configuration
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN (
    'is_admin',
    'finalize_razorpay_payment',
    'mark_razorpay_payment_failed'
  )
ORDER BY p.proname, identity_arguments;

-- Check the exact expected payment RPC signatures without assuming that the
-- migration has already been applied.
WITH expected_functions(function_name, identity_arguments, expected_state) AS (
  VALUES
    (
      'finalize_razorpay_payment',
      'uuid, text, text, text, text, integer, text',
      'created by Razorpay migration'
    ),
    (
      'mark_razorpay_payment_failed',
      'uuid, text, integer, text, text',
      'created by Razorpay migration'
    )
)
SELECT e.function_name,
       e.identity_arguments,
       e.expected_state,
       p.oid IS NOT NULL AS exact_signature_exists,
       p.prosecdef AS security_definer,
       pg_get_userbyid(p.proowner) AS owner,
       p.proconfig AS configuration
FROM expected_functions e
LEFT JOIN pg_proc p
  ON p.pronamespace = 'public'::regnamespace
 AND p.proname = e.function_name
 AND pg_get_function_identity_arguments(p.oid) = e.identity_arguments
ORDER BY e.function_name;

-- Report explicitly listed function ACL entries. grantee_oid = 0 means
-- PUBLIC. This is distinct from effective privileges checked below.
SELECT n.nspname AS schema_name,
       p.oid::regprocedure AS identity,
       p.proname AS function_name,
       acl.grantee AS grantee_oid,
       CASE WHEN acl.grantee = 0 THEN 'PUBLIC' ELSE r.rolname END AS grantee,
       acl.privilege_type,
       acl.is_grantable
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
LEFT JOIN LATERAL aclexplode(
  COALESCE(p.proacl, acldefault('f', p.proowner))
) acl ON true
LEFT JOIN pg_roles r ON r.oid = acl.grantee
WHERE n.nspname = 'public'
  AND p.proname IN (
    'is_admin',
    'finalize_razorpay_payment',
    'mark_razorpay_payment_failed'
  )
ORDER BY p.proname, identity, grantee;

-- Check effective privileges for the exact expected payment RPC signatures.
-- These checks may include inherited privileges and therefore must not be
-- confused with the explicit ACL result above. A missing function is expected
-- before the Razorpay migration and is reported without privilege assertions.
WITH expected_payment_functions(function_name, identity_arguments) AS (
  VALUES
    ('finalize_razorpay_payment', 'uuid, text, text, text, text, integer, text'),
    ('mark_razorpay_payment_failed', 'uuid, text, integer, text, text')
)
SELECT e.function_name,
       e.identity_arguments,
       p.oid::regprocedure AS identity,
       p.oid IS NOT NULL AS exact_signature_exists,
       CASE WHEN p.oid IS NULL THEN NULL ELSE EXISTS (
         SELECT 1
         FROM aclexplode(COALESCE(p.proacl, acldefault('f', p.proowner))) acl
         WHERE acl.grantee = 0
           AND acl.privilege_type = 'EXECUTE'
       ) END AS public_explicitly_can_execute,
       CASE WHEN p.oid IS NULL THEN NULL ELSE has_function_privilege('anon', p.oid, 'EXECUTE') END AS anon_can_execute,
       CASE WHEN p.oid IS NULL THEN NULL ELSE has_function_privilege('authenticated', p.oid, 'EXECUTE') END AS authenticated_can_execute,
       CASE WHEN p.oid IS NULL THEN NULL ELSE has_function_privilege('service_role', p.oid, 'EXECUTE') END AS service_role_can_execute,
       p.prosecdef AS security_definer,
       pg_get_userbyid(p.proowner) AS owner,
       p.proconfig AS configuration
FROM expected_payment_functions e
LEFT JOIN pg_proc p
  ON p.pronamespace = 'public'::regnamespace
 AND p.proname = e.function_name
 AND pg_get_function_identity_arguments(p.oid) = e.identity_arguments
ORDER BY e.function_name;

-- Inspect routine privileges as an additional information_schema view. An
-- absent row is not proof of denial, so use the catalog ACL/effective checks
-- above for the security decision.
SELECT routine_schema, routine_name, specific_name, grantee, privilege_type, is_grantable
FROM information_schema.routine_privileges
WHERE routine_schema = 'public'
  AND routine_name IN (
    'is_admin',
    'finalize_razorpay_payment',
    'mark_razorpay_payment_failed'
  )
  AND grantee IN ('PUBLIC', 'anon', 'authenticated', 'service_role')
ORDER BY routine_name, specific_name, grantee, privilege_type;

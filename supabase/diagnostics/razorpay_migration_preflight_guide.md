# Razorpay migration preflight guide

Run `razorpay_migration_preflight.sql` only in the isolated development
Supabase project. It is an inspection script and must be run separately from
the Razorpay migration.

## Expected pre-migration state

These objects come from earlier schema/security migrations and should already
exist:

- `public.profiles`
- `public.subscription_plans`
- `public.user_subscriptions`
- `public.invoices`
- `public.is_admin(uuid)`

These objects are created by
`20261024000000_razorpay_payment_ledger.sql` and may be absent before that
migration:

- `public.payment_orders`
- `public.payments`
- `public.payment_webhook_events`
- `finalize_razorpay_payment(uuid, text, text, text, text, integer, text)`
- `mark_razorpay_payment_failed(uuid, text, integer, text, text)`

The base invoice schema does not contain `payment_id` or `order_id`; those
columns are added by the Razorpay migration. Their absence before migration is
expected in the object/column result, but the invoice duplicate check reports
it as a blocker because it cannot inspect existing values until the column
exists.

## Result interpretation

### Objects and columns

Required base objects and columns must exist with compatible types and
nullability. Missing base objects or columns are blockers.

Payment tables, payment columns, and payment RPCs may be absent before the
Razorpay migration. Existing payment objects with incompatible definitions are
blockers and require a reviewed compatibility plan.

### Duplicate checks

The duplicate subscription result must contain no duplicate
`(user_id, plan_id)` groups before creating
`user_subscriptions_user_plan_key`.

The duplicate invoice result must contain no duplicate non-null
`invoices.payment_id` values before creating `invoices_payment_id_key`.

If either required table or column is missing, the script emits a `BLOCKER`
notice. That is not a passing or empty duplicate result; the check could not
run and the schema must be reviewed first. Never delete or merge rows
automatically.

### Constraints and indexes

Review the catalog output for foreign keys, unique constraints, and index
definitions on the affected tables. A same-named index with a different
definition, incompatible foreign key, or duplicate data that would prevent a
unique index is a migration blocker.

### RLS, policies, and table grants

RLS enablement, policies, and table grants are separate result sets:

- Payment tables should have RLS enabled after the migration.
- Ordinary client roles should not have payment-table insert, update, or delete
  privileges.
- Payment policies should expose only the authenticated user's own payment
  records and the intended administrator views.
- `service_role` should retain the server-side access needed by the routes.

RLS does not replace table-level privileges. A permissive table grant can still
be a problem even when RLS is enabled.

### `is_admin` privileges

The checked-in security migration defines `public.is_admin(uuid)` as a
`SECURITY DEFINER` function with:

```text
search_path = public, auth, pg_temp
```

It grants `EXECUTE` to `anon`, `authenticated`, and `service_role` because
RLS policies use `public.is_admin(auth.uid())` to make server-side
administrator decisions. The function also rejects client attempts to query
another user's identity and checks the protected administrator allowlist.

Therefore, four EXECUTE result rows for `is_admin` (PUBLIC, anon,
authenticated, and service_role) must be interpreted together with the
function definition and identity checks. They are not by themselves proof of a
payment privilege vulnerability. Review any unexpected owner, missing
`SECURITY DEFINER`, or unsafe `search_path` separately.

### Payment RPC privileges

The diagnostic reports the exact expected signatures for both payment RPCs.
For each row:

- `exact_signature_exists = false` is expected before the Razorpay migration.
- Once the migration is applied, the exact signature must exist.
- `public_explicitly_can_execute` should be false after migration.
- Effective `anon_can_execute` should be false.
- Effective `authenticated_can_execute` should be false.
- Effective `service_role_can_execute` should be true.
- The function should be `SECURITY DEFINER`.
- The owner should be a trusted database owner.
- `configuration` should include the secure `search_path` configured by the
  migration.

The explicit ACL result, effective privilege result, and
`information_schema.routine_privileges` result are intentionally separate:

- Explicit ACLs show listed grants, including PUBLIC.
- `has_function_privilege` shows effective privileges, including inherited
  role privileges.
- `routine_privileges` is supplementary; an absent row does not prove denial.

An existing payment RPC with the wrong signature, broad effective privileges,
wrong owner, non-definer execution, or unsafe configuration is a blocker.

## Manual review procedure

1. Select the isolated development Supabase project.
2. Open its SQL Editor.
3. Run only `razorpay_migration_preflight.sql`.
4. Save each result set and all `NOTICE` messages.
5. Confirm base objects/columns and both duplicate checks are clear.
6. Review existing constraints, indexes, RLS policies, and table grants.
7. Before migration, treat payment tables/RPCs as expected-missing objects.
8. Do not apply the migration until blockers are resolved and the results are
   reviewed.
9. After a reviewed development migration application, rerun the diagnostic
   and require the exact payment RPC privilege expectations above.

This guide does not claim that any live database result is clean. The SQL
Editor output from the development project is required for that conclusion.

-- Razorpay payment ledger. Apply only after review; do not run against production automatically.
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id text NOT NULL REFERENCES public.subscription_plans(id),
  razorpay_order_id text NOT NULL UNIQUE,
  amount_paise integer NOT NULL CHECK (amount_paise > 0),
  currency text NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed')),
  failed_payment_id text,
  failure_reason text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.payment_orders ADD COLUMN IF NOT EXISTS failed_payment_id text;
ALTER TABLE public.payment_orders ADD COLUMN IF NOT EXISTS failure_reason text;
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  payment_order_id uuid NOT NULL REFERENCES public.payment_orders(id),
  plan_id text NOT NULL REFERENCES public.subscription_plans(id),
  razorpay_payment_id text NOT NULL UNIQUE,
  razorpay_signature text,
  webhook_signature text,
  verification_source text NOT NULL CHECK (verification_source IN ('checkout', 'webhook')),
  amount_paise integer NOT NULL CHECK (amount_paise > 0),
  currency text NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
  status text NOT NULL CHECK (status = 'captured'),
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE TABLE IF NOT EXISTS public.payment_webhook_events (
  event_id text PRIMARY KEY,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS payment_id text;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS order_id text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS webhook_signature text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS verification_source text NOT NULL DEFAULT 'checkout';
ALTER TABLE public.payments ALTER COLUMN razorpay_signature DROP NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS user_subscriptions_user_plan_key ON public.user_subscriptions(user_id, plan_id);
CREATE UNIQUE INDEX IF NOT EXISTS invoices_payment_id_key ON public.invoices(payment_id) WHERE payment_id IS NOT NULL;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own payment orders" ON public.payment_orders;
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can view payment orders" ON public.payment_orders;
DROP POLICY IF EXISTS "Admins can view payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can view webhook events" ON public.payment_webhook_events;
CREATE POLICY "Users can view own payment orders" ON public.payment_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view payment orders" ON public.payment_orders FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can view payments" ON public.payments FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can view webhook events" ON public.payment_webhook_events FOR SELECT USING (public.is_admin(auth.uid()));
REVOKE INSERT, UPDATE, DELETE ON public.payment_orders FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.payments FROM anon, authenticated;
REVOKE ALL ON public.payment_webhook_events FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.finalize_razorpay_payment(
  p_order_id uuid,
  p_payment_id text,
  p_signature text,
  p_webhook_signature text,
  p_verification_source text,
  p_amount_paise integer,
  p_currency text
)
RETURNS TABLE (plan_name text, renews_on timestamptz, already_finalized boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_order public.payment_orders%ROWTYPE;
  v_plan public.subscription_plans%ROWTYPE;
  v_renewal timestamptz;
  v_inserted integer;
  v_existing public.payments%ROWTYPE;
BEGIN
  IF p_payment_id IS NULL OR p_payment_id = ''
     OR p_amount_paise IS NULL OR p_amount_paise < 100
     OR p_currency <> 'INR'
     OR p_verification_source NOT IN ('checkout', 'webhook')
     OR (p_verification_source = 'checkout' AND (p_signature IS NULL OR btrim(p_signature) = ''))
     OR (p_verification_source = 'webhook' AND (p_webhook_signature IS NULL OR btrim(p_webhook_signature) = '')) THEN
    RAISE EXCEPTION 'Invalid payment finalization input' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_order FROM public.payment_orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment order not found' USING ERRCODE = 'P0002';
  END IF;

  SELECT * INTO v_plan FROM public.subscription_plans WHERE id = v_order.plan_id FOR SHARE;
  IF NOT FOUND OR NOT v_plan.is_active
     OR v_order.amount_paise <> p_amount_paise
     OR v_order.currency <> p_currency
     OR round(v_plan.price * 100) <> p_amount_paise THEN
    RAISE EXCEPTION 'Payment amount or plan does not match the order' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_existing
  FROM public.payments
  WHERE razorpay_payment_id = p_payment_id
  FOR UPDATE;
  IF FOUND AND (
    v_existing.payment_order_id <> v_order.id
    OR v_existing.user_id <> v_order.user_id
    OR v_existing.amount_paise <> p_amount_paise
    OR v_existing.currency <> p_currency
  ) THEN
    RAISE EXCEPTION 'Payment is already linked to a different order' USING ERRCODE = '23505';
  END IF;

  INSERT INTO public.payments (
    user_id, payment_order_id, plan_id, razorpay_payment_id,
    razorpay_signature, webhook_signature, verification_source,
    amount_paise, currency, status
  )
  VALUES (
    v_order.user_id, v_order.id, v_order.plan_id, p_payment_id,
    CASE WHEN p_verification_source = 'checkout' THEN p_signature ELSE NULL END,
    CASE WHEN p_verification_source = 'webhook' THEN p_webhook_signature ELSE NULL END,
    p_verification_source, p_amount_paise, p_currency, 'captured'
  )
  ON CONFLICT (razorpay_payment_id) DO NOTHING;
  GET DIAGNOSTICS v_inserted = ROW_COUNT;

  IF v_order.status = 'paid' OR v_inserted = 0 THEN
    RETURN QUERY SELECT v_plan.name, (
      SELECT us.renews_on FROM public.user_subscriptions us
      WHERE us.user_id = v_order.user_id AND us.plan_id = v_order.plan_id
    ), true;
    RETURN;
  END IF;

  v_renewal := timezone('utc'::text, now()) + make_interval(days => COALESCE(v_plan.duration_days, 30));
  UPDATE public.payment_orders
  SET status = 'paid', updated_at = timezone('utc'::text, now())
  WHERE id = v_order.id;

  INSERT INTO public.user_subscriptions (user_id, plan_id, status, renews_on)
  VALUES (v_order.user_id, v_order.plan_id, 'active', v_renewal)
  ON CONFLICT (user_id, plan_id) DO UPDATE SET
    status = 'active', renews_on = EXCLUDED.renews_on, updated_at = timezone('utc'::text, now());

  INSERT INTO public.invoices (
    user_id, description, amount_inr, status, issued_on, payment_id, order_id
  )
  VALUES (
    v_order.user_id,
    v_plan.name || CASE WHEN v_plan.duration_days >= 365
      THEN ' (Annual Subscription · 12 Months)'
      ELSE ' (Monthly Membership · 30 Days)' END,
    v_plan.price, 'paid', CURRENT_DATE, p_payment_id,
    (SELECT razorpay_order_id FROM public.payment_orders WHERE id = v_order.id)
  )
  ON CONFLICT (payment_id) DO NOTHING;

  RETURN QUERY SELECT v_plan.name, v_renewal, false;
END;
$$;

DROP FUNCTION IF EXISTS public.mark_razorpay_payment_failed(uuid, text, integer, text);

CREATE OR REPLACE FUNCTION public.mark_razorpay_payment_failed(
  p_order_id uuid,
  p_payment_id text,
  p_amount_paise integer,
  p_currency text,
  p_failure_reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF p_payment_id IS NULL OR btrim(p_payment_id) = ''
     OR p_amount_paise IS NULL OR p_amount_paise < 100
     OR p_currency <> 'INR' THEN
    RAISE EXCEPTION 'Invalid failed payment input' USING ERRCODE = '22023';
  END IF;

  UPDATE public.payment_orders
  SET status = CASE WHEN status = 'paid' THEN status ELSE 'failed' END,
      failed_payment_id = CASE WHEN status = 'paid' THEN failed_payment_id ELSE p_payment_id END,
      failure_reason = CASE WHEN status = 'paid' THEN failure_reason ELSE NULLIF(btrim(p_failure_reason), '') END,
      updated_at = timezone('utc'::text, now())
  WHERE id = p_order_id
    AND razorpay_order_id IS NOT NULL
    AND amount_paise = p_amount_paise
    AND currency = p_currency
    AND NOT EXISTS (
      SELECT 1 FROM public.payments p
      WHERE p.payment_order_id = p_order_id
        AND p.status = 'captured'
    );
END;
$$;

REVOKE ALL ON FUNCTION public.finalize_razorpay_payment(uuid, text, text, text, text, integer, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.mark_razorpay_payment_failed(uuid, text, integer, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_razorpay_payment(uuid, text, text, text, text, integer, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.mark_razorpay_payment_failed(uuid, text, integer, text, text) TO service_role;

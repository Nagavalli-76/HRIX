-- Complete non-payment application and collaboration workflows.
DO $$ BEGIN
  ALTER TYPE notification_kind ADD VALUE IF NOT EXISTS 'application-withdrawn';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_collaborations_campaign_creator
  ON public.collaborations(campaign_id, creator_id);

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

CREATE POLICY "Users can create own notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

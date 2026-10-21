-- Restrict storage object paths to the authenticated owner's folder.
DROP POLICY IF EXISTS "Authenticated users can upload to public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files in public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own verification documents" ON storage.objects;

CREATE POLICY "Users upload owned public assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND bucket_id IN ('avatars', 'logos', 'portfolio', 'campaign_assets')
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users update owned public assets"
  ON storage.objects FOR UPDATE
  USING (
    owner = auth.uid()
    AND bucket_id IN ('avatars', 'logos', 'portfolio', 'campaign_assets')
  )
  WITH CHECK (
    owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users delete owned public assets"
  ON storage.objects FOR DELETE
  USING (
    owner = auth.uid()
    AND bucket_id IN ('avatars', 'logos', 'portfolio', 'campaign_assets')
  );

CREATE POLICY "Users upload own verification documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'verifications'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users delete own verification documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'verifications' AND (owner = auth.uid() OR public.is_admin(auth.uid())));

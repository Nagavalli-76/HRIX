-- Production hardening for messaging and application lifecycle access.

DO $$ BEGIN
  ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'withdrawn';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Participants may only add themselves to a conversation. A trusted server
-- workflow should create the conversation and add the second participant.
CREATE POLICY "Users can join conversations as themselves"
  ON public.conversation_participants
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Participants can update conversation timestamps"
  ON public.conversations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = id AND cp.user_id = auth.uid()
    )
  )
  WITH CHECK (true);

CREATE POLICY "Participants can mark messages read"
  ON public.messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = messages.conversation_id AND cp.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = messages.conversation_id AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Creators can withdraw own applications"
  ON public.campaign_applications
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.creator_profiles cp
      WHERE cp.id = creator_id AND cp.user_id = auth.uid()
    )
  )
  WITH CHECK (
    status = 'withdrawn'
    AND EXISTS (
      SELECT 1 FROM public.creator_profiles cp
      WHERE cp.id = creator_id AND cp.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_notifications_unread_user
  ON public.notifications(user_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user
  ON public.conversation_participants(user_id, conversation_id);
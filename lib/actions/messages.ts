"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function sendMessageAction(conversationId: string, formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  if (!conversationId || body.length < 1 || body.length > 4000) return { error: "Message must be between 1 and 4,000 characters." };
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return { error: "Authentication required." };
  const { data: membership } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("conversation_id", conversationId)
    .eq("user_id", authData.user.id)
    .maybeSingle();
  if (!membership) return { error: "You are not a participant in this conversation." };
  const { error } = await supabase.from("messages").insert({ conversation_id: conversationId, sender_id: authData.user.id, body });
  if (error) {
    console.error("Error sending message:", error);
    return { error: "Unable to send the message. Please try again." };
  }
  revalidatePath("/creator/dashboard/messages");
  revalidatePath("/brand/dashboard/messages");
  return { success: true };
}

export async function markConversationRead(conversationId: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { error: "Authentication required." };
  const { data: membership } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("conversation_id", conversationId)
    .eq("user_id", authData.user.id)
    .maybeSingle();
  if (!membership) return { error: "You are not a participant in this conversation." };
  const { error } = await supabase.from("messages").update({ read: true }).eq("conversation_id", conversationId).neq("sender_id", authData.user.id);
  if (error) {
    console.error("Error marking conversation read:", error);
    return { error: "Unable to update the conversation. Please try again." };
  }
  return { success: true };
}

import type { Conversation, Message } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function listConversations(): Promise<Conversation[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data, error } = await supabase
    .from("conversations")
    .select("id, updated_at, campaigns(title), conversation_participants(user_id, profiles(role, full_name)), messages(body, created_at, read, sender_id)")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("Error loading conversations:", error);
    throw new Error("Unable to load conversations.");
  }

  return (data ?? []).map((row: any) => {
    const participants = row.conversation_participants ?? [];
    const otherParticipant = participants.find((participant: any) => participant.user_id !== userData.user.id);
    const messages = [...(row.messages ?? [])].sort((a: any, b: any) =>
      a.created_at.localeCompare(b.created_at),
    );
    return {
      id: row.id,
      campaignTitle: row.campaigns?.title ?? undefined,
      participantName: otherParticipant?.profiles?.full_name ?? "Conversation",
      participantRole: otherParticipant?.profiles?.role === "brand" ? "brand" : "creator",
      lastMessage: messages.at(-1)?.body ?? "No messages yet",
      lastMessageAt: messages.at(-1)?.created_at ?? row.updated_at,
      unreadCount: messages.filter(
        (message: any) => message.sender_id !== userData.user.id && !message.read,
      ).length,
    };
  });
}

export async function listMessages(conversationId: string): Promise<Message[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data: membership } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("conversation_id", conversationId)
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (!membership) return [];

  const { data, error } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_id, body, is_system, created_at, profiles(full_name)")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("Error loading messages:", error);
    throw new Error("Unable to load messages.");
  }

  return (data ?? []).map((message: any) => ({
    id: message.id,
    conversationId: message.conversation_id,
    senderId: message.sender_id ?? "system",
    senderName: message.sender_id === userData.user.id ? "You" : message.profiles?.full_name ?? "HRIX",
    body: message.body,
    timestamp: message.created_at,
    system: message.is_system,
  }));
}

export async function sendMessage(conversationId: string, body: string) {
  const trimmedBody = body.trim();
  if (!trimmedBody) throw new Error("Message cannot be empty");

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Authentication required");

  const { data: membership } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("conversation_id", conversationId)
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (!membership) throw new Error("You are not a participant in this conversation");

  const { data, error } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, sender_id: userData.user.id, body: trimmedBody })
    .select("id, conversation_id, sender_id, body, is_system, created_at")
    .single();
  if (error) {
    console.error("Error sending message:", error);
    throw new Error("Unable to send the message.");
  }
  return data;
}

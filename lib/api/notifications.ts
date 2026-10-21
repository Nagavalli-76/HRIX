import type { AppNotification } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function listNotifications(): Promise<AppNotification[]> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("id, kind, title, body, read, created_at")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error loading notifications:", error);
    throw new Error("Unable to load notifications.");
  }

  return (data ?? []).map((notification) => ({
    id: notification.id,
    kind: notification.kind,
    title: notification.title,
    body: notification.body,
    read: notification.read,
    timestamp: notification.created_at,
  }));
}

export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Authentication required");
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", userData.user.id);
  if (error) {
    console.error("Error marking notification as read:", error);
    throw new Error("Unable to update the notification.");
  }
}

export async function markAllNotificationsRead() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Authentication required");
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userData.user.id)
    .eq("read", false);
  if (error) {
    console.error("Error marking notifications as read:", error);
    throw new Error("Unable to update notifications.");
  }
}

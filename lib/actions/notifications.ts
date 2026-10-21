"use server";

import { revalidatePath } from "next/cache";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/api/notifications";

export async function markNotificationReadAction(notificationId: string) {
  try {
    await markNotificationRead(notificationId);
    revalidatePath("/creator/dashboard");
    revalidatePath("/brand/dashboard");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating notification:", error);
    return { error: "Unable to update notification. Please try again." };
  }
}

export async function markAllNotificationsReadAction() {
  try {
    await markAllNotificationsRead();
    revalidatePath("/creator/dashboard");
    revalidatePath("/brand/dashboard");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating notifications:", error);
    return { error: "Unable to update notifications. Please try again." };
  }
}

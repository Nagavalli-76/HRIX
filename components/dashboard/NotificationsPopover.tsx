"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatRelativeShort } from "@/lib/format";
import type { AppNotification } from "@/types";
import { markAllNotificationsReadAction, markNotificationReadAction } from "@/lib/actions/notifications";

export function NotificationsPopover({ notifications }: { notifications: AppNotification[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;

  async function markRead(id: string) {
    setError("");
    const result = await markNotificationReadAction(id);
    if ("error" in result) setError(result.error ?? "Unable to update notification.");
    else router.refresh();
  }

  async function markAllRead() {
    setError("");
    const result = await markAllNotificationsReadAction();
    if ("error" in result) setError(result.error ?? "Unable to update notifications.");
    else router.refresh();
  }

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative flex h-10 w-10 items-center justify-center rounded-md text-muted hover:bg-white/5 hover:text-ink"
      >
        <Bell className="h-5 w-5" aria-hidden />
        {unread > 0 ? (
          <span
            aria-hidden
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-violet"
          />
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-line bg-surface shadow-overlay"
        >
          <div className="border-b border-line px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-ink">Notifications</p>
              {unread > 0 ? (
                <button type="button" onClick={() => void markAllRead()} className="text-xs text-blue-soft hover:underline">
                  Mark all read
                </button>
              ) : null}
            </div>
          </div>
          {error ? <p role="alert" className="border-b border-line px-4 py-2 text-xs text-danger">{error}</p> : null}
          <ul className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-faint">
                You&apos;re all caught up.
              </li>
            ) : (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={cn(
                    "border-b border-line px-4 py-3 last:border-0",
                    !notification.read && "bg-white/[0.03]",
                  )}
                >
                  <button type="button" onClick={() => void markRead(notification.id)} className="w-full text-left">
                    <p className="text-sm font-medium text-ink">{notification.title}</p>
                    <p className="mt-0.5 text-sm text-muted">{notification.body}</p>
                    <p className="mt-1 text-xs text-faint">
                      {formatRelativeShort(notification.timestamp)}
                    </p>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

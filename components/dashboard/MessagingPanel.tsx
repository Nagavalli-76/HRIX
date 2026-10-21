"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Paperclip, Send } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { formatRelativeShort } from "@/lib/format";
import type { Conversation, Message } from "@/types";
import { cn } from "@/lib/cn";
import { sendMessageAction, markConversationRead } from "@/lib/actions/messages";
import { Button } from "@/components/ui/Button";

export function MessagingPanel({
  conversations,
  activeConversation,
  messages,
}: {
  conversations: Conversation[];
  activeConversation: Conversation;
  messages: Message[];
}) {
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    void markConversationRead(activeConversation.id).then((result) => {
      if ("error" in result) setError(result.error ?? "Unable to mark messages as read.");
    });
  }, [activeConversation.id]);

  async function submit(formData: FormData) {
    setError("");
    const result = await sendMessageAction(activeConversation.id, formData);
    if ("error" in result) setError(result.error ?? "Unable to send message.");
    else router.refresh();
  }

  return (
    <div className="grid overflow-hidden rounded-lg border border-line lg:grid-cols-[280px_1fr]" style={{ height: "70vh", minHeight: 480 }}>
      <div className="hidden overflow-y-auto border-r border-line bg-surface/60 lg:block">
        {conversations.map((conversation) => {
          const active = conversation.id === activeConversation.id;
          return (
            <button
              type="button"
              key={conversation.id}
              onClick={() => router.replace(`?conversationId=${encodeURIComponent(conversation.id)}`)}
              className={cn(
                "flex items-start gap-3 border-b border-line px-4 py-3.5",
                active && "bg-white/[0.05]",
              )}
            >
              <Avatar name={conversation.participantName} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-ink">
                    {conversation.participantName}
                  </p>
                  <span className="shrink-0 text-xs text-faint">
                    {formatRelativeShort(conversation.lastMessageAt)}
                  </span>
                </div>
                {conversation.campaignTitle ? (
                  <p className="truncate text-xs text-faint">{conversation.campaignTitle}</p>
                ) : null}
                <p className="mt-0.5 truncate text-sm text-muted">{conversation.lastMessage}</p>
              </div>
              {conversation.unreadCount > 0 ? (
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet text-xs font-semibold text-canvas">
                  {conversation.unreadCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col bg-canvas">
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <Avatar name={activeConversation.participantName} />
          <div>
            <p className="font-medium text-ink">{activeConversation.participantName}</p>
            {activeConversation.campaignTitle ? (
              <p className="text-sm text-faint">{activeConversation.campaignTitle}</p>
            ) : null}
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((message) =>
            message.system ? (
              <p key={message.id} className="text-center text-xs text-faint">
                {message.body}
              </p>
            ) : (
              <div
                key={message.id}
                className={cn(
                  "max-w-[75%] rounded-lg px-4 py-2.5 text-sm",
                  message.senderId === "creator" || message.senderName === "You"
                    ? "ml-auto bg-violet text-white"
                    : "bg-surface-raised text-ink",
                )}
              >
                {message.body}
              </div>
            ),
          )}
        </div>

        <form action={submit} className="flex items-center gap-3 border-t border-line px-4 py-3">
          <button
            type="button"
            aria-label="Attach file"
            className="flex h-9 w-9 items-center justify-center rounded-md text-faint hover:bg-white/5 hover:text-ink"
          >
            <Paperclip className="h-4 w-4" aria-hidden />
          </button>
          <input
            name="body"
            required
            maxLength={4000}
            type="text"
            placeholder="Write a message"
            aria-label="Message"
            className="h-10 flex-1 rounded-md border border-line-strong bg-surface px-3.5 text-sm text-ink placeholder:text-faint focus-visible:border-violet"
          />
          <Button type="submit" size="sm" leadingIcon={<Send className="h-4 w-4" aria-hidden />}>Send</Button>
        </form>
        {error ? <p role="alert" className="px-4 pb-3 text-sm text-danger">{error}</p> : null}
      </div>
    </div>
  );
}

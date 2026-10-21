import type { Metadata } from "next";
import { listConversations, listMessages } from "@/lib/api/messages";
import { MessagingPanel } from "@/components/dashboard/MessagingPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = { title: "Messages" };

export default async function CreatorMessagesPage({ searchParams }: { searchParams: Promise<{ conversationId?: string }> }) {
  const conversations = await listConversations();
  const { conversationId } = await searchParams;
  const active = conversationId
    ? conversations.find((conversation) => conversation.id === conversationId)
    : undefined;
  const messages = active ? await listMessages(active.id) : [];

  return (
    <div>
      <h1 className="text-headline mb-6">Messages</h1>
      {active ? (
        <MessagingPanel conversations={conversations} activeConversation={active} messages={messages} />
      ) : (
        <EmptyState
          icon={<MessageCircle className="h-8 w-8" />}
          title="No conversations yet"
          body="Messages with creators and brands will appear here once a collaboration begins."
        />
      )}
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useChatThreads } from "@/hooks/use-chat-threads";

export const Route = createFileRoute("/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  const { threads, hydrated } = useChatThreads();

  useEffect(() => {
    if (!hydrated) return;
    const first = threads[0];
    if (first) {
      void navigate({ to: "/chat/$threadId", params: { threadId: first.id }, replace: true });
    }
  }, [hydrated, threads, navigate]);

  return (
    <div className="flex h-[calc(100vh-3rem)] items-center justify-center text-sm text-muted-foreground">
      Loading chat…
    </div>
  );
}
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Plus,
  Trash2,
  Send,
  MessageSquare,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";
import { useChatThreads, type ChatThread } from "@/hooks/use-chat-threads";

export const Route = createFileRoute("/chat/$threadId")({
  component: ChatThreadPage,
});

function ChatThreadPage() {
  const { threadId } = useParams({ from: "/chat/$threadId" });
  return <ChatWindow key={threadId} threadId={threadId} />;
}

function ChatWindow({ threadId }: { threadId: string }) {
  const navigate = useNavigate();
  const { threads, hydrated, createThread, deleteThread, updateThread } = useChatThreads();

  const active = useMemo<ChatThread | undefined>(
    () => threads.find((t) => t.id === threadId),
    [threads, threadId],
  );

  // If thread doesn't exist after hydration, redirect to first or create one
  useEffect(() => {
    if (!hydrated) return;
    if (!active) {
      const fallback = threads[0];
      if (fallback) {
        void navigate({
          to: "/chat/$threadId",
          params: { threadId: fallback.id },
          replace: true,
        });
      } else {
        const t = createThread();
        void navigate({
          to: "/chat/$threadId",
          params: { threadId: t.id },
          replace: true,
        });
      }
    }
  }, [hydrated, active, threads, navigate, createThread]);

  const initialMessages = useMemo<UIMessage[]>(
    () => active?.messages ?? [],
    [active?.id], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, error } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
  });

  // Persist messages when they change (streaming + completion)
  const lastSavedRef = useRef<number>(0);
  useEffect(() => {
    if (!active) return;
    if (status === "streaming" || status === "submitted") {
      const now = Date.now();
      if (now - lastSavedRef.current < 400) return;
      lastSavedRef.current = now;
    }
    updateThread(threadId, messages);
  }, [messages, status, threadId, active, updateThread]);

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId, status]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  const busy = status === "submitted" || status === "streaming";

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await sendMessage({ text });
  }

  function handleNew() {
    const t = createThread();
    void navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  }

  function handleDelete(id: string) {
    const next = deleteThread(id);
    if (id === threadId) {
      const target = next[0];
      if (target) {
        void navigate({ to: "/chat/$threadId", params: { threadId: target.id }, replace: true });
      }
    }
  }

  return (
    <div className="flex h-[calc(100vh-3rem)] w-full">
      {/* Thread list */}
      <aside className="hidden md:flex w-72 flex-col border-r border-border/50 glass-strong">
        <div className="p-3">
          <Button onClick={handleNew} className="w-full" variant="default">
            <Plus className="h-4 w-4" /> New chat
          </Button>
        </div>
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 pb-3">
            {threads.map((t) => {
              const isActive = t.id === threadId;
              return (
                <div
                  key={t.id}
                  className={`group flex items-center gap-1 rounded-lg px-1 transition ${
                    isActive ? "bg-primary/10" : "hover:bg-accent/40"
                  }`}
                >
                  <Link
                    to="/chat/$threadId"
                    params={{ threadId: t.id }}
                    className="flex-1 min-w-0 flex items-center gap-2 rounded-lg px-2 py-2 text-sm"
                  >
                    <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{t.title || "New chat"}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(t.id)}
                    className="opacity-0 group-hover:opacity-100 transition rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Delete chat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </aside>

      {/* Chat surface */}
      <section className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/50">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="h-4 w-4 text-primary" />
            <h1 className="text-sm font-semibold truncate">
              {active?.title || "AI Workplace Chatbot"}
            </h1>
          </div>
          <Button size="sm" variant="outline" onClick={handleNew} className="md:hidden">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-6 py-6">
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.length === 0 && (
              <div className="glass rounded-2xl p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-semibold">Ask me anything about work</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Draft emails, plan your week, brainstorm, summarize — I'm your productivity copilot.
                </p>
              </div>
            )}
            {messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {isUser ? (
                    <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm">
                      {text}
                    </div>
                  ) : (
                    <div className="max-w-[85%] text-sm text-foreground">
                      <article className="prose prose-sm max-w-none prose-p:my-2 prose-headings:text-foreground prose-strong:text-foreground prose-li:text-foreground">
                        <ReactMarkdown>{text || "…"}</ReactMarkdown>
                      </article>
                    </div>
                  )}
                </div>
              );
            })}
            {status === "submitted" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
              </div>
            )}
            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error.message || "Something went wrong. Please try again."}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border/50 p-3 sm:p-4">
          <div className="mx-auto max-w-3xl space-y-2">
            <form onSubmit={handleSend} className="glass-strong rounded-2xl p-2 flex items-end gap-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder="Message WorkFlow AI…"
                rows={1}
                className="min-h-10 max-h-40 flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <Button type="submit" size="icon" disabled={busy || !input.trim()}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
            <ResponsibleAINotice />
          </div>
        </div>
      </section>
    </div>
  );
}
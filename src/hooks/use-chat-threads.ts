import { useCallback, useEffect, useState } from "react";
import type { UIMessage } from "ai";

const STORAGE_KEY = "workflow-ai-chat-threads-v1";

export type ChatThread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

function newId() {
  return (
    (globalThis.crypto?.randomUUID?.() as string | undefined) ??
    `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
  );
}

function makeThread(): ChatThread {
  return { id: newId(), title: "New chat", updatedAt: Date.now(), messages: [] };
}

function loadOrInit(): ChatThread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ChatThread[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  const seeded = [makeThread()];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  } catch {
    // ignore
  }
  return seeded;
}

export function useChatThreads() {
  const [threads, setThreads] = useState<ChatThread[]>(() => loadOrInit());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      setThreads(loadOrInit());
      setHydrated(true);
    }
  }, [hydrated]);

  const persist = useCallback((next: ChatThread[]) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const createThread = useCallback((): ChatThread => {
    const t = makeThread();
    setThreads((prev) => {
      const next = [t, ...prev];
      persist(next);
      return next;
    });
    return t;
  }, [persist]);

  const deleteThread = useCallback(
    (id: string): ChatThread[] => {
      let out: ChatThread[] = [];
      setThreads((prev) => {
        let next = prev.filter((t) => t.id !== id);
        if (next.length === 0) next = [makeThread()];
        persist(next);
        out = next;
        return next;
      });
      return out;
    },
    [persist],
  );

  const updateThread = useCallback(
    (id: string, messages: UIMessage[]) => {
      setThreads((prev) => {
        const next = prev.map((t) => {
          if (t.id !== id) return t;
          let title = t.title;
          if ((title === "New chat" || !title) && messages.length > 0) {
            const first = messages.find((m) => m.role === "user");
            if (first) {
              const text = first.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join(" ")
                .trim();
              if (text) title = text.slice(0, 48);
            }
          }
          return { ...t, messages, updatedAt: Date.now(), title };
        });
        persist(next);
        return next;
      });
    },
    [persist],
  );

  return { threads, hydrated, createThread, deleteThread, updateThread };
}
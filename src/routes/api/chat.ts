import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import {
  createLovableAiGatewayProvider,
  getLovableApiKey,
} from "@/lib/ai-gateway.server";

const SYSTEM = `You are WorkFlow AI, a friendly and knowledgeable workplace productivity assistant. Help users with email drafting, meetings, planning, research, time management, and general workplace questions. Keep responses concise, actionable, and formatted in markdown when helpful.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) {
          return new Response("Messages required", { status: 400 });
        }
        try {
          const gateway = createLovableAiGatewayProvider(getLovableApiKey());
          const result = streamText({
            model: gateway("google/gemini-3-flash-preview"),
            system: SYSTEM,
            messages: await convertToModelMessages(messages),
          });
          return result.toUIMessageStreamResponse({ originalMessages: messages });
        } catch (e: unknown) {
          const err = e as { statusCode?: number; message?: string };
          const status = err?.statusCode ?? 500;
          return new Response(err?.message || "Chat failed", { status });
        }
      },
    },
  },
});
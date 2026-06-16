import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider, getLovableApiKey } from "../ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function model() {
  return createLovableAiGatewayProvider(getLovableApiKey())(MODEL);
}

async function run(system: string, prompt: string) {
  try {
    const { text } = await generateText({ model: model(), system, prompt });
    return { text };
  } catch (e: unknown) {
    const err = e as { statusCode?: number; message?: string };
    if (err?.statusCode === 429)
      throw new Error("AI rate limit reached. Please try again in a moment.");
    if (err?.statusCode === 402)
      throw new Error("AI credits exhausted. Please add credits to your workspace.");
    throw new Error(err?.message || "AI request failed");
  }
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      topic: z.string().min(1).max(2000),
      tone: z.enum(["Formal", "Informal", "Persuasive"]),
      audience: z.enum(["Client", "Manager", "Team Member"]),
      context: z.string().max(2000).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const system = `You are a professional email writing assistant. Write a complete email with a clear subject line and body. Use a ${data.tone.toLowerCase()} tone aimed at a ${data.audience}. Format the output as:\nSubject: <subject>\n\n<body>\n\nKeep it concise and well-structured.`;
    const prompt = `Topic / purpose: ${data.topic}${data.context ? `\n\nAdditional context: ${data.context}` : ""}`;
    return run(system, prompt);
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ notes: z.string().min(10).max(20000) }))
  .handler(async ({ data }) => {
    const system = `You analyze meeting notes and produce structured output in markdown with these exact sections:\n## Summary\n## Key Discussion Points\n## Action Items\n## Deadlines\n\nUse bullet lists. For action items include the owner if mentioned. For deadlines include the date if mentioned.`;
    return run(system, `Meeting notes:\n\n${data.notes}`);
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      tasks: z.string().min(5).max(10000),
      horizon: z.enum(["Daily", "Weekly"]),
    }),
  )
  .handler(async ({ data }) => {
    const system = `You are an AI task planner. Given a list of tasks with optional deadlines, produce a ${data.horizon.toLowerCase()} schedule in markdown. Prioritize using the Eisenhower matrix (urgent/important). Output sections:\n## Prioritized Tasks\n(table or list with priority: P1/P2/P3, reason)\n## ${data.horizon === "Daily" ? "Today's Schedule" : "Weekly Schedule"}\n(time-blocked plan)\n## Recommendations\n(brief productivity tips)`;
    return run(system, `Tasks:\n${data.tasks}`);
  });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator(z.object({ topic: z.string().min(3).max(10000) }))
  .handler(async ({ data }) => {
    const system = `You are an AI research assistant. If given an article, summarize it. If given a topic, provide a knowledgeable overview. Output in markdown:\n## Summary\n## Key Insights\n## Recommendations\n## Suggested Next Steps`;
    return run(system, data.topic);
  });
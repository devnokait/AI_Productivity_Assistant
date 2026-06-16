import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Mail,
  NotebookPen,
  CalendarClock,
  BookOpen,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { ResponsibleAINotice } from "@/components/responsible-ai-notice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkFlow AI — Dashboard" },
      {
        name: "description",
        content:
          "Your AI-powered workplace productivity dashboard: email, meetings, planning, research, and chat.",
      },
      { property: "og:title", content: "WorkFlow AI — Dashboard" },
      {
        property: "og:description",
        content: "AI productivity suite for the modern workplace.",
      },
    ],
  }),
  component: Index,
});

const features = [
  {
    title: "Smart Email Generator",
    description: "Draft professional emails in seconds with tone & audience control.",
    href: "/email",
    icon: Mail,
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Turn raw notes into summaries, action items and deadlines.",
    href: "/meetings",
    icon: NotebookPen,
  },
  {
    title: "AI Task Planner",
    description: "Prioritize tasks and generate daily or weekly schedules.",
    href: "/planner",
    icon: CalendarClock,
  },
  {
    title: "AI Research Assistant",
    description: "Summarize articles and get key insights and recommendations.",
    href: "/research",
    icon: BookOpen,
  },
  {
    title: "AI Workplace Chatbot",
    description: "Chat with your always-on productivity assistant.",
    href: "/chat",
    icon: MessageSquare,
  },
] as const;

function Index() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 p-4 sm:p-8">
      <section className="glass-strong rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-4">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered productivity
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Welcome to <span className="gradient-text">WorkFlow AI</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground">
            One integrated dashboard to automate the work around the work — emails,
            meetings, planning, research and a workplace assistant.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.href}
            to={f.href}
            className="glass group rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Open
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </section>

      <ResponsibleAINotice />
    </div>
  );
}

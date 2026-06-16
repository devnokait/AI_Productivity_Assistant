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
  TrendingUp,
  Clock,
  Zap,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { useEffect, useState } from "react";

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
    accent: "from-sky-400 to-blue-500",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Turn raw notes into summaries, action items and deadlines.",
    href: "/meetings",
    icon: NotebookPen,
    accent: "from-indigo-400 to-violet-500",
  },
  {
    title: "AI Task Planner",
    description: "Prioritize tasks and generate daily or weekly schedules.",
    href: "/planner",
    icon: CalendarClock,
    accent: "from-cyan-400 to-sky-500",
  },
  {
    title: "AI Research Assistant",
    description: "Summarize articles and get key insights and recommendations.",
    href: "/research",
    icon: BookOpen,
    accent: "from-blue-400 to-indigo-500",
  },
  {
    title: "AI Workplace Chatbot",
    description: "Chat with your always-on productivity assistant.",
    href: "/chat",
    icon: MessageSquare,
    accent: "from-violet-400 to-fuchsia-500",
  },
] as const;

const stats = [
  {
    label: "Tasks Automated",
    value: "1,284",
    change: "+12.4%",
    icon: Zap,
  },
  {
    label: "Hours Saved",
    value: "326h",
    change: "+8.1%",
    icon: Clock,
  },
  {
    label: "AI Generations",
    value: "4,712",
    change: "+23.7%",
    icon: Sparkles,
  },
  {
    label: "Productivity Score",
    value: "92%",
    change: "+4.2%",
    icon: TrendingUp,
  },
] as const;

const recentActivity = [
  {
    icon: Mail,
    title: "Drafted client follow-up email",
    meta: "Smart Email · Formal tone",
    time: "2m ago",
  },
  {
    icon: NotebookPen,
    title: "Summarized Q3 strategy meeting",
    meta: "Meeting Notes · 8 action items",
    time: "1h ago",
  },
  {
    icon: CalendarClock,
    title: "Generated weekly plan",
    meta: "Task Planner · 14 tasks scheduled",
    time: "3h ago",
  },
  {
    icon: BookOpen,
    title: "Researched competitor pricing",
    meta: "Research Assistant · 5 sources",
    time: "Yesterday",
  },
] as const;

function useGreeting() {
  const [greeting, setGreeting] = useState("Welcome back");
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);
  return greeting;
}

function Index() {
  const greeting = useGreeting();
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-10 animate-fade-in">
      {/* Welcome banner */}
      <section className="glass-strong glow-ring relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-14">
        <div className="blob float-slow -top-24 -right-16 h-72 w-72 bg-primary/35" />
        <div className="blob float-slow -bottom-28 -left-10 h-72 w-72 bg-accent/60" style={{ animationDelay: "-3s" }} />
        <div className="blob top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 bg-sky-300/30" />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-4">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI-powered productivity suite
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {greeting},{" "}
              <span className="shimmer-text">welcome back</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-lg">
              Your integrated workspace for automating emails, meetings, planning, research
              and team chat — all in one beautifully simple dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <MessageSquare className="h-4 w-4" />
                Start a chat
              </Link>
              <Link
                to="/email"
                className="inline-flex items-center gap-2 rounded-xl glass px-5 py-2.5 text-sm font-medium transition hover:-translate-y-0.5"
              >
                <Mail className="h-4 w-4 text-primary" />
                Draft an email
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex h-40 w-40 shrink-0 items-center justify-center rounded-3xl glass glow-ring">
            <div className="relative h-24 w-24 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-xl shadow-primary/40">
              <Sparkles className="absolute inset-0 m-auto h-10 w-10 text-primary-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass glass-hover rounded-2xl p-4 sm:p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/80 to-accent text-primary-foreground shadow">
                <s.icon className="h-4 w-4" />
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 sm:text-xs">
                {s.change}
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{s.value}</div>
            <div className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Tools + Recent activity */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold sm:text-xl">Your AI tools</h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Jump into any module to get started.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <Link
                key={f.href}
                to={f.href}
                className="glass glass-hover group relative overflow-hidden rounded-2xl p-5 sm:p-6"
              >
                <div
                  className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${f.accent} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`}
                />
                <div className="relative">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.accent} text-white shadow-lg`}
                  >
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold sm:text-lg">{f.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {f.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Open
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <aside className="glass rounded-2xl p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Recent activity
            </h2>
          </div>
          <ul className="space-y-3">
            {recentActivity.map((a, i) => (
              <li
                key={i}
                className="group flex items-start gap-3 rounded-xl p-2 transition hover:bg-white/40"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-accent/30 text-primary">
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.meta}</p>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground sm:text-xs">
                  {a.time}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            All systems running smoothly
          </div>
        </aside>
      </section>

      <ResponsibleAINotice />
    </div>
  );
}

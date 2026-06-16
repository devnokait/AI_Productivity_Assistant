import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, Copy, Check } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";

export function FeaturePage({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-8">
      <header className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md">
          {icon}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </header>
      {children}
      <ResponsibleAINotice />
    </div>
  );
}

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`glass rounded-2xl p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function OutputCard({
  output,
  loading,
  error,
  emptyHint,
}: {
  output: string;
  loading: boolean;
  error: string | null;
  emptyHint: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <GlassCard className="min-h-[260px]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Output
        </h2>
        {output && !loading && (
          <Button size="sm" variant="ghost" onClick={copy} className="h-8 gap-1">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </div>
      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Generating with AI…
        </div>
      )}
      {error && !loading && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}
      {!loading && !error && !output && (
        <p className="text-sm text-muted-foreground">{emptyHint}</p>
      )}
      {!loading && output && (
        <article className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90 whitespace-pre-wrap">
          <ReactMarkdown>{output}</ReactMarkdown>
        </article>
      )}
    </GlassCard>
  );
}
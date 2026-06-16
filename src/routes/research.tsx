import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FeaturePage, GlassCard, OutputCard } from "@/components/feature-panel";
import { researchTopic } from "@/lib/ai/workflow.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — WorkFlow AI" },
      { name: "description", content: "Summarize articles or topics and extract insights." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const fn = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const res = await fn({ data: { topic } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to research topic");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FeaturePage
      title="AI Research Assistant"
      description="Paste an article or describe a topic — get a summary, insights and recommendations."
      icon={<BookOpen className="h-6 w-6" />}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="topic">Article text or topic</Label>
              <Textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Paste an article or ask about a topic, e.g. 'The state of remote work productivity in 2025'"
                rows={14}
                required
              />
            </div>
            <Button type="submit" disabled={loading || topic.trim().length < 3} className="w-full">
              <Sparkles className="h-4 w-4" />
              {loading ? "Researching…" : "Generate Research"}
            </Button>
          </form>
        </GlassCard>
        <OutputCard
          output={output}
          loading={loading}
          error={error}
          emptyHint="Insights and recommendations will appear here."
        />
      </div>
    </FeaturePage>
  );
}
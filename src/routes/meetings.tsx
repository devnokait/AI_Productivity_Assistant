import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { NotebookPen, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FeaturePage, GlassCard, OutputCard } from "@/components/feature-panel";
import { summarizeMeeting } from "@/lib/ai/workflow.functions";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkFlow AI" },
      { name: "description", content: "Turn meeting notes into summaries, actions and deadlines." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const fn = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const res = await fn({ data: { notes } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FeaturePage
      title="Meeting Notes Summarizer"
      description="Paste raw meeting notes — get a clean summary, key points, action items and deadlines."
      icon={<NotebookPen className="h-6 w-6" />}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Meeting notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your meeting notes, transcript, or rough bullet points here…"
                rows={14}
                required
              />
            </div>
            <Button type="submit" disabled={loading || notes.trim().length < 10} className="w-full">
              <Sparkles className="h-4 w-4" />
              {loading ? "Summarizing…" : "Summarize Notes"}
            </Button>
          </form>
        </GlassCard>
        <OutputCard
          output={output}
          loading={loading}
          error={error}
          emptyHint="Your structured summary will appear here."
        />
      </div>
    </FeaturePage>
  );
}
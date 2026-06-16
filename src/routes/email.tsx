import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeaturePage, GlassCard, OutputCard } from "@/components/feature-panel";
import { generateEmail } from "@/lib/ai/workflow.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkFlow AI" },
      {
        name: "description",
        content: "Generate professional emails with tone and audience control.",
      },
    ],
  }),
  component: EmailPage,
});

type Tone = "Formal" | "Informal" | "Persuasive";
type Audience = "Client" | "Manager" | "Team Member";

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [audience, setAudience] = useState<Audience>("Client");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const res = await fn({ data: { topic, context: context || undefined, tone, audience } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FeaturePage
      title="Smart Email Generator"
      description="Draft polished emails in seconds with the right tone for your audience."
      icon={<Mail className="h-6 w-6" />}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="topic">Topic / purpose</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Follow up on Q3 project proposal"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Informal">Informal</SelectItem>
                    <SelectItem value="Persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Audience</Label>
                <Select value={audience} onValueChange={(v) => setAudience(v as Audience)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Team Member">Team Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="context">Additional context (optional)</Label>
              <Textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Key points, names, dates, prior conversation…"
                rows={5}
              />
            </div>
            <Button type="submit" disabled={loading || !topic.trim()} className="w-full">
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating…" : "Generate Email"}
            </Button>
          </form>
        </GlassCard>
        <OutputCard
          output={output}
          loading={loading}
          error={error}
          emptyHint="Your generated email will appear here."
        />
      </div>
    </FeaturePage>
  );
}
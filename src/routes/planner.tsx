import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CalendarClock, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
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
import { planTasks } from "@/lib/ai/workflow.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkFlow AI" },
      { name: "description", content: "Prioritize tasks and generate daily or weekly schedules." },
    ],
  }),
  component: PlannerPage,
});

type Horizon = "Daily" | "Weekly";

function PlannerPage() {
  const fn = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState<Horizon>("Daily");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const res = await fn({ data: { tasks, horizon } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to plan tasks");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FeaturePage
      title="AI Task Planner"
      description="List your tasks and deadlines — get a prioritized, time-blocked schedule."
      icon={<CalendarClock className="h-6 w-6" />}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="tasks">Tasks & deadlines</Label>
              <Textarea
                id="tasks"
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder={"e.g.\n- Finish Q3 report (due Friday)\n- Prep board slides (due Wed)\n- Reply to vendor email"}
                rows={12}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Schedule horizon</Label>
              <Select value={horizon} onValueChange={(v) => setHorizon(v as Horizon)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading || tasks.trim().length < 5} className="w-full">
              <Sparkles className="h-4 w-4" />
              {loading ? "Planning…" : "Build My Schedule"}
            </Button>
          </form>
        </GlassCard>
        <OutputCard
          output={output}
          loading={loading}
          error={error}
          emptyHint="Your prioritized schedule will appear here."
        />
      </div>
    </FeaturePage>
  );
}
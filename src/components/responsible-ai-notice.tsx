import { Info } from "lucide-react";

export function ResponsibleAINotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`glass rounded-xl p-3 text-xs text-muted-foreground flex gap-2 items-start ${className}`}
    >
      <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
      <p>
        AI-generated content may contain inaccuracies. Users should review outputs before
        making decisions and should not share confidential information.
      </p>
    </div>
  );
}
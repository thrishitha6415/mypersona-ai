import { type LucideIcon, ArrowUpRight } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  delta?: string;
  icon: LucideIcon;
  tone?: "primary" | "secondary" | "success" | "warning";
};

const TONE: Record<NonNullable<Props["tone"]>, string> = {
  primary: "from-primary/20 to-primary/0 text-primary",
  secondary: "from-secondary/20 to-secondary/0 text-secondary",
  success: "from-success/20 to-success/0 text-success",
  warning: "from-warning/20 to-warning/0 text-warning",
};

export function StatCard({ label, value, delta, icon: Icon, tone = "primary" }: Props) {
  return (
    <div className="surface-card group relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong">
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${TONE[tone]} opacity-60 blur-2xl`}
      />
      <div className="relative flex items-start justify-between">
        <div className={`grid h-9 w-9 place-items-center rounded-xl bg-[color:var(--card)] border border-border ${TONE[tone].split(" ").pop()}`}>
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>
        {delta && (
          <span className="inline-flex items-center gap-0.5 rounded-full border border-border bg-[color:var(--surface)] px-2 py-0.5 text-[10px] font-medium text-success">
            <ArrowUpRight className="h-3 w-3" />
            {delta}
          </span>
        )}
      </div>
      <div className="relative mt-6">
        <div className="text-display text-3xl tabular-nums">{value}</div>
        <div className="mt-1 text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

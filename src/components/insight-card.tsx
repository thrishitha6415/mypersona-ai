import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  headline: string;
  detail: string;
  tone?: "primary" | "secondary" | "success" | "warning";
  progress?: number; // 0-100
};

const TONE: Record<NonNullable<Props["tone"]>, { glow: string; ic: string; bar: string }> = {
  primary:   { glow: "from-primary/25",   ic: "text-primary",   bar: "from-primary to-secondary" },
  secondary: { glow: "from-secondary/25", ic: "text-secondary", bar: "from-secondary to-primary" },
  success:   { glow: "from-success/25",   ic: "text-success",   bar: "from-success to-primary" },
  warning:   { glow: "from-warning/25",   ic: "text-warning",   bar: "from-warning to-secondary" },
};

export function InsightCard({
  icon: Icon,
  label,
  headline,
  detail,
  tone = "primary",
  progress,
}: Props) {
  const t = TONE[tone];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-[color:var(--card)]/70 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_18px_40px_-22px_rgba(59,130,246,0.45)]">
      <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${t.glow} to-transparent blur-2xl opacity-70`} />
      <div className="relative flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        <Icon className={`h-3.5 w-3.5 ${t.ic}`} />
        {label}
      </div>
      <h3 className="relative mt-3 text-display text-[22px] leading-tight">{headline}</h3>
      <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">{detail}</p>
      {typeof progress === "number" && (
        <div className="relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--surface)]">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${t.bar} transition-[width] duration-700`}
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}

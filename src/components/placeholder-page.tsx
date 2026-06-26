import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
};

export function PlaceholderPage({ icon: Icon, eyebrow, title, description }: Props) {
  return (
    <div className="mx-auto max-w-3xl pt-10">
      <div className="surface-card p-10 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-border bg-[color:var(--surface)] text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-display text-3xl leading-tight lg:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

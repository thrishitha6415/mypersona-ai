import { type LucideIcon } from "lucide-react";

type Props = {
  title: string;
  meta: string;
  description?: string;
  icon: LucideIcon;
  tag?: string;
};

export function TimelineItem({ title, meta, description, icon: Icon, tag }: Props) {
  return (
    <li className="group relative pl-10">
      <span className="absolute left-0 top-0 grid h-7 w-7 place-items-center rounded-lg border border-border bg-[color:var(--card)] text-muted-foreground transition-colors group-hover:text-primary">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="absolute left-[13px] top-7 bottom-0 w-px bg-border" />
      <div className="pb-6">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          {tag && (
            <span className="rounded-full border border-border bg-[color:var(--surface)] px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {tag}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>
        {description && (
          <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{description}</p>
        )}
      </div>
    </li>
  );
}

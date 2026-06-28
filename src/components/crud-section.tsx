import { useState } from "react";
import { Plus, Pencil, Trash2, type LucideIcon } from "lucide-react";
import { EditDialog, type FieldDef } from "./edit-dialog";
import { useUserRows, type TableName } from "@/hooks/use-user-data";

type Props<R extends { id: string }> = {
  table: TableName;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  fields: FieldDef[];
  emptyHint: string;
  renderItem: (row: R) => { primary: string; secondary?: string; meta?: string; tag?: string };
};

export function CrudSection<R extends { id: string }>({
  table,
  icon: Icon,
  title,
  subtitle,
  fields,
  emptyHint,
  renderItem,
}: Props<R>) {
  const { rows, isLoading, insert, update, remove } = useUserRows<R>(table);
  const [editing, setEditing] = useState<R | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <section className="surface-card p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Icon className="h-3.5 w-3.5 text-primary" />
            {title}
          </div>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-[color:var(--surface)]/60 px-3 py-1.5 text-xs font-medium transition-all hover:border-border-strong hover:-translate-y-0.5"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-[color:var(--surface)]/40 px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">{emptyHint}</p>
            <button
              onClick={() => setCreating(true)}
              className="mt-3 text-xs font-medium text-primary hover:underline"
            >
              Add your first
            </button>
          </div>
        ) : (
          <ul className="space-y-2">
            {rows.map((row) => {
              const r = renderItem(row);
              return (
                <li
                  key={row.id}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-[color:var(--surface)]/50 px-4 py-3 transition-all hover:border-border-strong"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">{r.primary}</p>
                      {r.tag && (
                        <span className="rounded-full border border-border bg-[color:var(--card)] px-2 py-0.5 text-[10px] text-muted-foreground">
                          {r.tag}
                        </span>
                      )}
                    </div>
                    {r.secondary && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{r.secondary}</p>
                    )}
                    {r.meta && <p className="mt-0.5 text-[11px] text-muted-foreground">{r.meta}</p>}
                  </div>
                  <div className="flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => setEditing(row)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-[color:var(--card)] hover:text-foreground"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this item?")) remove.mutate(row.id);
                      }}
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <EditDialog
        open={creating}
        onOpenChange={setCreating}
        title={`Add ${title}`}
        fields={fields}
        submitting={insert.isPending}
        onSubmit={async (values) => {
          await insert.mutateAsync(values);
        }}
      />
      <EditDialog
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
        title={`Edit ${title}`}
        fields={fields}
        initial={editing as unknown as Record<string, unknown>}
        submitting={update.isPending}
        onSubmit={async (values) => {
          if (editing) await update.mutateAsync({ id: editing.id, values });
        }}
      />
    </section>
  );
}

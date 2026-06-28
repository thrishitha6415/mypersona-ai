import { useEffect, useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "date" | "url" | "tags" | "checkbox";
  placeholder?: string;
  required?: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  fields: FieldDef[];
  initial?: Record<string, unknown> | null;
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
  submitting?: boolean;
  footer?: ReactNode;
};

function toInput(v: unknown, type?: FieldDef["type"]): string {
  if (v == null) return "";
  if (type === "tags" && Array.isArray(v)) return v.join(", ");
  if (type === "date" && typeof v === "string") return v.slice(0, 10);
  return String(v);
}

function fromInput(raw: string, type?: FieldDef["type"]): unknown {
  const v = raw.trim();
  if (type === "number") return v === "" ? null : Number(v);
  if (type === "tags") return v === "" ? [] : v.split(",").map((s) => s.trim()).filter(Boolean);
  if (type === "date") return v === "" ? null : v;
  if (type === "checkbox") return raw === "true";
  return v === "" ? null : v;
}

export function EditDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  initial,
  onSubmit,
  submitting,
}: Props) {
  const [state, setState] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const init: Record<string, string> = {};
    for (const f of fields) init[f.name] = toInput(initial?.[f.name], f.type);
    setState(init);
    setError(null);
  }, [open, initial, fields]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const values: Record<string, unknown> = {};
    for (const f of fields) {
      const v = fromInput(state[f.name] ?? "", f.type);
      if (f.required && (v == null || v === "")) {
        setError(`${f.label} is required`);
        return;
      }
      values[f.name] = v;
    }
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <Label htmlFor={f.name}>{f.label}</Label>
              {f.type === "textarea" ? (
                <Textarea
                  id={f.name}
                  rows={4}
                  value={state[f.name] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => setState((s) => ({ ...s, [f.name]: e.target.value }))}
                />
              ) : f.type === "checkbox" ? (
                <input
                  id={f.name}
                  type="checkbox"
                  checked={state[f.name] === "true"}
                  onChange={(e) =>
                    setState((s) => ({ ...s, [f.name]: e.target.checked ? "true" : "false" }))
                  }
                  className="h-4 w-4"
                />
              ) : (
                <Input
                  id={f.name}
                  type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "url" ? "url" : "text"}
                  value={state[f.name] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => setState((s) => ({ ...s, [f.name]: e.target.value }))}
                />
              )}
            </div>
          ))}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

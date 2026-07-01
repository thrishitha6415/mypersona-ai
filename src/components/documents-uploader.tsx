import { useRef, useState } from "react";
import { FileText, Upload, Trash2, ExternalLink, Sparkles, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useUserRows } from "@/hooks/use-user-data";
import { analyzeDocument } from "@/lib/ai.functions";
import { useQueryClient } from "@tanstack/react-query";

type DocRow = {
  id: string;
  title: string;
  doc_type: string | null;
  file_url: string | null;
  storage_path: string | null;
  size_bytes: number | null;
  mime_type: string | null;
  created_at: string;
};

export function DocumentsUploader() {
  const { user } = useAuth();
  const { rows, isLoading, insert, remove } = useUserRows<DocRow>("documents");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docType, setDocType] = useState<"resume" | "certificate" | "other">("resume");
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;
    setBusy(true);
    setError(null);
    try {
      const path = `${user.id}/${docType}-${Date.now()}-${file.name}`;
      const up = await supabase.storage
        .from("documents")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (up.error) throw up.error;
      const { data: signed } = await supabase.storage
        .from("documents")
        .createSignedUrl(path, 60 * 60 * 24 * 365);
      await insert.mutateAsync({
        title: file.name,
        doc_type: docType,
        storage_path: path,
        file_url: signed?.signedUrl ?? null,
        mime_type: file.type,
        size_bytes: file.size,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(row: DocRow) {
    if (!confirm(`Delete "${row.title}"?`)) return;
    if (row.storage_path) {
      await supabase.storage.from("documents").remove([row.storage_path]);
    }
    await remove.mutateAsync(row.id);
  }

  return (
    <section className="surface-card p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <FileText className="h-3.5 w-3.5 text-primary" /> Documents
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload your resume, certificates, and other files.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as typeof docType)}
            className="rounded-lg border border-border bg-[color:var(--surface)]/60 px-2.5 py-1.5 text-xs"
          >
            <option value="resume">Resume</option>
            <option value="certificate">Certificate</option>
            <option value="other">Other</option>
          </select>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={onFile}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          />
          <button
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-[color:var(--surface)]/60 px-3 py-1.5 text-xs font-medium transition-all hover:border-border-strong hover:-translate-y-0.5 disabled:opacity-60"
          >
            <Upload className="h-3.5 w-3.5" /> {busy ? "Uploading…" : "Upload"}
          </button>
        </div>
      </div>

      {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

      <div className="mt-5">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-[color:var(--surface)]/40 px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {rows.map((row) => (
              <li
                key={row.id}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-[color:var(--surface)]/50 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{row.title}</p>
                    {row.doc_type && (
                      <span className="rounded-full border border-border bg-[color:var(--card)] px-2 py-0.5 text-[10px] text-muted-foreground">
                        {row.doc_type}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {row.size_bytes ? `${Math.round(row.size_bytes / 1024)} KB · ` : ""}
                    {new Date(row.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {row.file_url && (
                    <a
                      href={row.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-[color:var(--card)] hover:text-foreground"
                      title="Open"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => onDelete(row)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

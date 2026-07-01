import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2, Search, ExternalLink } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { askPersona, smartSearch } from "@/lib/ai.functions";

export const Route = createFileRoute("/_app/ask")({
  head: () => ({ meta: [{ title: "Ask Persona · PersonaAI" }] }),
  component: AskPage,
});

type Msg = { role: "user" | "assistant"; content: string };
type SearchResult = { kind: string; title: string; meta?: string; url?: string; id: string };

const SUGGESTIONS = [
  "Show all my certificates",
  "What skills do I have?",
  "Show my latest resume",
  "What should I learn next?",
];

function AskPage() {
  const ask = useServerFn(askPersona);
  const search = useServerFn(smartSearch);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function submit(q?: string) {
    const question = (q ?? input).trim();
    if (!question || busy) return;
    setInput("");
    setErr(null);
    setResults(null);
    const history = messages.slice(-6);
    const next: Msg[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setBusy(true);
    try {
      // Run search + AI answer in parallel
      const [searchRes, aiRes] = await Promise.all([
        search({ data: { query: question } }).catch(() => ({ results: [] })),
        ask({ data: { question, history } }),
      ]);
      setResults(searchRes.results ?? []);
      setMessages((m) => [...m, { role: "assistant", content: aiRes.answer || "…" }]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Persona could not respond");
      setMessages((m) => m.slice(0, -1));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <header>
        <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Ask Persona
        </div>
        <h1 className="mt-2 text-display text-3xl tracking-tight lg:text-4xl">
          A quiet companion for your next question.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ask about your data or what to do next — Persona uses your profile as context.
        </p>
      </header>

      <div ref={scrollRef} className="surface-card max-h-[52vh] overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">Start a conversation with your Persona.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="rounded-full border border-border bg-[color:var(--surface)]/60 px-3 py-1.5 text-xs text-foreground/80 hover:border-border-strong hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground"
                    : "border border-border bg-[color:var(--surface)]/70 text-foreground"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
        {busy && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-border bg-[color:var(--surface)]/70 px-4 py-2.5 text-sm text-muted-foreground inline-flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
            </div>
          </div>
        )}
      </div>

      {err && <p className="text-xs text-destructive">{err}</p>}

      {results && results.length > 0 && (
        <section className="surface-card p-5">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Search className="h-3.5 w-3.5 text-secondary" /> From your data
          </div>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {results.map((r) => (
              <li key={`${r.kind}-${r.id}`} className="flex items-start justify-between gap-2 rounded-xl border border-border bg-[color:var(--surface)]/60 px-3 py-2.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{r.kind}</span>
                  </div>
                  <p className="truncate text-sm font-medium">{r.title}</p>
                  {r.meta && <p className="truncate text-[11px] text-muted-foreground">{r.meta}</p>}
                </div>
                {r.url && (
                  <a href={r.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); submit(); }}
        className="sticky bottom-4 flex items-center gap-2 rounded-2xl border border-border bg-[color:var(--card)]/80 p-2 backdrop-blur-xl"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your journey…"
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          disabled={busy}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-primary to-secondary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          Send
        </button>
      </form>
    </div>
  );
}

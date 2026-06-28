import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/brand-logo";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Sign in · PersonaAI" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setInfo("Check your inbox to verify your email, then sign in.");
          setMode("signin");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground grid place-items-center px-4">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[480px] w-[480px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 h-[420px] w-[420px] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md surface-card p-8 animate-fade-in">
        <div className="flex items-center gap-3">
          <BrandLogo size={36} />
          <div>
            <p className="text-display text-lg leading-none">PersonaAI</p>
            <p className="text-xs text-muted-foreground mt-1">Your AI Career Companion</p>
          </div>
        </div>

        <h1 className="text-display text-2xl mt-8">
          {mode === "signin" ? "Welcome back" : "Create your persona"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "signin"
            ? "Sign in to continue your journey."
            : "Start building your AI-powered digital identity."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-border bg-[color:var(--card)]/60 px-4 py-2.5 text-sm focus:border-border-strong focus:outline-none"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-[color:var(--card)]/60 px-4 py-2.5 text-sm focus:border-border-strong focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            className="w-full rounded-xl border border-border bg-[color:var(--card)]/60 px-4 py-2.5 text-sm focus:border-border-strong focus:outline-none"
            required
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          {info && <p className="text-xs text-success">{info}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-br from-primary to-secondary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-12px_var(--primary)] disabled:opacity-60"
          >
            {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-5 w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "signin"
            ? "New here? Create an account"
            : "Already have an account? Sign in"}
        </button>

        <Link to="/" className="mt-3 block text-center text-[11px] text-muted-foreground hover:text-foreground">
          Back to home
        </Link>
      </div>
    </div>
  );
}

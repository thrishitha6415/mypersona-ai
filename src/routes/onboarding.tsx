import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/brand-logo";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  head: () => ({ meta: [{ title: "Complete your profile · PersonaAI" }] }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
  },
  component: OnboardingPage,
});

type Form = {
  full_name: string;
  college: string;
  degree: string;
  graduation_year: string;
  career_goal: string;
  skills_summary: string;
  bio: string;
};

function OnboardingPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Form>({
    full_name: "",
    college: "",
    degree: "",
    graduation_year: "",
    career_goal: "",
    skills_summary: "",
    bio: "",
  });

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        navigate({ to: "/auth" });
        return;
      }
      setUserId(u.user.id);
      setEmail(u.user.email ?? null);
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", u.user.id)
        .maybeSingle();
      if (p?.onboarded) {
        navigate({ to: "/" });
        return;
      }
      if (p) {
        setForm((f) => ({
          ...f,
          full_name: p.full_name ?? "",
          college: p.college ?? "",
          degree: p.degree ?? "",
          graduation_year: p.graduation_year ? String(p.graduation_year) : "",
          career_goal: p.career_goal ?? "",
          bio: p.bio ?? "",
          skills_summary: p.skills_summary ?? "",
        }));
      }
      setLoading(false);
    })();
  }, [navigate]);

  function set<K extends keyof Form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSubmitting(true);
    setError(null);
    try {
      let avatar_url: string | undefined;
      if (avatarFile) {
        const path = `${userId}/avatar-${Date.now()}-${avatarFile.name}`;
        const up = await supabase.storage.from("avatars").upload(path, avatarFile, {
          upsert: true,
          contentType: avatarFile.type,
        });
        if (up.error) throw up.error;
        const { data: signed } = await supabase.storage
          .from("avatars")
          .createSignedUrl(path, 60 * 60 * 24 * 365);
        avatar_url = signed?.signedUrl;
      }

      const skillNames = form.skills_summary
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const update = {
        full_name: form.full_name.trim() || null,
        college: form.college.trim() || null,
        degree: form.degree.trim() || null,
        graduation_year: form.graduation_year ? Number(form.graduation_year) : null,
        career_goal: form.career_goal.trim() || null,
        bio: form.bio.trim() || null,
        skills_summary: form.skills_summary.trim() || null,
        ...(avatar_url ? { avatar_url } : {}),
        onboarded: true,
      };

      const { error: upErr } = await supabase
        .from("profiles")
        .update(update)
        .eq("id", userId);
      if (upErr) throw upErr;

      if (skillNames.length > 0) {
        const { data: existing } = await supabase
          .from("skills")
          .select("name")
          .eq("user_id", userId);
        const have = new Set((existing ?? []).map((s) => s.name.toLowerCase()));
        const toInsert = skillNames
          .filter((n) => !have.has(n.toLowerCase()))
          .map((name) => ({ user_id: userId, name, level: 50, is_top: false }));
        if (toInsert.length > 0) {
          await supabase.from("skills").insert(toInsert);
        }
      }

      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        <p className="text-sm">Loading your workspace…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[480px] w-[480px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 h-[420px] w-[420px] rounded-full bg-secondary/10 blur-[120px]" />
      </div>
      <div className="mx-auto w-full max-w-2xl animate-fade-in">
        <div className="flex items-center gap-3">
          <BrandLogo size={36} />
          <div>
            <p className="text-display text-lg leading-none">PersonaAI</p>
            <p className="mt-1 text-xs text-muted-foreground">{email}</p>
          </div>
        </div>

        <h1 className="mt-8 text-display text-3xl tracking-tight lg:text-4xl">
          Complete your profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A few details so Persona can shape itself around you. You can edit anything later.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5 surface-card p-6">
          <Field label="Full name" required>
            <input
              required
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Profile photo (optional)">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
              className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-lg file:border file:border-border file:bg-[color:var(--surface)] file:px-3 file:py-2 file:text-xs file:text-foreground"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="College" required>
              <input
                required
                value={form.college}
                onChange={(e) => set("college", e.target.value)}
                className="input"
                placeholder="e.g. IIT Bombay"
              />
            </Field>
            <Field label="Degree" required>
              <input
                required
                value={form.degree}
                onChange={(e) => set("degree", e.target.value)}
                className="input"
                placeholder="e.g. B.Tech Computer Science"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Graduation year" required>
              <input
                required
                type="number"
                min={1980}
                max={2100}
                value={form.graduation_year}
                onChange={(e) => set("graduation_year", e.target.value)}
                className="input"
                placeholder="2027"
              />
            </Field>
            <Field label="Career goal" required>
              <input
                required
                value={form.career_goal}
                onChange={(e) => set("career_goal", e.target.value)}
                className="input"
                placeholder="e.g. ML Engineer"
              />
            </Field>
          </div>

          <Field label="Skills" hint="Comma-separated. We'll add them to your skill list.">
            <input
              value={form.skills_summary}
              onChange={(e) => set("skills_summary", e.target.value)}
              className="input"
              placeholder="Python, React, SQL, Figma"
            />
          </Field>

          <Field label="Short bio">
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              className="input resize-none"
              placeholder="Tell Persona about yourself."
            />
          </Field>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-12px_var(--primary)] disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Continue to PersonaAI"}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: color-mix(in srgb, var(--card) 60%, transparent);
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          color: var(--foreground);
          outline: none;
        }
        .input:focus { border-color: var(--border-strong); }
      `}</style>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-foreground/90">
        {label}
        {required && <span className="text-primary"> *</span>}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

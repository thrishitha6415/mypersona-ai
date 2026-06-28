import { createFileRoute } from "@tanstack/react-router";
import {
  Sparkles, Target, Briefcase, FileText, Github, Linkedin, BookOpen, Heart, Zap, TrendingUp,
  CheckCircle2, Award, Code2, GraduationCap, Medal,
} from "lucide-react";
import { CircularProgress } from "@/components/circular-progress";
import { useProfile } from "@/hooks/use-profile";
import { useUserRows } from "@/hooks/use-user-data";
import { EditProfileButton } from "@/components/edit-profile-dialog";
import { CrudSection } from "@/components/crud-section";

export const Route = createFileRoute("/_app/my-persona")({
  head: () => ({ meta: [{ title: "My Persona · PersonaAI" }] }),
  component: MyPersona,
});

type Skill = { id: string; name: string; level: number; is_top: boolean };

function MyPersona() {
  const { profile, loading } = useProfile();
  const { rows: skills } = useUserRows<Skill>("skills");

  const name = profile?.full_name ?? "Your Persona";
  const headline = profile?.headline ?? "Add a headline to your profile";
  const initial = (name?.trim()?.[0] ?? "P").toUpperCase();
  const topSkills = [...skills].sort((a, b) => b.level - a.level).slice(0, 8);
  const github = profile?.github_handle;
  const linkedin = profile?.linkedin_handle;
  const strengths = profile?.strengths ?? [];
  const growth = profile?.growth_areas ?? [];
  const interests = profile?.learning_interests ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-primary-foreground shadow-[0_18px_40px_-18px_var(--primary)]">
              {initial}
            </div>
            <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-success">
              <CheckCircle2 className="h-3 w-3 text-background" />
            </span>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">My Persona</p>
            <h1 className="mt-1 text-display text-3xl tracking-tight lg:text-4xl">{name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{headline}</p>
          </div>
        </div>
        <EditProfileButton />
      </header>

      {/* AI Summary */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-[color:var(--card)]/70 p-6 backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> About
        </div>
        <p className="relative mt-4 text-[17px] leading-relaxed text-foreground">
          {profile?.bio ?? (loading ? "Loading…" : "Add a short bio to tell Persona who you are.")}
        </p>
      </section>

      {/* Dream / Goal */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="surface-card p-6">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Heart className="h-3.5 w-3.5 text-primary" /> Dream Career
          </div>
          <h3 className="mt-3 text-display text-2xl">{profile?.dream_career ?? "Not set"}</h3>
        </div>
        <div className="surface-card p-6">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Target className="h-3.5 w-3.5 text-secondary" /> Career Goal
          </div>
          <h3 className="mt-3 text-display text-2xl">{profile?.career_goal ?? "Not set"}</h3>
        </div>
      </section>

      {/* Top Skills bars */}
      {topSkills.length > 0 && (
        <section className="surface-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-display text-lg">Top Skills</h2>
            <p className="text-xs text-muted-foreground">From your skill list</p>
          </div>
          <ul className="mt-5 space-y-4">
            {topSkills.map((s) => (
              <li key={s.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{s.name}</span>
                  <span className="tabular-nums text-muted-foreground">{s.level}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--surface)]">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${s.level}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Strengths + Growth */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="surface-card p-6">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-success" /> Strengths
          </div>
          {strengths.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Add strengths via Edit persona.</p>
          ) : (
            <ul className="mt-4 flex flex-wrap gap-2">
              {strengths.map((s) => (
                <li key={s} className="rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success">{s}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="surface-card p-6">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-warning" /> Growth Areas
          </div>
          {growth.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Add areas to improve via Edit persona.</p>
          ) : (
            <ul className="mt-4 flex flex-wrap gap-2">
              {growth.map((s) => (
                <li key={s} className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1.5 text-xs font-medium text-warning">{s}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Scores */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="surface-elev flex items-center gap-6 p-6">
          <CircularProgress value={profile?.resume_score ?? 0} size={120} stroke={10} label="resume" />
          <div>
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <FileText className="h-3.5 w-3.5 text-primary" /> Resume Score
            </div>
            <p className="mt-2 text-display text-xl">{profile?.resume_score != null ? `${profile.resume_score}/100` : "Not set"}</p>
          </div>
        </div>
        <div className="surface-elev flex items-center gap-6 p-6">
          <CircularProgress value={profile?.career_readiness ?? 0} size={120} stroke={10} label="readiness" />
          <div>
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5 text-secondary" /> Career Readiness
            </div>
            <p className="mt-2 text-display text-xl">{profile?.career_readiness != null ? `${profile.career_readiness}/100` : "Not set"}</p>
          </div>
        </div>
      </section>

      {/* CRUD sections */}
      <CrudSection<Skill>
        table="skills"
        icon={Sparkles}
        title="Skills"
        subtitle="Build your skill graph."
        emptyHint="No skills yet. Add what you're great at."
        fields={[
          { name: "name", label: "Skill name", required: true },
          { name: "level", label: "Level (0-100)", type: "number" },
          { name: "category", label: "Category", placeholder: "e.g. ML, Frontend" },
          { name: "is_top", label: "Mark as top skill", type: "checkbox" },
        ]}
        renderItem={(s) => ({ primary: s.name, secondary: `Level ${s.level}%`, tag: s.is_top ? "Top" : undefined })}
      />

      <CrudSection<{ id: string; title: string; description: string | null; achieved_on: string | null; category: string | null }>
        table="achievements"
        icon={Medal}
        title="Achievements"
        emptyHint="No achievements logged."
        fields={[
          { name: "title", label: "Title", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "category", label: "Category", placeholder: "e.g. Award, Recognition" },
          { name: "achieved_on", label: "Date", type: "date" },
        ]}
        renderItem={(a) => ({ primary: a.title, secondary: a.description ?? undefined, meta: a.achieved_on ?? undefined, tag: a.category ?? undefined })}
      />

      <CrudSection<{ id: string; name: string; issuer: string | null; issued_on: string | null; credential_id: string | null; credential_url: string | null }>
        table="certificates"
        icon={Award}
        title="Certificates"
        emptyHint="No certificates added."
        fields={[
          { name: "name", label: "Certificate name", required: true },
          { name: "issuer", label: "Issuer" },
          { name: "issued_on", label: "Issued on", type: "date" },
          { name: "credential_id", label: "Credential ID" },
          { name: "credential_url", label: "Credential URL", type: "url" },
        ]}
        renderItem={(c) => ({ primary: c.name, secondary: c.issuer ?? undefined, meta: c.issued_on ?? undefined })}
      />

      <CrudSection<{ id: string; title: string; summary: string | null; description: string | null; repo_url: string | null; link: string | null; tags: string[] | null; completed_on: string | null }>
        table="projects"
        icon={Code2}
        title="Projects"
        emptyHint="No projects yet."
        fields={[
          { name: "title", label: "Title", required: true },
          { name: "summary", label: "Summary" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "repo_url", label: "Repository URL", type: "url" },
          { name: "link", label: "Live link", type: "url" },
          { name: "tags", label: "Tags (comma-separated)", type: "tags" },
          { name: "completed_on", label: "Completed on", type: "date" },
        ]}
        renderItem={(p) => ({ primary: p.title, secondary: p.summary ?? p.description ?? undefined, meta: p.completed_on ?? undefined, tag: p.tags?.[0] })}
      />

      <CrudSection<{ id: string; role: string; company: string; location: string | null; start_date: string | null; end_date: string | null; description: string | null; is_current: boolean }>
        table="internships"
        icon={GraduationCap}
        title="Internships"
        emptyHint="No internships logged."
        fields={[
          { name: "role", label: "Role", required: true },
          { name: "company", label: "Company", required: true },
          { name: "location", label: "Location" },
          { name: "start_date", label: "Start date", type: "date" },
          { name: "end_date", label: "End date", type: "date" },
          { name: "is_current", label: "Currently here", type: "checkbox" },
          { name: "description", label: "Description", type: "textarea" },
        ]}
        renderItem={(i) => ({ primary: `${i.role} · ${i.company}`, secondary: i.location ?? undefined, meta: i.is_current ? "Present" : i.end_date ?? undefined })}
      />

      <CrudSection<{ id: string; title: string; description: string | null; status: string; progress: number; target_date: string | null }>
        table="career_goals"
        icon={Target}
        title="Career Goals"
        emptyHint="No goals set."
        fields={[
          { name: "title", label: "Goal", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "status", label: "Status", placeholder: "active / paused / done" },
          { name: "progress", label: "Progress (0-100)", type: "number" },
          { name: "target_date", label: "Target date", type: "date" },
        ]}
        renderItem={(g) => ({ primary: g.title, secondary: `${g.progress}% · ${g.status}`, meta: g.target_date ?? undefined })}
      />

      <CrudSection<{ id: string; title: string; doc_type: string | null; file_url: string | null }>
        table="documents"
        icon={FileText}
        title="Documents"
        emptyHint="No documents linked."
        fields={[
          { name: "title", label: "Title", required: true },
          { name: "doc_type", label: "Type", placeholder: "resume, transcript, …" },
          { name: "file_url", label: "File URL", type: "url" },
        ]}
        renderItem={(d) => ({ primary: d.title, secondary: d.file_url ?? undefined, tag: d.doc_type ?? undefined })}
      />

      {/* Learning interests */}
      <section className="surface-card p-6">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5 text-secondary" /> Learning Interests
        </div>
        {interests.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Add interests via Edit persona.</p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-2">
            {interests.map((i) => (
              <li key={i} className="rounded-full border border-border bg-[color:var(--surface)] px-3 py-1.5 text-xs font-medium text-foreground/90">{i}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Connected accounts */}
      <section className="surface-card p-6">
        <h2 className="text-display text-lg">Connected accounts</h2>
        <p className="mt-1 text-xs text-muted-foreground">Update via Edit persona.</p>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {[
            { icon: Github, name: "GitHub", handle: github },
            { icon: Linkedin, name: "LinkedIn", handle: linkedin },
          ].map((c) => {
            const I = c.icon;
            return (
              <li key={c.name} className="flex items-center justify-between rounded-xl border border-border bg-[color:var(--surface)]/60 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-[color:var(--card)]">
                    <I className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className={`text-xs ${c.handle ? "text-success" : "text-muted-foreground"}`}>
                      {c.handle ? `@${c.handle}` : "Not connected"}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

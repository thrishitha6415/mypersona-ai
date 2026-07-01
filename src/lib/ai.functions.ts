import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- Types ----------

type AnalyzeResult = {
  category: string;
  summary: string;
  skills: string[];
  projects: { title: string; description?: string; tags?: string[] }[];
  certifications: { name: string; issuer?: string; issued_on?: string }[];
  internships: { role: string; company: string; start_date?: string; end_date?: string; description?: string }[];
  achievements: { title: string; description?: string; achieved_on?: string }[];
  education: { degree?: string; institution?: string; year?: string }[];
};

type PersonaResult = {
  summary: string;
  strengths: string[];
  growth_areas: string[];
  resume_score: number;
  career_readiness: number;
  dream_career?: string;
  suggested_paths: string[];
};

type Recommendation = {
  category: "skill" | "project" | "internship" | "hackathon" | "course" | "certification";
  title: string;
  description: string;
  reason: string;
  priority: number;
  link?: string;
};

// ---------- Analyze a document ----------

export const analyzeDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { documentId: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { callGateway, tryParseJson } = await import("./ai-gateway.server");

    // Fetch doc, verify ownership
    const { data: doc, error: dErr } = await supabase
      .from("documents").select("*").eq("id", data.documentId).maybeSingle();
    if (dErr || !doc || doc.user_id !== userId) throw new Error("Document not found");

    // Download bytes from storage (RLS-scoped)
    let base64: string | null = null;
    if (doc.storage_path) {
      const dl = await supabase.storage.from("documents").download(doc.storage_path);
      if (dl.error) throw new Error(dl.error.message);
      const buf = new Uint8Array(await dl.data.arrayBuffer());
      // Convert to base64 without Buffer (worker-safe)
      let bin = "";
      for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
      base64 = btoa(bin);
    }

    const mime = doc.mime_type ?? "application/octet-stream";
    const isImage = mime.startsWith("image/");
    const isPdf = mime === "application/pdf";
    const isText = mime.startsWith("text/") || mime.includes("json") || mime.includes("markdown");

    const parts: Array<Record<string, unknown>> = [
      {
        type: "text",
        text: `You are an AI career analyst. Extract structured career information from this document titled "${doc.title}" (type hint: ${doc.doc_type ?? "unknown"}).
Return ONLY valid JSON with this exact shape:
{
  "category": "resume|certificate|internship_letter|project_report|transcript|other",
  "summary": "1-2 sentence summary",
  "skills": ["skill1", "skill2"],
  "projects": [{"title": "", "description": "", "tags": []}],
  "certifications": [{"name": "", "issuer": "", "issued_on": "YYYY-MM-DD"}],
  "internships": [{"role": "", "company": "", "start_date": "YYYY-MM-DD", "end_date": "YYYY-MM-DD", "description": ""}],
  "achievements": [{"title": "", "description": "", "achieved_on": "YYYY-MM-DD"}],
  "education": [{"degree": "", "institution": "", "year": ""}]
}
Empty arrays are OK. Omit fields you cannot infer.`,
      },
    ];

    if (base64 && isImage) {
      parts.push({ type: "image_url", image_url: { url: `data:${mime};base64,${base64}` } });
    } else if (base64 && isPdf) {
      parts.push({ type: "file", file: { filename: doc.title, file_data: `data:${mime};base64,${base64}` } });
    } else if (base64 && isText) {
      const text = atob(base64);
      parts.push({ type: "text", text: `Document contents:\n\n${text.slice(0, 40000)}` });
    } else if (base64) {
      // Try as file anyway
      parts.push({ type: "file", file: { filename: doc.title, file_data: `data:${mime};base64,${base64}` } });
    }

    const raw = await callGateway({
      messages: [
        { role: "system", content: "You extract structured data from career documents and always return valid JSON." },
        { role: "user", content: parts },
      ],
      json: true,
      temperature: 0.2,
    });

    const parsed = tryParseJson<AnalyzeResult>(raw);
    if (!parsed) throw new Error("Could not parse AI response");

    // Persist parsed_text + doc_type
    await supabase.from("documents").update({
      parsed_text: parsed.summary ?? null,
      doc_type: doc.doc_type ?? parsed.category ?? null,
    }).eq("id", doc.id);

    // Insert extracted rows. Best-effort; ignore individual failures.
    const sb: any = supabase;
    const inserts: Promise<unknown>[] = [];

    for (const s of parsed.skills ?? []) {
      if (!s) continue;
      inserts.push(Promise.resolve(sb.from("skills").insert({
        user_id: userId, name: String(s).slice(0, 80), level: 60,
      })));
    }
    for (const p of parsed.projects ?? []) {
      if (!p?.title) continue;
      inserts.push(Promise.resolve(sb.from("projects").insert({
        user_id: userId, title: p.title, description: p.description ?? null,
        tags: p.tags ?? null,
      })));
    }
    for (const c of parsed.certifications ?? []) {
      if (!c?.name) continue;
      inserts.push(Promise.resolve(sb.from("certificates").insert({
        user_id: userId, name: c.name, issuer: c.issuer ?? null,
        issued_on: normDate(c.issued_on), document_id: doc.id,
      })));
    }
    for (const i of parsed.internships ?? []) {
      if (!i?.role || !i?.company) continue;
      inserts.push(Promise.resolve(sb.from("internships").insert({
        user_id: userId, role: i.role, company: i.company,
        start_date: normDate(i.start_date), end_date: normDate(i.end_date),
        description: i.description ?? null,
      })));
    }
    for (const a of parsed.achievements ?? []) {
      if (!a?.title) continue;
      inserts.push(Promise.resolve(sb.from("achievements").insert({
        user_id: userId, title: a.title, description: a.description ?? null,
        achieved_on: normDate(a.achieved_on),
      })));
    }

    // Journey event
    inserts.push(Promise.resolve(sb.from("journey_events").insert({
      user_id: userId,
      title: `Analyzed: ${doc.title}`,
      description: parsed.summary ?? null,
      category: parsed.category ?? "document",
      occurred_on: new Date().toISOString().slice(0, 10),
    })));

    await Promise.allSettled(inserts);

    return { ok: true, extracted: parsed };
  });

function normDate(v?: string | null): string | null {
  if (!v) return null;
  const m = String(v).match(/\d{4}-\d{2}-\d{2}/);
  return m ? m[0] : null;
}

// ---------- Generate persona ----------

export const generatePersona = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { callGateway, tryParseJson } = await import("./ai-gateway.server");
    const ctx = await gatherUserContext(supabase, userId);

    const raw = await callGateway({
      messages: [
        { role: "system", content: "You are a career coach. Return only valid JSON." },
        { role: "user", content: `Given this student's profile, generate a Persona.
Return JSON with shape:
{
  "summary": "2-3 sentence professional AI summary",
  "strengths": ["..."],
  "growth_areas": ["..."],
  "resume_score": 0-100,
  "career_readiness": 0-100,
  "dream_career": "role title",
  "suggested_paths": ["path1", "path2", "path3"]
}

Profile:
${JSON.stringify(ctx, null, 2)}` },
      ],
      json: true,
    });
    const parsed = tryParseJson<PersonaResult>(raw);
    if (!parsed) throw new Error("Could not parse persona");

    await supabase.from("profiles").update({
      bio: parsed.summary ?? null,
      strengths: parsed.strengths ?? [],
      growth_areas: parsed.growth_areas ?? [],
      resume_score: clamp(parsed.resume_score),
      career_readiness: clamp(parsed.career_readiness),
      dream_career: parsed.dream_career ?? undefined,
    }).eq("id", userId);

    return parsed;
  });

function clamp(n: unknown): number {
  const v = Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

// ---------- Generate Compass recommendations ----------

export const generateCompass = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { callGateway, tryParseJson } = await import("./ai-gateway.server");
    const ctx = await gatherUserContext(supabase, userId);

    const raw = await callGateway({
      messages: [
        { role: "system", content: "You are a career mentor. Return only valid JSON." },
        { role: "user", content: `Based on this student's profile, produce a personalized roadmap.
Return JSON: { "recommendations": [{ "category": "skill|project|internship|hackathon|course|certification", "title": "", "description": "", "reason": "why this is recommended", "priority": 1-10, "link": "optional url" }] }
Provide 8-12 recommendations across categories. Be specific and actionable.

Profile:
${JSON.stringify(ctx, null, 2)}` },
      ],
      json: true,
    });
    const parsed = tryParseJson<{ recommendations: Recommendation[] }>(raw);
    const recs = parsed?.recommendations ?? [];
    if (recs.length === 0) throw new Error("No recommendations generated");

    // Replace existing AI-generated recs (keep manual ones)
    await supabase.from("recommendations").delete().eq("user_id", userId).eq("source", "ai");

    const rows = recs.map((r) => ({
      user_id: userId,
      title: String(r.title).slice(0, 160),
      description: r.description ?? null,
      reason: r.reason ?? null,
      category: r.category ?? "skill",
      link: r.link ?? null,
      priority: Number(r.priority) || 5,
      is_dismissed: false,
      source: "ai" as const,
    }));
    // "source" column may not exist; fall back gracefully
    const ins = await supabase.from("recommendations").insert(rows);
    if (ins.error) {
      // retry without source
      const clean = rows.map(({ source: _s, ...rest }) => rest);
      await supabase.from("recommendations").insert(clean);
    }

    return { count: rows.length };
  });

// ---------- Ask Persona (chat) ----------

export const askPersona = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { question: string; history?: { role: "user" | "assistant"; content: string }[] }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { callGateway } = await import("./ai-gateway.server");
    const ctx = await gatherUserContext(supabase, userId);

    const messages = [
      {
        role: "system" as const,
        content: `You are Persona, a warm, concise AI career companion. Answer the user's question using ONLY the profile context below when relevant. If the question is about their data (skills, projects, certificates, internships, achievements, goals, documents), list what you find. If nothing matches, say so honestly. Keep answers under 180 words unless asked for detail.

USER PROFILE CONTEXT:
${JSON.stringify(ctx, null, 2)}`,
      },
      ...(data.history ?? []),
      { role: "user" as const, content: data.question },
    ];

    const answer = await callGateway({ messages, temperature: 0.5 });
    return { answer };
  });

// ---------- Smart search ----------

export const smartSearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { query: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const q = data.query.toLowerCase();

    const [docs, skills, projects, certs, ints, achs] = await Promise.all([
      supabase.from("documents").select("*").eq("user_id", userId),
      supabase.from("skills").select("*").eq("user_id", userId),
      supabase.from("projects").select("*").eq("user_id", userId),
      supabase.from("certificates").select("*").eq("user_id", userId),
      supabase.from("internships").select("*").eq("user_id", userId),
      supabase.from("achievements").select("*").eq("user_id", userId),
    ]);

    const results: { kind: string; title: string; meta?: string; url?: string; id: string }[] = [];
    const wantAll = /show|list|all|my/.test(q);

    const push = (kind: string, items: unknown[] | null, mapper: (x: any) => { title: string; meta?: string; url?: string; id: string }, matchFn: (x: any) => boolean) => {
      (items ?? []).forEach((x) => {
        if (wantAll || matchFn(x)) results.push({ kind, ...mapper(x) });
      });
    };

    push("Document", docs.data, (d) => ({ id: d.id, title: d.title, meta: d.doc_type ?? undefined, url: d.file_url ?? undefined }),
      (d) => `${d.title} ${d.doc_type ?? ""}`.toLowerCase().includes(stripStop(q)));
    push("Skill", skills.data, (s) => ({ id: s.id, title: s.name, meta: `Level ${s.level}` }),
      (s) => s.name.toLowerCase().includes(stripStop(q)));
    push("Project", projects.data, (p) => ({ id: p.id, title: p.title, meta: p.summary ?? undefined }),
      (p) => `${p.title} ${p.description ?? ""} ${(p.tags ?? []).join(" ")}`.toLowerCase().includes(stripStop(q)));
    push("Certificate", certs.data, (c) => ({ id: c.id, title: c.name, meta: c.issuer ?? undefined, url: c.credential_url ?? undefined }),
      (c) => `${c.name} ${c.issuer ?? ""}`.toLowerCase().includes(stripStop(q)));
    push("Internship", ints.data, (i) => ({ id: i.id, title: `${i.role} · ${i.company}`, meta: i.location ?? undefined }),
      (i) => `${i.role} ${i.company}`.toLowerCase().includes(stripStop(q)));
    push("Achievement", achs.data, (a) => ({ id: a.id, title: a.title, meta: a.description ?? undefined }),
      (a) => a.title.toLowerCase().includes(stripStop(q)));

    return { results: results.slice(0, 30) };
  });

function stripStop(q: string): string {
  return q.replace(/\b(show|me|all|my|the|list|find|get|what|are|is|do|i|have)\b/g, "").trim();
}

// ---------- helpers ----------

async function gatherUserContext(supabase: any, userId: string) {
  const [profile, skills, projects, certs, ints, achs, goals, docs] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("skills").select("name,level,category").eq("user_id", userId),
    supabase.from("projects").select("title,summary,description,tags").eq("user_id", userId),
    supabase.from("certificates").select("name,issuer,issued_on").eq("user_id", userId),
    supabase.from("internships").select("role,company,start_date,end_date,description").eq("user_id", userId),
    supabase.from("achievements").select("title,description,achieved_on").eq("user_id", userId),
    supabase.from("career_goals").select("title,status,progress,description").eq("user_id", userId),
    supabase.from("documents").select("title,doc_type,parsed_text").eq("user_id", userId),
  ]);
  return {
    profile: profile.data ? {
      full_name: profile.data.full_name, headline: profile.data.headline, bio: profile.data.bio,
      dream_career: profile.data.dream_career, career_goal: profile.data.career_goal,
      college: profile.data.college, degree: profile.data.degree, graduation_year: profile.data.graduation_year,
      learning_interests: profile.data.learning_interests,
    } : null,
    skills: skills.data ?? [],
    projects: projects.data ?? [],
    certificates: certs.data ?? [],
    internships: ints.data ?? [],
    achievements: achs.data ?? [],
    career_goals: goals.data ?? [],
    documents: docs.data ?? [],
  };
}

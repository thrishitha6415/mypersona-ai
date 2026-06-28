import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EditDialog, type FieldDef } from "./edit-dialog";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/hooks/use-auth";
import { Pencil } from "lucide-react";

const FIELDS: FieldDef[] = [
  { name: "full_name", label: "Full name", type: "text", required: true },
  { name: "headline", label: "Headline", placeholder: "e.g. CS undergrad · ML enthusiast" },
  { name: "bio", label: "About you", type: "textarea" },
  { name: "dream_career", label: "Dream career" },
  { name: "career_goal", label: "Career goal" },
  { name: "resume_score", label: "Resume score (0-100)", type: "number" },
  { name: "career_readiness", label: "Career readiness (0-100)", type: "number" },
  { name: "github_handle", label: "GitHub handle" },
  { name: "linkedin_handle", label: "LinkedIn handle" },
  { name: "strengths", label: "Strengths (comma-separated)", type: "tags" },
  { name: "growth_areas", label: "Growth areas (comma-separated)", type: "tags" },
  { name: "learning_interests", label: "Learning interests (comma-separated)", type: "tags" },
];

export function EditProfileButton({ label = "Edit persona" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  const { profile } = useProfile();
  const { user } = useAuth();
  const qc = useQueryClient();

  const save = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("profiles")
        .update(values as never)
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-[color:var(--card)]/60 px-4 py-2.5 text-sm font-medium backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-border-strong"
      >
        <Pencil className="h-3.5 w-3.5" /> {label}
      </button>
      <EditDialog
        open={open}
        onOpenChange={setOpen}
        title="Edit your persona"
        description="All changes save immediately to your account."
        fields={FIELDS}
        initial={profile as unknown as Record<string, unknown>}
        submitting={save.isPending}
        onSubmit={async (values) => {
          await save.mutateAsync(values);
        }}
      />
    </>
  );
}

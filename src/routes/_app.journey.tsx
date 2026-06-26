import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { GitBranch } from "lucide-react";

export const Route = createFileRoute("/_app/journey")({
  head: () => ({ meta: [{ title: "Journey · PersonaAI" }] }),
  component: () => (
    <PlaceholderPage
      icon={GitBranch}
      eyebrow="Journey"
      title="Every step, in context."
      description="A chronological map of your work — projects, milestones, and turning points."
    />
  ),
});

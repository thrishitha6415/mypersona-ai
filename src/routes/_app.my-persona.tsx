import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { UserCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/my-persona")({
  head: () => ({ meta: [{ title: "My Persona · PersonaAI" }] }),
  component: () => (
    <PlaceholderPage
      icon={UserCircle2}
      eyebrow="My Persona"
      title="The shape of who you are becoming."
      description="A living portrait built from your achievements, skills, and intent — refined as you grow."
    />
  ),
});

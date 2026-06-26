import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Compass } from "lucide-react";

export const Route = createFileRoute("/_app/compass")({
  head: () => ({ meta: [{ title: "Compass · PersonaAI" }] }),
  component: () => (
    <PlaceholderPage
      icon={Compass}
      eyebrow="Compass"
      title="Paths that match where you're heading."
      description="Curated roles, skills, and opportunities aligned to your trajectory."
    />
  ),
});

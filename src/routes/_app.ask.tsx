import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/ask")({
  head: () => ({ meta: [{ title: "Ask Persona · PersonaAI" }] }),
  component: () => (
    <PlaceholderPage
      icon={Sparkles}
      eyebrow="Ask Persona"
      title="A quiet companion for the next question."
      description="Reflect on your work, weigh decisions, and plan the next chapter — together."
    />
  ),
});

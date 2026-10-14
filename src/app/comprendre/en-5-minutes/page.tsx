import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/primitives";
import { Tour5Minutes } from "@/components/diagrams/Tour5Minutes";

export const metadata: Metadata = {
  title: "Comprendre Parcoursup en 5 minutes",
  description: "Six écrans animés pour comprendre Parcoursup : vœux, classement, ordre d'appel, propositions, réponses et listes d'attente.",
};

export default function CinqMinutes() {
  return (
    <>
      <PageHeader
        miettes={[{ href: "/comprendre/", label: "Comprendre" }, { href: "/comprendre/en-5-minutes/", label: "En 5 minutes" }]}
        eyebrow="Module 0"
        titre="Comprendre Parcoursup en 5 minutes"
        chapeau="Six écrans, une idée par écran. À la fin, vous saurez distinguer classement, ordre d'appel et proposition."
        niveau="Découverte"
        duree={5}
      />
      <Container className="py-12">
        <Tour5Minutes />
      </Container>
    </>
  );
}

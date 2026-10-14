import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout, Container } from "@/components/ui/primitives";
import { EtapesTimeline } from "@/components/diagrams/EtapesTimeline";
import { references } from "@/components/ui/References";

export const metadata: Metadata = {
  title: "Les étapes de Parcoursup, de la candidature à l'admission",
  description: "Inscription, vœux, confirmation, examen, ordre d'appel, phase principale, ordonnancement, GDD, phase complémentaire : la procédure complète.",
};

export default function Etapes() {
  const { R, Liste } = references(["presentation-2023", "arrete-calendrier-2023", "code-education"]);
  return (
    <>
      <PageHeader
        miettes={[{ href: "/comprendre/", label: "Comprendre" }, { href: "/comprendre/etapes/", label: "Les étapes" }]}
        eyebrow="Module 1"
        titre="De la candidature à l'admission"
        chapeau="Huit phases, trois acteurs principaux. Le badge indique qui agit à chaque étape, et où l'algorithme national intervient."
        niveau="Découverte"
        duree={7}
        verification="14 octobre 2026"
      />
      <Container size="md" className="py-14">
        <Callout type="info" titre="Pourquoi pas de dates ?" className="mb-12">
          Le calendrier est fixé chaque année par arrêté (pour la campagne 2023, par exemple, l'arrêté cité par la documentation officielle
          <R id="arrete-calendrier-2023" />). Pour éviter d'afficher des dates périmées, la frise présente l'enchaînement des phases ; consultez le calendrier
          officiel de l'année en cours sur parcoursup.gouv.fr.
        </Callout>
        <EtapesTimeline />
        <p className="mt-12 text-sm leading-relaxed text-muted">
          Description fondée sur la présentation officielle des algorithmes (sections 2 et 6)<R id="presentation-2023" /> et sur les articles du code de
          l'éducation qu'elle cite<R id="code-education" />.
        </p>
        <Liste className="mt-10" />
      </Container>
    </>
  );
}

import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout, Container } from "@/components/ui/primitives";
import { RepondeurDiagram } from "@/components/diagrams/RepondeurDiagram";
import { SectionNiveau } from "@/components/education/Niveau";
import { PseudoCode } from "@/components/education/PseudoCode";
import { Fidelite } from "@/components/education/Fidelite";
import { CodeLink } from "@/components/ui/CodeLink";
import { references } from "@/components/ui/References";
import { Terme } from "@/components/ui/Terme";

export const metadata: Metadata = {
  title: "Répondeur automatique Parcoursup et vœux ordonnés : comment ça marche",
  description: "Ordonnancement des vœux en attente, répondeur automatique et démissions automatiques pendant la phase de gestion des démissions, expliqués à partir des exemples officiels.",
};

export default function Repondeur() {
  const { R, Liste } = references(["presentation-2023", "code-miroir", "arrete-calendrier-2023"]);
  return (
    <>
      <PageHeader
        miettes={[{ href: "/algorithmes/", label: "Les algorithmes" }, { href: "/algorithmes/repondeur-automatique/", label: "Répondeur automatique" }]}
        eyebrow="Algorithme 4"
        titre="Vœux ordonnés et répondeur automatique"
        chapeau="En fin de procédure, les candidats qui gardent des vœux en attente les classent par préférence. Une nouvelle proposition supprime alors automatiquement les vœux moins bien classés."
        niveau="Approfondissement"
        duree={7}
        verification="14 octobre 2026"
      >
        <div className="mt-6">
          <Fidelite statut="conforme" />
        </div>
      </PageHeader>
      <Container size="md" className="space-y-16 py-12">
        <SectionNiveau niveau="Découverte" titre="L'essentiel" id="essentiel">
          <div className="prose-ps">
            <p>
              Pour conserver des vœux en attente à la fin de la phase principale et pendant la phase de gestion des démissions (<Terme id="gdd">GDD</Terme>), le
              candidat doit les <Terme id="ordonnancement">ordonner</Terme>, après avoir répondu à ses propositions pour n'en garder qu'une au plus
              <R id="presentation-2023" />
              <R id="arrete-calendrier-2023" />.
            </p>
            <ul>
              <li>
                <strong>Sans répondeur</strong> : une nouvelle proposition supprime les vœux en attente moins bien classés ; la proposition déjà acceptée est
                conservée tant que le candidat n'a pas choisi.
              </li>
              <li>
                <strong>Avec le <Terme id="repondeur">répondeur automatique</Terme></strong> (facultatif) : la nouvelle proposition est acceptée automatiquement ;
                l'ancienne proposition et les vœux moins bien classés sont supprimés.
              </li>
            </ul>
          </div>
        </SectionNiveau>
      </Container>
      <Container size="xl" className="py-4">
        <RepondeurDiagram />
      </Container>
      <Container size="md" className="space-y-16 py-12">
        <SectionNiveau niveau="Approfondissement" titre="Les garanties annoncées" id="garanties">
          <div className="prose-ps">
            <ol>
              <li>Avec le répondeur, un candidat a au plus une proposition, et elle est acceptée.</li>
              <li>Sans répondeur, un candidat ayant ordonné ses vœux a au plus deux propositions : une acceptée, une en attente de réponse.</li>
              <li>Un vœu n'est supprimé automatiquement que si le candidat a reçu une proposition mieux classée, ou n'a pas répondu dans les délais.</li>
              <li>Sans réponse aux nouvelles propositions, le candidat conserve la proposition acceptée initialement.</li>
            </ol>
            <p>
              Propriétés énoncées dans la section 6 de la présentation officielle<R id="presentation-2023" /> ; plusieurs sont contrôlées dans le code (vérifications
              « P7 » et « P8 »)<R id="code-miroir" />.
            </p>
          </div>
          <Callout type="info" titre="Des places libérées immédiatement" className="mt-6">
            Les démissions automatiques libèrent des places pendant le calcul lui-même : l'algorithme recommence alors le calcul des propositions dans la même
            journée, jusqu'à ce qu'aucune place ne soit plus libérée.
          </Callout>
        </SectionNiveau>
        <SectionNiveau niveau="Technique" titre="Pseudo-code et code source" id="code">
          <PseudoCode
            titre="RepondeurAutomatique.appliquerRepondeurAutomatique()"
            lignes={[
              "pour chaque candidat avec répondeur ayant au moins une proposition du jour :",
              "  meilleur ← plus petit rang de préférence parmi ses propositions du jour",
              "  pour chacun de ses vœux en attente ou proposés :",
              "    si proposé les jours précédents ou rang de préférence > meilleur alors",
              "      démissionner automatiquement   // la place est libérée",
              "retourner le nombre de places libérées",
            ]}
          />
          <div className="mt-6 grid gap-3">
            <CodeLink id="repondeur" />
            <CodeLink id="demissionGdd" />
          </div>
        </SectionNiveau>
        <Liste />
      </Container>
    </>
  );
}

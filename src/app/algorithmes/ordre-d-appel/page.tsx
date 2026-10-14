import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout, Container } from "@/components/ui/primitives";
import { OrdreAppelDiagram } from "@/components/diagrams/OrdreAppelDiagram";
import { SectionNiveau, Sommaire } from "@/components/education/Niveau";
import { PseudoCode } from "@/components/education/PseudoCode";
import { Fidelite } from "@/components/education/Fidelite";
import { CodeLink } from "@/components/ui/CodeLink";
import { references } from "@/components/ui/References";
import { Terme } from "@/components/ui/Terme";
import { EXEMPLE_BOURSIERS } from "@/components/diagrams/data/ordre-appel";

export const metadata: Metadata = {
  title: "Quelle différence entre rang de classement et rang d'appel ? L'algorithme de l'ordre d'appel",
  description: "Comment Parcoursup calcule l'ordre d'appel à partir du classement pédagogique et des taux de boursiers et de résidents : animation, règles, pseudo-code et code source officiel.",
};

export default function OrdreAppel() {
  const { R, Liste } = references(["presentation-2023", "code-miroir", "code-gitlab", "loi-ore"]);
  const ex = EXEMPLE_BOURSIERS;
  return (
    <>
      <PageHeader
        miettes={[{ href: "/algorithmes/", label: "Les algorithmes" }, { href: "/algorithmes/ordre-d-appel/", label: "Ordre d'appel" }]}
        eyebrow="Algorithme 1 · Module 4"
        titre="L'ordre d'appel"
        chapeau="Le classement de la formation devient l'ordre dans lequel les propositions sont envoyées. Il est calculé une seule fois, avant la phase d'admission."
        niveau="Approfondissement"
        duree={10}
        verification="14 octobre 2026"
      >
        <div className="mt-6">
          <Fidelite statut="conforme" />
        </div>
      </PageHeader>
      <Container size="md" className="py-12">
        <Sommaire items={[{ id: "essentiel", label: "L'essentiel" }, { id: "animation", label: "L'algorithme en action" }, { id: "regles", label: "Les règles exactes" }, { id: "proprietes", label: "Les garanties" }, { id: "code", label: "Pseudo-code et code source" }]} />
      </Container>
      <Container size="md" className="space-y-16 pb-10">
        <SectionNiveau niveau="Découverte" titre="L'essentiel" id="essentiel">
          <div className="prose-ps">
            <p>
              « Si les taux minimum boursiers et de résidents étaient de 0 %, l'ordre d'appel serait tout simplement l'ordre du classement pédagogique »
              <R id="presentation-2023" />. Dès qu'un taux s'applique, l'algorithme fait remonter juste assez de boursiers (ou de résidents) pour le respecter,
              place après place.
            </p>
            <p>
              Exemple officiel : avec un <Terme id="taux-boursiers">taux minimum de boursiers</Terme> de 25 %, le classement <code>C1 C2 B1 C3 C4 C5 B2 …</code>{" "}
              devient l'ordre d'appel <code>{ex.ordre.slice(0, 8).map((o) => ex.jetons[o.candidat - 1]!.label).join(" ")} …</code>
            </p>
          </div>
        </SectionNiveau>
      </Container>
      <Container size="xl" className="py-6" >
        <div id="animation" className="scroll-mt-24">
          <OrdreAppelDiagram exemple="boursiers-25" />
        </div>
      </Container>
      <Container size="md" className="space-y-16 py-10">
        <SectionNiveau niveau="Approfondissement" titre="Les règles exactes" id="regles">
          <div className="prose-ps">
            <p>
              Pour chaque place k, de la première à la dernière, l'algorithme regarde combien de boursiers (b) et de résidents (r) ont déjà été appelés.
            </p>
            <ul>
              <li>
                Le taux boursier est <strong>contraignant</strong> si appeler un non-boursier ferait passer la proportion sous qB : b × 100 &lt; qB × k, et qu'il
                reste des boursiers à appeler.
              </li>
              <li>Même règle pour le taux de résidents avec qR.</li>
              <li>Aucun taux contraignant : on prend le premier candidat restant du classement.</li>
              <li>Un seul taux contraignant : le premier candidat restant qui le satisfait.</li>
              <li>
                Les deux : le premier boursier résident ; s'il n'y en a plus, le premier boursier — <strong>le taux boursier prime</strong>
                <R id="loi-ore" />.
              </li>
            </ul>
            <p>
              Concrètement, le code répartit les candidats en <strong>quatre files</strong> (boursier du secteur, boursier hors secteur, non-boursier du secteur,
              non-boursier hors secteur), chacune triée par rang, et choisit à chaque étape parmi les têtes de file<R id="code-miroir" />.
            </p>
          </div>
          <Callout type="info" titre="Arrondi" className="mt-6">
            La condition b × 100 &lt; qB × k revient à arrondir le nombre minimal de boursiers à l'entier supérieur, comme l'indique la documentation officielle
            <R id="presentation-2023" />.
          </Callout>
        </SectionNiveau>
      </Container>
      <Container size="xl" className="py-6">
        <OrdreAppelDiagram exemple="deux-taux" />
      </Container>
      <Container size="md" className="space-y-16 py-10">
        <SectionNiveau niveau="Technique" titre="Les garanties" id="proprietes">
          <div className="prose-ps">
            <p>Après chaque calcul, le code officiel vérifie cinq propriétés ; un échec bloque le résultat<R id="code-miroir" />.</p>
          </div>
          <ol className="mt-5 space-y-3">
            {ex.proprietes.map((p) => (
              <li key={p.id} className="flex gap-4 rounded-2xl bg-surface p-4 ring-1 ring-line">
                <span className="font-mono text-lg font-semibold text-primary">{p.id}</span>
                <span className="text-ink-2">{p.enonce}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted">
            La documentation ajoute deux propriétés d'optimalité (minimisation des inversions au sens de Kendall-tau et maximalité lexicographique), énoncées mais
            non vérifiées par le code<R id="presentation-2023" />.
          </p>
        </SectionNiveau>
        <SectionNiveau niveau="Technique" titre="Pseudo-code et code source" id="code">
          <PseudoCode
            titre="GroupeClassement.calculerOrdreAppel()"
            lignes={[
              "trier les vœux par rang de classement",
              "répartir les vœux dans 4 files : (boursier ?, du secteur ?)",
              "b, r, k ← 0",
              "tant que tous les candidats ne sont pas appelés :",
              "  contrainteB ← il reste des boursiers et b × 100 < qB × (k + 1)",
              "  contrainteR ← il reste des résidents et r × 100 < qR × (k + 1)",
              "  éligibles ← têtes de file qui satisfont chaque contrainte active",
              "  si éligibles non vide alors choisi ← le mieux classé des éligibles",
              "  sinon choisi ← tête de la file « boursier hors secteur »  // le taux boursier prime",
              "  retirer choisi de sa file ; l'ajouter à l'ordre d'appel",
              "  k ← k + 1 ; mettre à jour b et r",
              "vérifier les propriétés P1 à P5",
            ]}
          />
          <div className="mt-6 grid gap-3">
            <CodeLink id="ordreAppelCalcul" />
            <CodeLink id="ordreAppelContraintes" />
            <CodeLink id="ordreAppelSelection" />
            <CodeLink id="verifOrdreAppel" />
          </div>
        </SectionNiveau>
        <Liste />
      </Container>
    </>
  );
}

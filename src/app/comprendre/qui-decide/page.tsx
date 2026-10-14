import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout, Container } from "@/components/ui/primitives";
import { QuiDecideDiagram } from "@/components/diagrams/QuiDecideDiagram";
import { SectionNiveau } from "@/components/education/Niveau";
import { CodeLink } from "@/components/ui/CodeLink";
import { references } from "@/components/ui/References";
import { Terme } from "@/components/ui/Terme";

export const metadata: Metadata = {
  title: "Qui décide des admissions Parcoursup ?",
  description: "Formation, commission d'examen, recteur, algorithme national, candidat : qui décide de quoi dans Parcoursup, ce qui est public et ce qui ne l'est pas.",
};

export default function QuiDecide() {
  const { R, Liste } = references(["presentation-2023", "code-miroir", "loi-ore", "code-education", "next-algos-locaux"]);
  return (
    <>
      <PageHeader
        miettes={[{ href: "/comprendre/", label: "Comprendre" }, { href: "/comprendre/qui-decide/", label: "Qui décide ?" }]}
        eyebrow="Module 2"
        titre="Qui décide réellement de votre admission ?"
        chapeau="Parcoursup n'est pas un algorithme unique qui choisirait à la place des formations. C'est une chaîne de décisions, prises par des acteurs différents."
        niveau="Découverte"
        duree={8}
        verification="14 octobre 2026"
      />
      <Container size="xl" className="py-12">
        <QuiDecideDiagram />
      </Container>
      <Container size="md" className="space-y-16 pb-10">
        <SectionNiveau niveau="Découverte" titre="En une phrase" id="resume">
          <div className="prose-ps">
            <p>
              <strong>La formation classe, la loi fixe des taux, l'algorithme national applique ces taux puis envoie les propositions, et le candidat
              répond.</strong> L'algorithme national n'évalue jamais un dossier : il reçoit un classement déjà établi par la commission d'examen de chaque
              formation<R id="presentation-2023" />.
            </p>
          </div>
        </SectionNiveau>
        <SectionNiveau niveau="Approfondissement" titre="Classement pédagogique et ordre d'appel : deux choses différentes" id="deux-classements">
          <div className="prose-ps">
            <p>
              Le <Terme id="classement-pedagogique">classement pédagogique</Terme> est établi par la commission d'examen des vœux de la formation, selon ses
              critères. L'<Terme id="ordre-appel">ordre d'appel</Terme> est calculé ensuite, une seule fois, par l'algorithme national : il part du classement et
              fait remonter des candidats boursiers et, pour certaines formations non sélectives, des candidats résidents de l'académie, afin de respecter les
              taux fixés par le recteur<R id="presentation-2023" />
              <R id="code-education" />.
            </p>
            <p>
              Sans taux applicable, les deux sont identiques. Avec un taux, un candidat peut avoir un rang d'appel meilleur ou moins bon que son rang de
              classement ; les écarts possibles sont bornés par des propriétés que le code vérifie après chaque calcul<R id="code-miroir" />.
            </p>
          </div>
          <CodeLink id="ordreAppelCalcul" className="mt-6" />
        </SectionNiveau>
        <SectionNiveau niveau="Approfondissement" titre="Ce que l'algorithme national ne fait pas" id="ne-fait-pas">
          <div className="prose-ps">
            <ul>
              <li>Il ne lit pas les dossiers, les notes ou les lettres de motivation.</li>
              <li>Il ne choisit pas les critères d'examen ni leur pondération.</li>
              <li>Il ne fixe pas les capacités d'accueil, ni les taux de boursiers ou de résidents : ce sont des paramètres d'entrée.</li>
              <li>Pendant la phase principale, il ne connaît pas vos préférences entre vos vœux (ils ne sont pas hiérarchisés).</li>
            </ul>
          </div>
          <Callout type="inconnu" titre="La zone moins visible : les outils locaux" className="mt-6">
            Certaines commissions peuvent s'appuyer sur des outils d'aide à la décision pour préparer leur classement. Ces traitements ne font pas partie du code
            national publié ; leur publication a fait l'objet de débats et de contentieux<R id="next-algos-locaux" />. Nous les traitons dans la page
            Transparence, sans affirmer quelles formations les utilisent ni comment.
          </Callout>
        </SectionNiveau>
        <Liste />
      </Container>
    </>
  );
}

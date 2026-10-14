import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout, Container } from "@/components/ui/primitives";
import { OrdreAppelDiagram } from "@/components/diagrams/OrdreAppelDiagram";
import { SectionNiveau, Sommaire } from "@/components/education/Niveau";
import { CodeLink } from "@/components/ui/CodeLink";
import { references } from "@/components/ui/References";
import { Terme } from "@/components/ui/Terme";

export const metadata: Metadata = {
  title: "Comment fonctionne le quota boursier sur Parcoursup ?",
  description: "Taux minimum de boursiers, taux de non-résidents, priorité en cas de conflit, bacheliers professionnels et technologiques : les quotas de Parcoursup expliqués et animés.",
};

const TABLE = [
  ["Taux minimum de boursiers", "Formations sélectives et formations non sélectives dont les candidatures excèdent la capacité", "Recteur de région académique", "Ordre d'appel (algorithme national)"],
  ["Taux maximum de non-résidents (« taux résidents »)", "Formations non sélectives dont les candidatures excèdent la capacité", "Recteur de région académique", "Ordre d'appel (algorithme national)"],
  ["Taux minimal de bacheliers professionnels", "Sections de techniciens supérieurs (BTS)", "Recteur", "Groupes de classement distincts et leurs capacités"],
  ["Taux minimal de bacheliers technologiques", "Instituts universitaires de technologie (BUT)", "Recteur", "Groupes de classement distincts et leurs capacités"],
];

export default function Quotas() {
  const { R, Liste } = references(["presentation-2023", "loi-ore", "code-education", "dgesip-examen-voeux", "code-miroir"]);
  return (
    <>
      <PageHeader
        miettes={[{ href: "/comprendre/", label: "Comprendre" }, { href: "/comprendre/quotas-et-priorites/", label: "Quotas et priorités" }]}
        eyebrow="Module 5"
        titre="À quoi servent les quotas ?"
        chapeau="Des taux fixés par le recteur garantissent une part minimale de boursiers et, pour certaines formations, de candidats de l'académie. Ils agissent sur l'ordre d'appel, pas sur le classement."
        niveau="Approfondissement"
        duree={8}
        verification="14 octobre 2026"
      />
      <Container size="md" className="py-12">
        <Sommaire items={[{ id: "principe", label: "Le principe" }, { id: "quels-taux", label: "Quels taux, pour quelles formations" }, { id: "conflit", label: "Quand les deux taux entrent en conflit" }, { id: "limites", label: "Ce que les taux garantissent, et ce qu'ils ne garantissent pas" }]} />
      </Container>
      <Container size="md" className="space-y-16 pb-10">
        <SectionNiveau niveau="Découverte" titre="Le principe" id="principe">
          <div className="prose-ps">
            <p>
              Si une formation a un <Terme id="taux-boursiers">taux minimum de boursiers</Terme> de 20 %, l'algorithme s'assure qu'à chaque instant, au moins
              20 % des candidats appelés sont boursiers — tant qu'il reste des boursiers à appeler. Pour cela, il fait remonter le premier boursier disponible
              dès que la proportion passerait sous le seuil<R id="presentation-2023" />.
            </p>
            <p>Personne n'est retiré du classement : seul l'ordre change. Et un boursier n'est jamais appelé après un candidat qu'il précède dans le classement.</p>
          </div>
        </SectionNiveau>
        <SectionNiveau niveau="Approfondissement" titre="Quels taux, pour quelles formations" id="quels-taux">
          <div tabIndex={0} role="region" aria-label="Tableau des taux (défilable)" className="overflow-x-auto rounded-2xl ring-1 ring-line">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">Taux applicables selon les formations</caption>
              <thead className="bg-surface-2 text-ink">
                <tr>
                  {["Taux", "Formations concernées", "Fixé par", "Mis en œuvre par"].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface text-ink-2">
                {TABLE.map((l) => (
                  <tr key={l[0]}>
                    {l.map((c, i) => (
                      <td key={i} className={i === 0 ? "px-4 py-3 font-medium text-ink" : "px-4 py-3"}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted">
            D'après la section 2.2 de la présentation officielle<R id="presentation-2023" />, qui renvoie à l'article L. 612-3 du code de l'éducation
            <R id="code-education" />. Tout ou partie des taux peut ne pas s'appliquer dans certaines hypothèses exceptionnelles (fiche de cadrage annuelle
            <R id="dgesip-examen-voeux" />).
          </p>
          <Callout type="attention" titre="Les quotas ne sont pas les mêmes partout" className="mt-6">
            Chaque formation a ses propres taux, fixés localement. Une formation peut n'avoir aucun taux de résidents (c'est le cas des formations sélectives) et
            un taux de boursiers différent de sa voisine. Il faut donc toujours regarder la fiche de la formation concernée.
          </Callout>
        </SectionNiveau>
        <SectionNiveau niveau="Approfondissement" titre="Quand les deux taux entrent en conflit" id="conflit">
          <div className="prose-ps">
            <p>
              Le taux maximum de non-résidents est traduit dans l'algorithme en <Terme id="taux-secteur">taux minimum de candidats du secteur</Terme>. Quand les
              deux taux sont contraignants à la fois, l'algorithme cherche un candidat à la fois boursier et du secteur. S'il n'en reste aucun, il choisit un
              boursier hors secteur : <strong>le taux boursier prime</strong>, comme le prévoit la loi du 8 mars 2018<R id="presentation-2023" />
              <R id="loi-ore" />. Regardez les places 6 et 11 dans l'animation ci-dessous.
            </p>
          </div>
        </SectionNiveau>
      </Container>
      <Container size="xl" className="py-8">
        <OrdreAppelDiagram exemple="deux-taux" />
      </Container>
      <Container size="md" className="space-y-16 pb-10 pt-8">
        <SectionNiveau niveau="Technique" titre="Ce que les taux garantissent, et ce qu'ils ne garantissent pas" id="limites">
          <div className="prose-ps">
            <p>
              Le code vérifie après chaque calcul des propriétés précises<R id="code-miroir" /> : par exemple, un candidat non boursier du secteur de rang r ne
              peut être doublé que par des boursiers, et son rang d'appel reste inférieur ou égal à 1 + ⌊(1 + qB/(100 − qB)) × r⌋. Avec qB = 20 % et r = 40,
              il sera au pire 51e.
            </p>
            <p>
              En revanche, l'algorithme garantit un taux de boursiers <strong>appelés</strong>, pas un taux de boursiers <strong>admis</strong> : chaque candidat
              reste libre de refuser une proposition<R id="presentation-2023" />.
            </p>
          </div>
          <CodeLink id="verifOrdreAppel" className="mt-6" />
        </SectionNiveau>
        <Liste />
      </Container>
    </>
  );
}

import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout, Container } from "@/components/ui/primitives";
import { CommissionDiagram } from "@/components/diagrams/CommissionDiagram";
import { SectionNiveau } from "@/components/education/Niveau";
import { references } from "@/components/ui/References";
import { Terme } from "@/components/ui/Terme";

export const metadata: Metadata = {
  title: "Comment sont examinés les dossiers Parcoursup ?",
  description: "Le rôle des commissions d'examen des vœux, les critères des formations, les classements par groupes et ce qui n'est pas public dans l'examen des dossiers.",
};

export default function Examen() {
  const { R, Liste } = references(["presentation-2023", "code-education", "parcoursup-site", "next-algos-locaux", "cc-2020-834"]);
  return (
    <>
      <PageHeader
        miettes={[{ href: "/comprendre/", label: "Comprendre" }, { href: "/comprendre/examen-des-dossiers/", label: "Examen des dossiers" }]}
        eyebrow="Module 3"
        titre="Comment les dossiers sont-ils examinés ?"
        chapeau="C'est l'étape la plus humaine — et la moins documentée publiquement. Elle se déroule dans chaque formation, pas dans l'algorithme national."
        niveau="Approfondissement"
        duree={6}
        verification="14 octobre 2026"
      />
      <Container size="xl" className="py-12">
        <CommissionDiagram />
      </Container>
      <Container size="md" className="space-y-16 pb-10">
        <SectionNiveau niveau="Découverte" titre="Une commission par formation" id="commission">
          <div className="prose-ps">
            <p>
              Pour chaque formation, une <Terme id="commission">commission d'examen des vœux</Terme>, constituée par le chef d'établissement, examine les vœux et
              détermine le classement pédagogique « à partir des éléments explicités sur la plateforme au moment de l'inscription des candidats, et en
              particulier sur la base des critères d'examen des vœux qu'elle définit »<R id="presentation-2023" />.
            </p>
            <p>
              Dans les formations sélectives, la commission peut établir des classements distincts par groupes de candidats : en BTS, par exemple, un groupe
              pour les bacheliers professionnels, éventuellement un pour les technologiques, et un pour les autres. Plusieurs formations peuvent aussi mutualiser
              un même classement (groupements d'écoles d'ingénieurs, instituts de formation en soins infirmiers…)<R id="presentation-2023" />.
            </p>
          </div>
        </SectionNiveau>
        <SectionNiveau niveau="Approfondissement" titre="Que contient un dossier ?" id="dossier">
          <Callout type="inconnu" titre="Liste à vérifier sur la source officielle">
            Les documents étudiés pour ce site (code et présentation des algorithmes) ne détaillent pas le contenu du dossier. Les éléments habituellement
            mentionnés — notes et bulletins, appréciations des enseignants, fiche Avenir, projet de formation motivé, activités et centres d'intérêt — doivent
            être vérifiés sur parcoursup.gouv.fr<R id="parcoursup-site" />, qui seul fait foi, et peuvent varier selon la formation et l'année.
          </Callout>
          <div className="prose-ps mt-6">
            <p>
              Ce qui est établi : la formation définit ses critères et les rend visibles sur la plateforme ; la commission classe ; les formations non
              sélectives peuvent, dans certaines conditions, ne pas ordonner les candidatures (article D. 612-1-13 du code de l'éducation cité par la
              documentation)<R id="code-education" />.
            </p>
          </div>
        </SectionNiveau>
        <SectionNiveau niveau="Approfondissement" titre="Ce qui n'est pas public" id="non-public">
          <div className="prose-ps">
            <ul>
              <li>Les pondérations exactes entre les critères, propres à chaque formation.</li>
              <li>Les éventuels outils locaux d'aide à la décision (tableurs, scores) : ils ne font pas partie du code national publié.</li>
              <li>Les classements individuels, qui sont des données personnelles.</li>
            </ul>
            <p>
              La question de la communication de ces traitements locaux a été portée devant les juridictions, notamment le Conseil constitutionnel
              <R id="cc-2020-834" /> ; nous ne résumons pas ces décisions faute de les avoir consultées dans le cadre de cette étude. Voir aussi la presse
              spécialisée<R id="next-algos-locaux" />.
            </p>
          </div>
          <Callout type="attention" titre="Pourquoi nous ne proposons pas de « simulateur de commission »" className="mt-6">
            Reproduire une commission supposerait de connaître ses critères et ses pondérations, qui ne sont pas publiés. Tout outil de ce type serait une
            fiction : nous préférons ne pas en proposer, pour ne pas laisser croire qu'il prédit un classement réel.
          </Callout>
        </SectionNiveau>
        <Liste />
      </Container>
    </>
  );
}

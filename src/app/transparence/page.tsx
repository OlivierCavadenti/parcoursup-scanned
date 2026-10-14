import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout, Container } from "@/components/ui/primitives";
import { TransparenceMap } from "@/components/diagrams/TransparenceMap";
import { SectionNiveau } from "@/components/education/Niveau";
import { references } from "@/components/ui/References";

export const metadata: Metadata = {
  title: "Le code source de Parcoursup est-il public ? Transparence et controverses",
  description: "Ce qui est public, partiellement documenté ou inaccessible dans Parcoursup : code national, algorithmes locaux, critères, statistiques. Une analyse sourcée et neutre.",
};

export default function Transparence() {
  const { R, Liste } = references([
    "code-gitlab",
    "code-miroir",
    "presentation-2023",
    "loi-ore",
    "cesp",
    "next-algos-locaux",
    "cc-2020-834",
    "next-vulnerabilites",
    "data-parcoursup",
    "why3-parcoursup",
  ]);
  return (
    <>
      <PageHeader
        miettes={[{ href: "/transparence/", label: "Transparence" }]}
        eyebrow="Transparence et controverses"
        titre="Ce qui est public, et ce qui ne l'est pas"
        chapeau="Parcoursup n'est ni une boîte noire ni un système entièrement ouvert. Cliquez sur chaque élément pour comprendre pourquoi il est classé dans sa zone."
        niveau="Approfondissement"
        duree={9}
        verification="14 octobre 2026"
      />
      <Container size="xl" className="py-12">
        <TransparenceMap />
      </Container>
      <Container size="md" className="space-y-16 pb-10">
        <SectionNiveau niveau="Découverte" titre="Le code national : publié, exécutable, vérifiable" id="code-national">
          <div className="prose-ps">
            <p>
              Comme le prévoit la loi du 8 mars 2018, le ministère a rendu public le code du cœur algorithmique, « utilisé pour déterminer quotidiennement les
              propositions d'admission »<R id="presentation-2023" />
              <R id="loi-ore" />. Il est publié sous licence AGPL-3.0 sur une forge publique<R id="code-gitlab" />. Ce site en est la démonstration : nous
              l'avons compilé et nos schémas en reproduisent exactement les résultats (<Link href="/algorithmes/conformite/">méthode</Link>).
            </p>
            <p>
              D'autres travaux s'y sont intéressés, par exemple un projet de vérification formelle hébergé par l'Inria, que nous n'avons pas consulté
              <R id="why3-parcoursup" />.
            </p>
          </div>
        </SectionNiveau>
        <SectionNiveau niveau="Approfondissement" titre="Les traitements locaux : le principal angle mort" id="local">
          <div className="prose-ps">
            <p>
              Le code publié commence là où le classement de la formation est déjà fait. La manière dont chaque commission construit ce classement — critères,
              pondérations, outils éventuels — relève de l'établissement. La publication de ces traitements locaux a donné lieu à des débats publics et à des
              contentieux, jusqu'au Conseil constitutionnel<R id="cc-2020-834" />
              <R id="next-algos-locaux" />.
            </p>
            <p>
              Nous signalons ces décisions sans en résumer la portée : nous ne les avons pas analysées en détail dans le cadre de cette étude, et préférons ne pas
              en proposer une interprétation approximative.
            </p>
          </div>
        </SectionNiveau>
        <SectionNiveau niveau="Approfondissement" titre="Le reste de la plateforme" id="plateforme">
          <div className="prose-ps">
            <p>
              Seul le cœur algorithmique est publié, pas l'ensemble du code de la plateforme (interfaces, gestion des délais, base de données). Selon un article
              de presse, une demande de communication de l'intégralité du code a été rejetée par le juge administratif<R id="next-vulnerabilites" /> ; nous n'avons
              pas consulté la décision.
            </p>
          </div>
        </SectionNiveau>
        <SectionNiveau niveau="Approfondissement" titre="Lire les statistiques avec prudence" id="statistiques">
          <div className="prose-ps">
            <p>
              Les jeux de données publics<R id="data-parcoursup" /> décrivent des formations, pas des parcours individuels. Ils permettent d'observer des écarts
              (par exemple entre profils de candidats ou entre territoires), mais <strong>une corrélation statistique ne démontre pas une discrimination</strong> :
              les écarts peuvent tenir à la composition des candidatures, aux vœux formulés, aux capacités ou aux taux applicables.
            </p>
          </div>
          <Callout type="info" titre="Un contrôle institutionnel existe" className="mt-6">
            La loi a institué un comité éthique et scientifique de Parcoursup, qui publie un rapport annuel au Parlement et formule des recommandations sur la
            transparence de la procédure<R id="cesp" />
            <R id="presentation-2023" />.
          </Callout>
        </SectionNiveau>
        <Callout type="attention" titre="Notre position">
          Nous décrivons ce qui est vérifiable, sans posture militante ni institutionnelle. Si vous repérez une erreur ou une source plus récente, le dépôt du
          projet est ouvert aux contributions.
        </Callout>
        <Liste />
      </Container>
    </>
  );
}

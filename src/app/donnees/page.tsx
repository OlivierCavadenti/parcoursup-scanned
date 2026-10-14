import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout, Container } from "@/components/ui/primitives";
import { Explorateur } from "@/components/data/Explorateur";
import { references } from "@/components/ui/References";
import { Terme } from "@/components/ui/Terme";

export const metadata: Metadata = {
  title: "Explorer les données Parcoursup par formation",
  description: "Candidatures, propositions, admis, taux d'accès, profil des admis : explorez les statistiques publiques de Parcoursup par formation, avec leurs définitions et leurs limites.",
};

export default function Donnees() {
  const { R, Liste } = references(["data-parcoursup", "methodo-2020", "data-cartographie"]);
  return (
    <>
      <PageHeader
        miettes={[{ href: "/donnees/", label: "Les données" }]}
        eyebrow="Données ouvertes"
        titre="Les chiffres des formations"
        chapeau={
          <>
            Le ministère publie chaque année des statistiques par formation<R id="data-parcoursup" />. Cet explorateur les présente avec leurs définitions
            officielles, l'année concernée, et sans jamais les transformer en probabilité d'admission.
          </>
        }
        niveau="Approfondissement"
      />
      <Container size="xl" className="py-10">
        <Explorateur />
      </Container>
      <Container size="md" className="space-y-6 pb-10">
        <Callout type="attention" titre="Lire ces chiffres avec prudence">
          Le <Terme id="taux-acces">taux d'accès</Terme> décrit une formation, pas vos chances. Les définitions des indicateurs peuvent changer d'un millésime à
          l'autre (note méthodologique 2020, par exemple<R id="methodo-2020" />) : l'explorateur affiche la définition publiée avec chaque indicateur et ne
          compare que des valeurs d'une même session.
        </Callout>
        <Callout type="info" titre="D'où viennent les données ?">
          Elles sont téléchargées depuis le portail data.enseignementsup-recherche.gouv.fr au moment de la mise en ligne du site, validées puis converties en
          fichiers statiques : votre navigateur n'interroge jamais l'API publique. Les colonnes absentes d'un millésime apparaissent comme « non publié ». Un autre
          jeu, la cartographie des formations<R id="data-cartographie" />, n'est pas encore intégré.
        </Callout>
        <Liste />
      </Container>
    </>
  );
}

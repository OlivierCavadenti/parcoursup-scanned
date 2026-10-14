import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout, Container } from "@/components/ui/primitives";
import { SITE } from "@/lib/site";
import { OFFICIAL_REPO_GITLAB, REFERENCE_COMMIT, REFERENCE_VERSION, DATE_ETUDE } from "@/content/sources";

export const metadata: Metadata = {
  title: "À propos : un observatoire citoyen indépendant",
  description: "Qui sommes-nous, notre méthode, nos limites, la licence du projet et nos engagements : aucune collecte de données, aucune prédiction d'admission.",
};

export default function APropos() {
  return (
    <>
      <PageHeader miettes={[{ href: "/a-propos/", label: "À propos" }]} eyebrow="À propos" titre="Un observatoire citoyen, indépendant et ouvert" chapeau="Parcoursup Décrypté explique les mécanismes de la plateforme à partir de sources publiques vérifiables. Il n'est affilié à aucune institution." />
      <Container size="md" className="py-12">
        <div className="prose-ps">
          <h2>Indépendance</h2>
          <p>
            Ce site n'est affilié ni au ministère de l'Enseignement supérieur, ni à la plateforme Parcoursup, ni à un établissement. Il ne remplace pas les
            informations officielles : pour vos démarches, seul <a href="https://www.parcoursup.gouv.fr/">parcoursup.gouv.fr</a> fait foi.
          </p>
          <h2>Méthode</h2>
          <ul>
            <li>Chaque affirmation importante est reliée à une source datée, avec un statut de vérification honnête.</li>
            <li>
              Les schémas animés des algorithmes sont calculés par une réécriture du code officiel (version {REFERENCE_VERSION}, commit{" "}
              <code>{REFERENCE_COMMIT.slice(0, 7)}</code>), vérifiée contre le code Java officiel (<Link href="/algorithmes/conformite/">méthode</Link>).
            </li>
            <li>Les exemples sont fictifs. Ils expliquent des mécanismes ; ils ne prédisent aucune admission réelle.</li>
            <li>Ce qui n'est pas vérifiable est présenté comme tel, plutôt que comblé par des suppositions.</li>
            <li>Étude documentaire réalisée le {new Date(DATE_ETUDE).toLocaleDateString("fr-FR")}.</li>
          </ul>
          <h2>Vos données</h2>
          <p>
            Aucun compte, aucun cookie de suivi, aucune mesure d'audience, aucune collecte. Ne saisissez jamais vos identifiants Parcoursup ni vos données
            scolaires sur un site tiers. Seule votre préférence de thème (clair ou sombre) est conservée dans votre navigateur.
          </p>
          <h2>Licence et code</h2>
          <p>
            Le code de ce site est publié sous licence AGPL-3.0, la même que celle du <a href={OFFICIAL_REPO_GITLAB}>code officiel</a> dont il adapte les
            algorithmes. Sources, tests et documentation de recherche : <a href={SITE.depot}>dépôt du projet</a>.
          </p>
          <h2>Accessibilité</h2>
          <p>
            Objectif : WCAG 2.2 niveau AA. Navigation complète au clavier, textes alternatifs pour chaque schéma, respect de la préférence « réduire les
            animations », mode sombre. Les animations peuvent être mises en pause et parcourues étape par étape.
          </p>
        </div>
        <Callout type="attention" titre="Limites connues" className="mt-10">
          La version de référence du code date de juin 2024 ; certains documents officiels n'ont pas pu être consultés directement. La liste complète est
          tenue à jour dans le fichier LIMITATIONS.md du dépôt.
        </Callout>
      </Container>
    </>
  );
}

import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout, Container } from "@/components/ui/primitives";
import { PropositionsDiagram } from "@/components/diagrams/PropositionsDiagram";
import { SectionNiveau } from "@/components/education/Niveau";
import { PseudoCode } from "@/components/education/PseudoCode";
import { Fidelite } from "@/components/education/Fidelite";
import { CodeLink } from "@/components/ui/CodeLink";
import { references } from "@/components/ui/References";
import { Terme } from "@/components/ui/Terme";

export const metadata: Metadata = {
  title: "Pourquoi Parcoursup ne me propose pas de place ? Le calcul des propositions",
  description: "Comment Parcoursup calcule chaque jour les propositions d'admission : places vacantes, taux d'appel, rang limite, vœux avec internat, répondeur automatique. Animation et code source.",
};

export default function Propositions() {
  const { R, Liste } = references(["presentation-2023", "code-miroir", "code-gitlab"]);
  return (
    <>
      <PageHeader
        miettes={[{ href: "/algorithmes/", label: "Les algorithmes" }, { href: "/algorithmes/propositions/", label: "Propositions" }]}
        eyebrow="Algorithme 2"
        titre="Le calcul quotidien des propositions"
        chapeau="Chaque jour, pour chaque formation et chaque groupe, l'algorithme descend dans l'ordre d'appel et envoie des propositions tant qu'il reste des places."
        niveau="Approfondissement"
        duree={8}
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
              Places à pourvoir = nombre de recrutements souhaité − candidats ayant déjà une proposition (en attente de réponse ou acceptée). L'algorithme parcourt
              ensuite les vœux en attente dans l'ordre d'appel et fait une proposition à chacun, jusqu'à épuisement de ces places<R id="presentation-2023" />.
            </p>
            <p>
              Le « nombre de recrutements souhaité » peut dépasser la capacité : c'est le <Terme id="taux-appel">taux d'appel supplémentaire</Terme>, qui anticipe
              les refus. Une formation peut aussi fixer un <Terme id="rang-limite">rang limite d'appel</Terme> : tous les candidats jusqu'à ce rang reçoivent une
              proposition.
            </p>
          </div>
        </SectionNiveau>
      </Container>
      <Container size="xl" className="py-4">
        <PropositionsDiagram />
      </Container>
      <Container size="md" className="space-y-16 py-12">
        <SectionNiveau niveau="Approfondissement" titre="Les quatre raisons de proposer" id="raisons">
          <div className="prose-ps">
            <p>Dans le code, un vœu en attente reçoit une proposition si l'une de ces conditions est vraie<R id="code-miroir" /> :</p>
            <ol>
              <li>il reste des places à pourvoir ;</li>
              <li>son rang d'appel est inférieur ou égal au rang limite fixé par la formation ;</li>
              <li>le candidat a déjà une proposition pour cette formation (cas d'un vœu avec internat qui suit un vœu sans internat) ;</li>
              <li>c'est le même candidat que le vœu précédent (vœux avec et sans internat consécutifs) : une seule place est décomptée.</li>
            </ol>
            <p>
              Un vœu avec internat est en revanche <strong>sauté</strong> si le rang du candidat au classement internat dépasse la barre de l'internat ; il ne
              consomme alors aucune place.
            </p>
          </div>
        </SectionNiveau>
        <SectionNiveau niveau="Technique" titre="La boucle complète" id="boucle">
          <PseudoCode
            titre="AlgoPropositions.calcule()"
            lignes={[
              "répéter",
              "  préparer les groupes : vœux en attente, candidats déjà affectés",
              "  vérifier l'intégrité des données",
              "  pour chaque internat : barre ← position maximale d'admission",
              "  répéter",
              "    pour chaque groupe à mettre à jour : descendre dans l'ordre d'appel",
              "    pour chaque internat en surcapacité : abaisser la barre",
              "  jusqu'à ce qu'aucune barre ne change",
              "  si jour ≥ début de la GDD alors démissions automatiques des vœux ordonnés",
              "  appliquer le répondeur automatique",
              "jusqu'à ce qu'aucune place ne soit libérée",
            ]}
          />
          <Callout type="info" titre="Un résultat indépendant de l'ordre de traitement" className="mt-6">
            Les commentaires du code expliquent pourquoi le résultat ne dépend pas de l'ordre dans lequel on parcourt formations et internats : les barres ne font
            que descendre et convergent vers la même valeur maximale compatible avec les capacités<R id="code-miroir" />.
          </Callout>
          <div className="mt-6 grid gap-3">
            <CodeLink id="propositionsCalcule" />
            <CodeLink id="groupeAppel" />
            <CodeLink id="placesVacantes" />
            <CodeLink id="statuts" />
          </div>
        </SectionNiveau>
        <Liste />
      </Container>
    </>
  );
}

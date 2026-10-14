import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout, Container } from "@/components/ui/primitives";
import { SectionNiveau } from "@/components/education/Niveau";
import { Fidelite } from "@/components/education/Fidelite";
import { references } from "@/components/ui/References";
import { OFFICIAL_REPO_MIRROR, REFERENCE_COMMIT, REFERENCE_VERSION } from "@/content/sources";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Méthode de vérification : notre implémentation face au code officiel",
  description: "Comment nous avons vérifié que nos schémas reproduisent exactement les algorithmes de Parcoursup : compilation du code Java officiel, 730 cas comparés, tests de mutation.",
};

const MATRICE = [
  ["Ordre d'appel (taux boursiers seul)", "GroupeClassement l. 139-227 · présentation §4.1", "300 cas différentiels, exemple 25 %, ExempleA1 à A3", "conforme"],
  ["Ordre d'appel (deux taux)", "GroupeClassement l. 70-136 · §4.2-4.3", "idem + exemple 20 % / 90 %, ExempleA5", "conforme"],
  ["Propriétés P1 à P5", "VerificationsResultatsAlgoOrdreAppel", "vérifiées sur chaque cas", "conforme"],
  ["Propositions, rang limite", "GroupeAffectation l. 229-274", "430 journées différentielles", "conforme"],
  ["Barres d'admission internat", "GroupeInternat l. 195-223 et 288-335 · annexe A", "idem + exemple de l'annexe A", "conforme"],
  ["Répondeur automatique", "RepondeurAutomatique l. 82-132 · §6", "idem + exemple §6.1", "conforme"],
  ["Démissions automatiques (GDD)", "DemissionAutoVoeuxOrdonnes l. 79-119", "idem", "conforme"],
  ["Rang affiché sur liste d'attente", "AlgosAffichages l. 94-159", "non comparé (illustration simplifiée)", "simplification"],
  ["Réponses des candidats dans les schémas", "aucune (choix fictifs)", "—", "simplification"],
] as const;

export default function Conformite() {
  const { R, Liste } = references(["code-miroir", "code-gitlab", "presentation-2023"]);
  return (
    <>
      <PageHeader
        miettes={[{ href: "/algorithmes/", label: "Les algorithmes" }, { href: "/algorithmes/conformite/", label: "Méthode de vérification" }]}
        eyebrow="Méthodologie"
        titre="Comment nous vérifions que nos schémas disent vrai"
        chapeau="Nous ne disons « conforme » qu'avec une preuve : le code officiel, exécuté sur les mêmes entrées que notre implémentation, doit donner exactement le même résultat."
        niveau="Technique"
        duree={6}
        verification="14 octobre 2026"
      />
      <Container size="md" className="space-y-16 py-12">
        <SectionNiveau niveau="Technique" titre="La version de référence" id="version">
          <div className="prose-ps">
            <p>
              Version <code>{REFERENCE_VERSION}</code>, commit <code>{REFERENCE_COMMIT}</code> du dépôt officiel, obtenu via son miroir public
              <R id="code-miroir" /> (le dépôt GitLab<R id="code-gitlab" /> n'était pas joignable depuis notre environnement). Licence AGPL-3.0 : notre portage est
              publié sous la même licence.
            </p>
          </div>
        </SectionNiveau>
        <SectionNiveau niveau="Technique" titre="La comparaison différentielle" id="differentiel">
          <ol className="space-y-4">
            {[
              ["Compiler le code officiel", "Le dépôt est compilé avec Maven (Java 21), sans modification."],
              ["Générer des situations", "Un harnais Java crée, avec une graine fixe, 300 groupes de classement aléatoires et 80 campagnes fictives de plusieurs jours (internats communs ou non, rangs limites, arrêts d'admission, répondeur, GDD) : 430 journées."],
              ["Exécuter le code officiel", "Chaque situation passe par les classes officielles AlgoOrdreAppel et AlgoPropositions, avec leurs vérifications internes activées."],
              ["Comparer", "Notre implémentation TypeScript reçoit les mêmes entrées ; chaque statut de vœu, chaque barre internat et chaque estimation doivent être identiques."],
              ["Vérifier les tests eux-mêmes", "Nous introduisons volontairement des erreurs (une comparaison stricte au lieu de large, une barre décalée) : les tests échouent, preuve qu'ils détectent les écarts."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4 rounded-2xl bg-surface p-5 ring-1 ring-line">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary font-semibold text-on-primary">{i + 1}</span>
                <div>
                  <p className="font-semibold text-ink">{t}</p>
                  <p className="mt-1 text-ink-2">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <Callout type="fait" titre="Résultat" className="mt-6">
            730 cas sur 730 identiques, plus les exemples chiffrés de la documentation officielle<R id="presentation-2023" /> reproduits à l'identique. Les
            fichiers de référence, le harnais et les tests sont dans <a className="underline" href={SITE.depot}>le dépôt de ce site</a>.
          </Callout>
        </SectionNiveau>
        <SectionNiveau niveau="Technique" titre="Matrice de vérification" id="matrice">
          <div tabIndex={0} role="region" aria-label="Matrice de vérification (défilable)" className="overflow-x-auto rounded-2xl ring-1 ring-line">
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">Correspondance entre fonctionnalités, sources, tests et niveau de fidélité</caption>
              <thead className="bg-surface-2 text-ink">
                <tr>
                  {["Fonctionnalité", "Source", "Tests", "Fidélité"].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface text-ink-2">
                {MATRICE.map(([f, s, t, st]) => (
                  <tr key={f}>
                    <th scope="row" className="px-4 py-3 font-medium text-ink">
                      {f}
                    </th>
                    <td className="px-4 py-3">{s}</td>
                    <td className="px-4 py-3">{t}</td>
                    <td className="px-4 py-3">
                      <Fidelite statut={st} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionNiveau>
        <SectionNiveau niveau="Technique" titre="Reproduire chez vous" id="reproduire">
          <pre tabIndex={0} aria-label="Commandes pour reproduire la vérification" className="overflow-x-auto rounded-2xl bg-[#0d1426] p-5 font-mono text-sm leading-relaxed text-slate-200 ring-1 ring-white/10">
            {`git clone ${OFFICIAL_REPO_MIRROR}
cd algorithmes-de-parcoursup && mvn -q package -DskipTests
cd ../parcoursup-scanned && pnpm install
OFFICIAL_JAR=…/target/parcoursup-algos-*-jar-with-dependencies.jar \\
  pnpm conformance:generate
pnpm test`}
          </pre>
        </SectionNiveau>
        <SectionNiveau niveau="Technique" titre="Limites" id="limites">
          <div className="prose-ps">
            <ul>
              <li>La conformité vaut pour la version 2024-2. Nous ne savons pas si une version plus récente est utilisée en 2025 ou 2026.</li>
              <li>Le miroir étudié est supposé identique au dépôt officiel ; nous n'avons pas pu le vérifier directement.</li>
              <li>
                Ne sont pas reproduits : la vérification « non bloquante » qui exclut un groupe en cas d'anomalie, le calcul exact des rangs affichés, les
                corrections de classement et annulations de démission.
              </li>
            </ul>
          </div>
        </SectionNiveau>
        <Liste />
      </Container>
    </>
  );
}

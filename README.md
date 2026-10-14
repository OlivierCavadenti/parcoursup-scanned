# Parcoursup Décrypté

**Parcoursup, enfin compréhensible.** Observatoire citoyen indépendant qui explique le
fonctionnement de Parcoursup, de l'examen des dossiers à l'algorithme national de
propositions, avec des schémas animés calculés à partir du code source officiel.

> Projet indépendant, non affilié au ministère ni à la plateforme Parcoursup. Les exemples
> sont fictifs et ne permettent pas de prédire une admission. Seul parcoursup.gouv.fr fait foi.

## Ce que contient le site

- **Comprendre** : parcours en 5 minutes, frise des étapes, « qui décide ? », examen des
  dossiers, quotas et priorités, listes d'attente, cas particuliers.
- **Les algorithmes** : explorateur du code officiel (entrées, sorties, complexité, tests,
  liens GitLab ligne par ligne) et une page animée par algorithme : ordre d'appel,
  propositions, internats, répondeur automatique, plus la méthode de vérification.
- **Idées reçues**, **Transparence** (carte public / partiel / inaccessible), **Données**
  (explorateur des statistiques publiques), **Glossaire**, **Sources** (registre daté).

## Fidélité au code officiel

Les algorithmes officiels (dépôt `algorithmes-de-parcoursup`, version 2024-2, commit
`8c406bf`, licence AGPL-3.0) sont portés en TypeScript dans `src/algorithmes/reference/`.
Le portage est comparé au code Java officiel compilé et exécuté sur **730 cas** (300 ordres
d'appel, 430 journées de propositions avec internats, répondeur et GDD) : résultats
identiques. Les schémas animés utilisent ce moteur. Détails : `docs/research/` et la page
« Méthode de vérification » du site.

## Démarrer

Prérequis : Node.js ≥ 20 et pnpm 10.

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm test           # tests unitaires et de conformité (Vitest)
pnpm build          # export statique dans out/
pnpm preview        # sert out/ sur http://localhost:4322
pnpm test:e2e       # Playwright + axe (après pnpm build)
pnpm data:fetch     # importe les données ouvertes (accès réseau requis)
pnpm links:check    # vérifie les liens externes du site construit
```

Régénérer les cas de référence depuis le code Java officiel (Java 17+ et Maven) :

```bash
git clone https://github.com/flyingtof/algorithmes-de-parcoursup
(cd algorithmes-de-parcoursup && mvn -q package -DskipTests)
OFFICIAL_JAR=$PWD/algorithmes-de-parcoursup/target/parcoursup-algos-*-jar-with-dependencies.jar pnpm conformance:generate
```

## Déploiement (GitHub Pages)

Le workflow `.github/workflows/deploy.yml` teste, importe les données ouvertes, construit
le site statique et le publie sur GitHub Pages à chaque push (et chaque lundi pour
rafraîchir les données). **Activation requise une seule fois** : *Settings → Pages →
Build and deployment → Source : GitHub Actions*, puis relancer le workflow.

## Structure

```
src/algorithmes/reference/   portage conforme du code officiel (ordre d'appel, propositions)
src/components/diagrams/     schémas animés (Motion) et leurs données calculées
src/components/data/         explorateur des données ouvertes
src/content/                 contenus structurés : sources, références de code, glossaire…
src/app/                     pages (Next.js App Router, export statique)
scripts/data/                import et normalisation des données ouvertes
tools/reference-harness/     harnais Java appelant le code officiel
tests/                       unit, conformance (fixtures du code officiel), e2e
docs/                        recherche, architecture, méthodologie
```

## Licence

AGPL-3.0-or-later, comme le code officiel dont les algorithmes sont adaptés.

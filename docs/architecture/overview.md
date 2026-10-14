# Architecture

## Vue d'ensemble

Site **100 % statique** (Next.js App Router, `output: "export"`), servi par GitHub Pages.
Aucun backend, aucune collecte de données.

```
          build (CI)                                   navigateur
┌──────────────────────────────┐            ┌──────────────────────────────┐
│ pnpm data:fetch → public/data│──JSON────▶ │ Explorateur (client)          │
│ pnpm build → out/ (HTML/JS)  │──HTML────▶ │ Pages pré-rendues + schémas   │
└──────────────────────────────┘            │ animés (Motion, client)       │
                                            └──────────────────────────────┘
```

## Couches

1. **`src/algorithmes/reference/`** — portage conforme du code officiel, sans dépendance
   à React : `ordre-appel.ts` (avec trace pas à pas), `propositions.ts` (avec décisions
   et événements), `verifications-ordre-appel.ts` (propriétés P1-P5).
2. **`src/components/diagrams/data/`** — calcule, au chargement du module, les états des
   exemples affichés à partir du moteur (exemples officiels ou fictifs). Testé par
   `tests/unit/schemas.test.ts`.
3. **`src/components/diagrams/`** — composants animés (Motion) : lecteur pas à pas
   (`usePlayer`), démarrage à l'entrée dans l'écran, pause hors écran, respect de
   `prefers-reduced-motion`, commandes clavier, textes `aria-live`.
4. **`src/content/`** — contenus structurés : registre des sources (Zod), références de
   code (lignes vérifiées), glossaire, chaîne de décision, transparence, idées reçues.
5. **`src/app/`** — pages ; références numérotées par page via `references([...])`.

## Conformité

`tools/reference-harness/Harness.java` appelle le jar officiel pour générer des fixtures
compressées (`tests/conformance/fixtures/*.json.gz`) ; `tests/conformance/*.test.ts`
compare le portage TypeScript à ces sorties.

## Données ouvertes

`scripts/data/fetch-parcoursup.mjs` découvre les jeux `fr-esr-parcoursup*`, télécharge
l'export CSV et les métadonnées (libellés et descriptions officiels des champs),
normalise via `src/data/adapters/colonnes.json` (adaptateur par nom de colonne), écrit
un fichier par session et un manifeste. En cas d'échec : manifeste « echec », jamais de
données inventées.

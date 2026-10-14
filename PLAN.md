# PLAN — Parcoursup Décrypté

Dernière mise à jour : 14 octobre 2026.

## Étapes

| Étape | État | Notes |
|---|---|---|
| A. Audit et recherche | ✅ | Code officiel cloné (miroir), compilé, exécuté ; présentation 2023 lue ; `docs/research/*` |
| B. Fondations techniques | ✅ | Next.js 16 (export statique), React 19, Tailwind 4, Motion 12, Zod 4, Vitest 4, Playwright |
| C. Expérience pédagogique | ✅ | Accueil, 7 modules « Comprendre », idées reçues, transparence, glossaire, sources |
| D. Simulateur | ❌ abandonné | **Décision de l'utilisateur : pas de simulateurs.** Remplacés par des schémas animés non manipulables |
| E. Conformité | ✅ | Portage TypeScript + 730 cas différentiels contre le Java officiel + tests de mutation |
| F. Open data | ✅ | Import réel validé en CI (14/10/2026) : 8 sessions, 2018 à 2025 (10 697 à 14 252 formations) ; tous les indicateurs trouvés pour 2022-2025 ; explorateur, fiche, comparateur, évolution entre sessions |
| G. Finalisation | 🟡 | Accessibilité (axe : 0 violation sérieuse, clair et sombre), SEO, e2e bureau + mobile ; activation de GitHub Pages à faire par le propriétaire du dépôt |

## Décisions

- **Pas de simulateur** (demande explicite) : le moteur de référence reste en coulisse pour
  calculer exactement les schémas animés ; aucune saisie utilisateur.
- **Export statique** pour GitHub Pages (`basePath` fourni par la CI).
- **Contenus en données structurées TypeScript** (validées par Zod pour les sources) plutôt
  qu'en MDX : typage, références vérifiées à la compilation.
- **Composants maison** plutôt que shadcn/ui et Recharts : charte visuelle unique, moins de
  dépendances ; graphiques en SVG/HTML animés avec Motion.
- **Pas de simulateur de commission** : les critères et pondérations des commissions ne sont
  pas publics ; tout outil serait une fiction trompeuse.
- **Données ouvertes téléchargées au build**, jamais à chaque visite ; échec explicite
  plutôt que données approximatives.
- **Dates de calendrier non affichées** : fixées chaque année par arrêté ; risque de
  péremption.

## Pistes

- Vérifier le dépôt GitLab officiel pour une version 2025/2026 et mettre à jour la référence.
- Intégrer la cartographie des formations (carte interactive).
- Évolution pluriannuelle par formation dans l'explorateur.
- Lire et intégrer les décisions de justice et rapports du CESP aujourd'hui marqués « à vérifier ».

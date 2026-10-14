# LIMITATIONS

État au 14 octobre 2026. Voir aussi `docs/research/limitations.md`.

## Sources
- Le dépôt GitLab officiel, Légifrance, parcoursup.gouv.fr, le portail de données du MESR
  et les pages DGESIP n'étaient pas joignables depuis l'environnement de développement.
  Le code a été étudié via un miroir public, supposé identique.
- Plusieurs sources sont marquées « à vérifier » (décision QPC 2020-834, articles de presse,
  méthodologie 2020, cartographie). Le site ne les utilise jamais comme fondement unique.
- Les URL Légifrance de la loi ORE et de la loi n° 2020-1674 ont été construites à partir
  d'identifiants connus, non vérifiés en ligne ; le script `links:check` les contrôle au déploiement.

## Algorithmes
- Version de référence 2024-2 ; les campagnes 2025 et 2026 peuvent utiliser une version différente.
- Non reproduits : vérification « non bloquante » qui exclut un groupe en cas d'anomalie,
  rangs affichés sur liste d'attente (AlgosAffichages), corrections de classement,
  annulations de démission.
- Les schémas utilisent des exemples fictifs ou ceux de la documentation officielle ; les
  réponses des candidats y sont inventées.

## Contenus
- Contenu du dossier de candidature, PASS/L.AS, candidatures internationales, handicap :
  non couverts par les sources étudiées (signalé sur la page « Cas particuliers »).
- Les décisions de justice sur les algorithmes locaux sont citées sans être résumées.

## Données ouvertes
- L'import n'a pas pu être testé sur les données réelles ; les noms de colonnes attendus
  sont à confirmer au premier déploiement (le manifeste liste colonnes trouvées et manquantes).
- La cartographie des formations n'est pas intégrée ; pas de carte ni d'évolution pluriannuelle.

## Déploiement
- GitHub Pages doit être activé par le propriétaire du dépôt (Source : GitHub Actions).
- Pas de Dockerfile : le site est entièrement statique (dossier `out/`).

# Limites — recherche et reproduction

Voir aussi `LIMITATIONS.md` à la racine (limites du produit).

## Accès aux sources

- Le dépôt GitLab officiel (`gitlab.mim-libre.fr`), Légifrance, parcoursup.gouv.fr,
  enseignementsup-recherche.gouv.fr, data.enseignementsup-recherche.gouv.fr et
  services.dgesip.fr n'étaient **pas joignables** depuis l'environnement de
  développement (proxy réseau). Le code a été étudié via le miroir GitHub public, dont
  rien ne garantit qu'il soit identique au dépôt officiel actuel.
- Les identifiants Légifrance utilisés dans les liens proviennent de la présentation
  officielle (arrêté 2023) ou de connaissances antérieures (loi ORE, LPR) ; ils sont
  contrôlés par le script de vérification des liens au déploiement.

## Versions

- Version de référence : 2024-2 (12 juin 2024). Les campagnes 2025 et 2026 peuvent
  utiliser une version différente, non publiée ou non consultée.

## Ce qui n'est pas public

- Le reste du code de la plateforme (interfaces, gestion des délais, base de données
  complète). Le dépôt ne publie que le « cœur algorithmique ».
- Les traitements locaux des commissions d'examen des vœux (critères précis,
  pondérations, outils d'aide à la décision).
- Les paramètres réels (taux d'appel, rang limite, taux boursiers par formation) au jour le jour.

## Non portés / non reproduits

- `VerificationsResultatsAlgoPropositions` en mode non bloquant (exclusion d'un groupe
  et de sa composante connexe en cas d'anomalie) : notre moteur lève une erreur.
- `AlgosAffichages` (rangs affichés sur liste d'attente, réintégrations) : le site
  affiche un rang pédagogique calculé de façon simplifiée et signalée comme telle.
- Corrections de classement et annulations de démission (cas rares de production).
- Débordements arithmétiques Java (`int`) : sans objet pour des volumes pédagogiques.

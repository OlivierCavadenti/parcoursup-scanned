# Règles juridiques — recensement

> Statut : les règles ci-dessous sont **rapportées par la présentation officielle des
> algorithmes (mai 2023)**, document lu intégralement. Les textes juridiques eux-mêmes
> (Légifrance) n'ont pas pu être consultés depuis l'environnement de développement :
> chaque règle est donc marquée « citée », jamais « vérifiée sur le texte ».

| Règle | Texte cité | Ce que dit la présentation 2023 | Traduction dans le code |
|---|---|---|---|
| Plateforme nationale de préinscription | Loi n° 2018-166 du 8 mars 2018 (ORE) | Parcoursup met en œuvre la loi ORE ; code du cœur algorithmique rendu public | — |
| Taux minimum de boursiers | Code de l'éducation, art. L. 612-3 (V à VII) | Fixé par le recteur de région académique, pour les formations sélectives et les formations non sélectives en tension | `tauxMinBoursiersPourcents` |
| Taux maximum de non-résidents (« taux résidents ») | L. 612-3 | Pour les formations **non sélectives** dont les candidatures excèdent la capacité ; interprété comme un taux minimum de résidents | `tauxMinDuSecteurPourcents` |
| Priorité du taux boursier en cas de conflit | L. 612-3 (loi du 8 mars 2018) | « En cas d'impossibilité de satisfaire les deux taux à la fois, le taux minimum de boursiers prime » | `selectionnerMeilleurVoeu` |
| Taux de bacheliers professionnels (STS) et technologiques (IUT) | L. 612-3 | Pris en charge **par des groupes de classement distincts** et leurs capacités, pas par l'algorithme d'ordre d'appel | groupes `C_GP_COD` |
| Commission d'examen des vœux | D. 612-1-13 et suivants (cités) | Chaque formation examine et ordonne les candidatures selon ses critères ; formations non sélectives pouvant ne pas ordonner | entrée « rang » |
| Groupes de classement | D. 612-1-15 | Classements distincts possibles par groupe (ex. BTS : bac pro / techno / autres ; IUT : techno / autres) | `GroupeClassement` |
| Sous-vœux, classements mutualisés | D. 612-1-11 | Plusieurs formations peuvent partager un même classement | `GroupeAffectation` (C_GP_COD, G_TI_COD, G_TA_COD) |
| Internats | D. 612-1-16 | Classement internat selon la situation sociale et la distance | `GroupeInternat` |
| Capacités d'accueil | D. 612-1-4 | Renseignées sur Parcoursup | `nbRecrutementsSouhaite` (avec taux d'appel) |
| Délais de réponse | D. 612-1-14 + arrêté calendrier | Délai réglementaire pour répondre ; proposition supprimée sinon | hors algorithme (gestion des statuts) |
| Ordonnancement des vœux et répondeur automatique | Arrêté calendrier (2023 : JORFTEXT000047246973) | Obligation d'ordonner les vœux en attente pour la fin de phase principale et la GDD ; répondeur facultatif | `RepondeurAutomatique`, `DemissionAutoVoeuxOrdonnes` |
| Dispositif « meilleurs bacheliers » | Abrogé par l'art. 37 de la loi n° 2020-1674 | Supprimé du code en 2021 | — |

## Ce qui n'est pas réglé par le code national

- les critères d'examen et les pondérations de chaque commission ;
- les outils locaux d'aide à la décision ;
- le taux d'appel (surbooking) et le rang limite choisis par chaque formation (paramètres d'entrée) ;
- les valeurs des taux arrêtées par chaque recteur.

## Évolutions entre campagnes (d'après le dépôt)

- 2019 : répondeur automatique ; « meilleurs bacheliers ».
- 2021 : suppression « meilleurs bacheliers » ; internats par sous-vœux.
- 2022 : démission automatique des vœux archivés en GDD ; algorithme internat mis à jour.
- 2023 : ordonnancement des vœux en attente avant la fin de la phase principale.
- 2024 : drapeau d'arrêt des admissions par groupe (`a_rg_flg_adm_stop`).
- 2025-2026 : **inconnu** (aucune version publiée consultée).

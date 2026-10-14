# Algorithmes publiés de Parcoursup — étude du code officiel

> Date de l'étude : 14 octobre 2026.
> Version étudiée : dépôt `algorithmes-de-parcoursup`, branche `master`, commit
> `8c406bfdd561ebda827a7746e031964356ca9941` (12 juin 2024, « Merge branch '2024' »),
> artefact Maven `parcoursup-algos-2024-2`. Étiquette précédente : `parcoursup-2023`.
> Obtenu via le miroir public https://github.com/flyingtof/algorithmes-de-parcoursup
> (le dépôt GitLab MIM-Libre n'était pas joignable depuis l'environnement de
> développement : voir `limitations.md`).

## 1. Historique des versions (journal Git du miroir)

| Date | Commit | Évolution déclarée |
|---|---|---|
| 2018-05-21 | `29b092c` … | Publication initiale (2018), corrections communautaires (typos, Maven, Java 8) |
| 2019-06-04 | `7be9a08` | « évolutions 2019 : répondeur automatique, meilleurs bacheliers, affichages candidats » |
| 2020-05-18 | `646bd93` | « ajout doc 2020, nettoyage du code, ajout flag a_rg_flg_adm_stop, ajout algos carte » |
| 2021-05-25 | `8bf5c49` | « suppression dispositif meilleurs bacheliers, ajout internats par sous-voeux, ajout vérification ordre appel, bac à sable, docker » |
| 2022-05-18 | `2a5b359` | « mise à jour algo internat 2022, ajout doc 2022 » |
| 2022-07-16 | `d96ff0e` | « démission auto des vœux archivés en GDD » |
| 2023-05-25 | `4e60ae2` | « publi 2023 : ordonnancement des vœux avant fin de GDD » (tag `parcoursup-2023`) |
| 2024-06-06 | `5a6e760` | « 2024 » — commentaires `EVOL 2024` : groupes avec `a_rg_flg_adm_stop` exclus du calcul ; rangs sur liste d'attente (réintégrations) |

**Correspondance campagne ↔ version.** Les messages de commit associent explicitement
les versions aux campagnes 2019 à 2024. Le moteur de référence du site correspond à la
version **2024-2** (campagne 2024). Aucune version postérieure n'a pu être consultée :
on ne sait pas si le code a évolué pour les campagnes 2025 et 2026.

## 2. Licence et obligations

- Licence : **GNU Affero GPL v3** (fichier `LICENSE`), en-têtes « Copyright 2018 ©
  Ministère de l'Enseignement Supérieur, de la Recherche et de l'Innovation, Hugo Gimbert ».
- Conséquence pour ce projet : le moteur TypeScript est une **adaptation** (portage) du code
  officiel ; il est donc distribué sous **AGPL-3.0-or-later**, avec mention de l'origine et
  des modifications (en-têtes des fichiers `src/simulation/engine/reference/*`). Le site étant
  servi sur le réseau, le code source complet est publié (dépôt GitHub du projet), ce qui
  satisfait l'article 13 de l'AGPL.
- Le harnais Java (`tools/reference-harness`) n'inclut aucune ligne du code officiel : il
  l'appelle via le jar compilé localement.

## 3. Modules algorithmiques

| Module | Classes | Rôle |
|---|---|---|
| Ordre d'appel | `ordreappel.algo.GroupeClassement`, `VoeuClasse`, `AlgoOrdreAppel` | Transforme le classement pédagogique d'un groupe en ordre d'appel respectant le taux minimum de boursiers et le taux de candidats du secteur |
| Propositions | `propositions.algo.AlgoPropositions`, `GroupeAffectation`, `Voeu` | Calcul quotidien des propositions dans chaque groupe d'affectation |
| Internats | `GroupeInternat`, `IndexInternats` | Barres (« positions ») d'admission internat, réservation de places |
| Répondeur automatique | `RepondeurAutomatique` | Acceptation automatique de la meilleure proposition selon l'ordre de préférence |
| Démission auto GDD | `DemissionAutoVoeuxOrdonnes` | Démission des vœux moins bien classés lors d'une nouvelle proposition en GDD |
| Affichages | `propositions.affichages.AlgosAffichages` | Rangs sur liste d'attente et rang du dernier appelé affichés |
| Vérifications | `verification.*` | Contrôles d'intégrité des entrées et propriétés des sorties |
| Accès données | `*.donnees.*`, `prod.*` | Connecteurs Oracle/H2/XML/JSON (non portés) |

## 4. Algorithme de l'ordre d'appel

**Entrées** (par groupe de classement `C_GP_COD`) : taux minimum de boursiers `qB` (%),
taux minimum de candidats du secteur `qR` (%, interprétation du taux maximum de
non-résidents), liste des vœux classés (candidat, rang > 0 unique, boursier, du secteur).

**Sortie** : un rang d'appel (1…n) pour chaque candidat.

**Procédure** (`GroupeClassement.calculerOrdreAppel`, l. 139-227) :
1. tri par rang ; ventilation dans 4 files FIFO (boursier du secteur, boursier hors
   secteur, non-boursier du secteur, non-boursier hors secteur) ;
2. pour k = 1…n :
   - `contrainteTauxBoursier = (bAppelés < bTotal) && (bAppelés × 100 < qB × (1 + nbAppelés))`
   - `contrainteTauxSecteur = (rAppelés < rTotal) && (rAppelés × 100 < qR × (1 + nbAppelés))`
   - parmi les têtes de file qui satisfont **toutes** les contraintes actives, on prend la
     mieux classée ;
   - si aucune ne convient (les deux contraintes sont actives et il ne reste plus de boursier
     du secteur), on prend la tête de la file « boursier hors secteur » : **le taux boursier
     prime** (`selectionnerMeilleurVoeu`, l. 70-136).

Remarque : la formulation « b/k < qB % » de la présentation officielle correspond
exactement à `b × 100 < qB × k`, où k = nbAppelés + 1. Un taux non entier est donc
arrondi « à l'entier supérieur » comme l'indique la présentation.

**Invariants vérifiés par le code officiel** (`VerificationsResultatsAlgoOrdreAppel`,
P1 à P5) : voir `src/simulation/engine/reference/verifications-ordre-appel.ts`.
- P1 : pour tout k, au moins qB % des k premiers sont boursiers, sinon plus aucun boursier après ;
- P2 : un boursier du secteur n'est jamais doublé ;
- P3 : un non-boursier du secteur n'est doublé que par des boursiers, rang ≤ 1 + ⌊(1 + qB/(100−qB))·r⌋ ;
- P4 : un boursier hors secteur n'est doublé que par des candidats du secteur ;
- P5 : un non-boursier hors secteur ne double personne.

**Complexité** : O(n log n) (tri), puis O(n) itérations à coût constant (4 files).

## 5. Algorithme des propositions

**Entrées** : paramètres de campagne (`nbJoursCampagne`, date de fin de réservation des
internats, début de la GDD, fin d'ordonnancement), groupes d'affectation (nombre de
recrutements souhaité = capacité × taux d'appel, rang limite d'appel, rangs du dernier
appelé actuel et de référence, drapeaux), internats (capacité), vœux (statut, ordre
d'appel, rang internat, rang de préférence), candidats ayant activé le répondeur.

**Boucle principale** (`AlgoPropositions.calcule`, l. 52-119) :
```
répéter
  préparer les groupes (vœux en attente, candidats déjà affectés)
  vérifier l'intégrité des entrées
  calculer les nouvelles propositions (avec internats)
  si jour ≥ début GDD : démissions automatiques des vœux ordonnés
  appliquer le répondeur automatique
jusqu'à ce qu'aucune place ne soit libérée
```

**Dans un groupe** (`GroupeAffectation.mettreAJourPropositions`, l. 229-274) : on parcourt
les vœux en attente dans l'ordre d'appel ; un vœu bloqué par la barre internat est sauté ;
sinon on propose si (a) il reste des places (`nbRecrutementsSouhaite − candidats déjà
affectés`), ou (b) rang d'appel ≤ rang limite, ou (c) le candidat a déjà la formation
(vœu avec internat), ou (d) c'est le même candidat que le précédent (vœux avec/sans
internat consécutifs). Une place n'est décomptée qu'une fois par candidat.

**Internats** (`GroupeInternat`) :
- position maximale d'admission (l. 195-223) calculée à partir de l'estimation du rang du
  dernier appelé à la date de fin de réservation (`GroupeAffectation`, l. 160-189) :
  réservation de places pour les candidats les mieux classés à l'internat susceptibles
  d'être appelés ;
- position d'admission abaissée tant qu'un internat est en surcapacité (l. 288-335) ; le
  résultat est indépendant de l'ordre de traitement (propriété démontrée dans la
  documentation officielle).

**Répondeur automatique** (`RepondeurAutomatique`, l. 82-132) : pour un candidat avec
répondeur et au moins une proposition du jour, toutes les propositions antérieures et les
vœux moins bien classés que la meilleure proposition du jour sont démissionnés.

**Démission automatique en GDD** (`DemissionAutoVoeuxOrdonnes`, l. 79-119) : pour un
candidat sans répondeur ayant ordonné ses vœux, une nouvelle proposition entraîne la
démission des vœux en attente et des propositions non encore acceptées moins bien classés.

## 6. Statuts d'un vœu (`Voeu.StatutVoeu`, l. 172)

`EN_ATTENTE_DE_PROPOSITION`, `PROPOSITION_DU_JOUR`, `REP_AUTO_ACCEPTE`,
`REP_AUTO_REFUS_PROPOSITION`, `REP_AUTO_DEMISSION_ATTENTE`,
`DEMISSION_AUTO_VOEU_ORDONNE_EN_ATTENTE`, `DEMISSION_AUTO_VOEU_ORDONNE_PROPOSITION_EN_ATTENTE_REP`,
`PROPOSITION_JOURS_PRECEDENTS_EN_ATTENTE_DE_REPONSE_DU_CANDIDAT`,
`PROPOSITION_JOURS_PRECEDENTS_ACCEPTEE`, `PROPOSITION_JOURS_PRECEDENTS_REFUSEE`,
`REFUS_OU_DEMISSION` (simulation), `NON_CLASSE` (simulation).

## 7. Tests et exemples officiels

- `src/test/java/…` : tests JUnit (unitaires, connecteurs SQL, vérifications).
- `bacasable/ordreappel/ExempleA1…A6` : exemples de la présentation (repris dans
  `tests/unit/exemples-officiels.test.ts`).
- `bacasable/propositions/ExempleAleatoire`, `ExemplePropositions` : générateur aléatoire et
  simulation multi-journées (réponses tirées au hasard). Notre harnais s'en inspire, avec
  une graine fixe pour la reproductibilité.
- `ml/` : implémentation OCaml indépendante de l'ordre d'appel (comparaison `compare_oa.sh`).

## 8. Portage et conformité

| Algorithme | Fichier TypeScript | Statut | Preuve |
|---|---|---|---|
| Ordre d'appel | `src/simulation/engine/reference/ordre-appel.ts` | **Conforme à la version 2024-2** | 300 cas différentiels + exemples officiels + propriétés P1-P5 |
| Propositions (groupes, internats, répondeur, GDD, adm_stop) | `src/simulation/engine/reference/propositions.ts` | **Conforme à la version 2024-2** | 430 journées simulées différentielles |
| Affichages (rangs liste d'attente) | `src/simulation/engine/pedagogique/*` | Simplification pédagogique | non comparé |
| Vérification a posteriori non bloquante | — | Non porté | voir limitations |

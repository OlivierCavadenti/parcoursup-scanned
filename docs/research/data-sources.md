# Sources de données

## Jeux de données officiels visés

| Jeu | Identifiant | Producteur | Usage dans le site |
|---|---|---|---|
| Vœux et propositions par formation | `fr-esr-parcoursup` (+ millésimes `fr-esr-parcoursup-2019`, `fr-esr-parcoursup_2020`…) | MESR — SIES | Explorateur, fiches formations, comparateur |
| Cartographie des formations | `fr-esr-cartographie_formations_parcoursup` | MESR | (prévu) géolocalisation |

## Accessibilité constatée pendant le développement

Le portail `data.enseignementsup-recherche.gouv.fr` n'était **pas joignable** depuis
l'environnement de développement (refus du proxy réseau). Aucune donnée réelle n'a donc
été téléchargée ni affichée pendant le développement, et **aucune donnée n'a été inventée**.

## Chaîne d'import (`scripts/data/fetch-parcoursup.mjs`)

1. Téléchargement de l'export CSV de l'API Opendatasoft v2.1
   (`/api/explore/v2.1/catalog/datasets/{id}/exports/csv?delimiter=;`) au moment du
   **build de déploiement** (GitHub Actions, qui dispose d'un accès réseau).
2. Détection du millésime (`session`) et **adaptateur par millésime** : chaque indicateur
   est cherché sous une liste de noms de colonnes candidats ; une colonne absente donne
   une valeur `null` explicitement signalée, jamais une valeur par défaut.
3. Validation (Zod) et normalisation : nombres, pourcentages, codes UAI, libellés.
4. Écriture de fichiers JSON statiques fragmentés (`public/data/…`) ; le site n'interroge
   jamais l'API à chaque visite.
5. En cas d'échec (réseau, schéma inattendu), le build continue et l'explorateur affiche
   un état « données non importées » avec la raison.

## Colonnes attendues (à confirmer à l'import)

Les noms ci-dessous sont ceux connus des millésimes 2020+ ; l'adaptateur journalise les
colonnes manquantes ou inconnues pour chaque millésime :

`session`, `cod_uai`, `g_ea_lib_vx` (établissement), `dep`, `dep_lib`, `region_etab_aff`,
`acad_mies`, `ville_etab`, `select_form`, `fili`, `form_lib_voe_acc`, `fil_lib_voe_acc`,
`lib_for_voe_ins`, `capa_fin` (capacité), `voe_tot` (vœux / candidatures), `nb_voe_pp`,
`nb_cla_pp`, `prop_tot` (propositions), `acc_tot` (acceptations), `pct_bours`,
`pct_f`, `pct_bg`, `pct_bt`, `pct_bp`, `ran_grp1`…`ran_grp3` (rang du dernier appelé
par groupe), `taux_acces_ens` (taux d'accès), `cod_aff_form`, `lien_form_psup`.

## Définitions et précautions

- **Taux d'accès** : d'après la méthodologie 2020 (référence repérée, non lue en entier),
  il rapporte les candidats classés jusqu'au rang du dernier appelé de leur groupe aux
  candidats ayant confirmé un vœu en phase principale. Ce **n'est pas** une probabilité
  individuelle d'admission.
- Les définitions changent selon les millésimes : le comparateur n'affiche côte à côte
  que des indicateurs portant le même nom normalisé **et** une définition déclarée
  identique dans `src/data/adapters/indicateurs.ts`.

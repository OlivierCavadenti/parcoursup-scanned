# Matrice de vérification

| Fonctionnalité | Source(s) | Tests de référence | Fidélité | Incertitudes |
|---|---|---|---|---|
| Ordre d'appel, taux boursiers seul | GroupeClassement l. 139-227 ; présentation 2023 §4.1 | `tests/conformance/ordre-appel.test.ts` (300 cas) ; exemple 25 % ; ExempleA1-A3 | **Conforme 2024-2** | aucune connue |
| Ordre d'appel, deux taux | GroupeClassement l. 70-136 ; §4.2-4.3 | idem + exemple 20 %/90 % ; ExempleA5 | **Conforme 2024-2** | valeurs réelles des taux par formation |
| Propriétés P1-P5 | VerificationsResultatsAlgoOrdreAppel | vérifiées sur chaque cas différentiel | **Conforme** | — |
| Propositions sans internat | GroupeAffectation l. 229-274 | `tests/conformance/propositions.test.ts` (430 journées) | **Conforme 2024-2** | taux d'appel réels inconnus |
| Rang limite d'appel | idem | idem | **Conforme 2024-2** | — |
| Internats (barres, réservation) | GroupeInternat l. 195-223, 288-335 ; annexe A et B | idem + exemple annexe A | **Conforme 2024-2** | paramètres de dates réels |
| Répondeur automatique | RepondeurAutomatique l. 82-132 ; §6 | idem + exemple §6.1 | **Conforme 2024-2** | — |
| Démission auto GDD | DemissionAutoVoeuxOrdonnes l. 79-119 | idem | **Conforme 2024-2** | — |
| Arrêt des admissions (adm_stop) | AlgoPropositions (EVOL 2024) | idem | **Conforme 2024-2** | usage réel non documenté |
| Rang sur liste d'attente affiché | AlgosAffichages l. 94-159 | — | Expliqué en texte, non reproduit | réintégrations |
| Schémas animés (ordre d'appel, internat, répondeur) | exemples de la présentation 2023 | calculés au build par le moteur de référence ; `tests/unit/exemples-officiels.test.ts` | **Conforme** (mêmes données que les tests) | — |

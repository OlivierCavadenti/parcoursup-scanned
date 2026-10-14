/**
 * Références vers le code officiel, attachées à la version de référence.
 * Chaque lien pointe vers le dépôt GitLab officiel (branche master) et vers
 * le miroir figé au commit étudié (numéros de ligne vérifiés).
 */
import { OFFICIAL_REPO_GITLAB, OFFICIAL_REPO_MIRROR, REFERENCE_COMMIT } from "./sources";

const BASE = "src/main/java/fr/parcoursup/algos";

export interface CodeRef {
  id: string;
  titre: string;
  fichier: string;
  debut: number;
  fin: number;
  resume: string;
}

export const CODE_REFS = {
  ordreAppelCalcul: { id: "ordreAppelCalcul", titre: "GroupeClassement.calculerOrdreAppel()", fichier: `${BASE}/ordreappel/algo/GroupeClassement.java`, debut: 139, fin: 227, resume: "Boucle principale du calcul de l'ordre d'appel : quatre files, compteurs, contraintes." },
  ordreAppelContraintes: { id: "ordreAppelContraintes", titre: "Calcul des contraintes de taux", fichier: `${BASE}/ordreappel/algo/GroupeClassement.java`, debut: 186, fin: 197, resume: "contrainteTauxBoursier et contrainteTauxResident à chaque position." },
  ordreAppelSelection: { id: "ordreAppelSelection", titre: "GroupeClassement.selectionnerMeilleurVoeu()", fichier: `${BASE}/ordreappel/algo/GroupeClassement.java`, debut: 70, fin: 136, resume: "Choix du meilleur candidat éligible ; priorité au taux boursier en cas de conflit." },
  typesCandidat: { id: "typesCandidat", titre: "VoeuClasse.TypeCandidat", fichier: `${BASE}/ordreappel/algo/VoeuClasse.java`, debut: 33, fin: 38, resume: "Les quatre types de candidats (boursier / secteur)." },
  verifOrdreAppel: { id: "verifOrdreAppel", titre: "VerificationsResultatsAlgoOrdreAppel", fichier: `${BASE}/verification/VerificationsResultatsAlgoOrdreAppel.java`, debut: 66, fin: 255, resume: "Propriétés P1 à P5 vérifiées après chaque calcul." },
  propositionsCalcule: { id: "propositionsCalcule", titre: "AlgoPropositions.calcule()", fichier: `${BASE}/propositions/algo/AlgoPropositions.java`, debut: 52, fin: 119, resume: "Boucle quotidienne : propositions, démissions GDD, répondeur automatique, jusqu'à stabilisation." },
  propositionsNouvelles: { id: "propositionsNouvelles", titre: "AlgoPropositions.calculerNouvellesPropositions()", fichier: `${BASE}/propositions/algo/AlgoPropositions.java`, debut: 139, fin: 207, resume: "Itérations groupes ↔ internats jusqu'à respect des capacités des internats." },
  groupeAppel: { id: "groupeAppel", titre: "GroupeAffectation.mettreAJourPropositions()", fichier: `${BASE}/propositions/algo/GroupeAffectation.java`, debut: 229, fin: 274, resume: "Descente dans l'ordre d'appel : places vacantes, rang limite, formation déjà obtenue." },
  estimationDernierAppele: { id: "estimationDernierAppele", titre: "Estimation du rang du dernier appelé", fichier: `${BASE}/propositions/algo/GroupeAffectation.java`, debut: 160, fin: 189, resume: "Interpolation utilisée pour réserver des places d'internat." },
  placesVacantes: { id: "placesVacantes", titre: "GroupeAffectation.nbPlacesVacantes()", fichier: `${BASE}/propositions/algo/GroupeAffectation.java`, debut: 279, fin: 281, resume: "Places restantes = recrutements souhaités − candidats ayant une proposition." },
  internatMax: { id: "internatMax", titre: "Position maximale d'admission à l'internat", fichier: `${BASE}/propositions/algo/GroupeInternat.java`, debut: 195, fin: 223, resume: "Réservation de places pour les mieux classés à l'internat." },
  internatPosition: { id: "internatPosition", titre: "GroupeInternat.mettreAJourPositionAdmission()", fichier: `${BASE}/propositions/algo/GroupeInternat.java`, debut: 288, fin: 335, resume: "Abaissement de la barre internat en cas de surcapacité." },
  statuts: { id: "statuts", titre: "Voeu.StatutVoeu", fichier: `${BASE}/propositions/algo/Voeu.java`, debut: 172, fin: 185, resume: "Tous les statuts possibles d'un vœu." },
  barreInternatVoeu: { id: "barreInternatVoeu", titre: "Voeu.estDesactiveParPositionAdmissionInternat()", fichier: `${BASE}/propositions/algo/Voeu.java`, debut: 295, fin: 302, resume: "Un vœu avec internat reste en attente si le rang internat dépasse la barre." },
  repondeur: { id: "repondeur", titre: "RepondeurAutomatique", fichier: `${BASE}/propositions/algo/RepondeurAutomatique.java`, debut: 82, fin: 132, resume: "Acceptation automatique et démissions des vœux moins bien classés." },
  demissionGdd: { id: "demissionGdd", titre: "DemissionAutoVoeuxOrdonnes", fichier: `${BASE}/propositions/algo/DemissionAutoVoeuxOrdonnes.java`, debut: 79, fin: 119, resume: "Démissions automatiques des vœux ordonnés pendant la GDD." },
  rangsListeAttente: { id: "rangsListeAttente", titre: "AlgosAffichages.mettreAJourRangsListeAttente()", fichier: `${BASE}/propositions/affichages/AlgosAffichages.java`, debut: 94, fin: 159, resume: "Calcul du rang affiché sur liste d'attente." },
} satisfies Record<string, CodeRef>;

export type CodeRefId = keyof typeof CODE_REFS;

export function lienGitlab(ref: CodeRef): string {
  return `${OFFICIAL_REPO_GITLAB}/-/blob/master/${ref.fichier}#L${ref.debut}-${ref.fin}`;
}

export function lienMiroir(ref: CodeRef): string {
  return `${OFFICIAL_REPO_MIRROR}/blob/${REFERENCE_COMMIT}/${ref.fichier}#L${ref.debut}-L${ref.fin}`;
}

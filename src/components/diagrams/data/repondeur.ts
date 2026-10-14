/**
 * Exemples 1 et 2 de la section 6 de la présentation officielle (mai 2023) :
 * un candidat a reçu et accepté F1, puis ordonné ses vœux en attente F3 > F4 > F5.
 * Statuts calculés par le moteur de référence (répondeur automatique / démission
 * automatique en phase de gestion des démissions).
 */
import { calculerPropositions, type StatutVoeu, type VoeuEntree } from "@/algorithmes/reference/propositions";

export type Formation = "F1" | "F3" | "F4" | "F5";
export const PREFERENCES: Formation[] = ["F3", "F4", "F5", "F1"];

export interface EtatRep {
  titre: string;
  texte: string;
  statuts: Record<Formation, StatutVoeu | "SUPPRIME">;
  nouvelle?: Formation;
}

const num = (f: Formation) => Number(f.slice(1));

function jour(statuts: Record<Formation, StatutVoeu | "SUPPRIME">, proposee: Formation, repondeur: boolean) {
  const voeux: VoeuEntree[] = [];
  for (const f of PREFERENCES) {
    const s = statuts[f];
    if (s === "SUPPRIME") continue;
    const statut: StatutVoeu = s === "REP_AUTO_ACCEPTE" ? "PROPOSITION_JOURS_PRECEDENTS_ACCEPTEE" : s === "PROPOSITION_DU_JOUR" ? "PROPOSITION_JOURS_PRECEDENTS_EN_ATTENTE_DE_REPONSE_DU_CANDIDAT" : s;
    voeux.push({ gCnCod: 1, cGpCod: num(f), gTiCod: 1, gTaCod: num(f), avecInternat: false, internat: null, ordreAppel: 1, rangInternat: 0, rangPreferences: PREFERENCES.indexOf(f) + 1, statut, affecteHorsPP: false });
  }
  const sortie = calculerPropositions({
    parametres: { nbJoursCampagne: 60, nbJoursCampagneDateFinReservationInternats: 10, nbJoursCampagneDateDebutGDD: 50, nbJoursCampagneDateFinOrdonnancementGDD: 50 },
    groupes: PREFERENCES.map((f) => ({ cGpCod: num(f), gTiCod: 1, gTaCod: num(f), nbRecrutementsSouhaite: f === proposee ? 1 : 0, rangLimite: 0, rangDernierAppeleActuellement: 0, rangDernierAppeleReference: 0, finReservationInternats: false, admStop: false })),
    internats: [],
    voeux,
    candidatsAvecRepondeurAutomatique: repondeur ? [1] : [],
  });
  const res = { ...statuts };
  for (const v of sortie.voeux) {
    const f = `F${v.gTaCod}` as Formation;
    res[f] = v.statut.startsWith("REP_AUTO_DEMISSION") || v.statut.startsWith("REP_AUTO_REFUS") || v.statut.startsWith("DEMISSION_AUTO") ? "SUPPRIME" : v.statut;
  }
  return res;
}

const DEPART: Record<Formation, StatutVoeu | "SUPPRIME"> = {
  F1: "PROPOSITION_JOURS_PRECEDENTS_ACCEPTEE",
  F3: "EN_ATTENTE_DE_PROPOSITION",
  F4: "EN_ATTENTE_DE_PROPOSITION",
  F5: "EN_ATTENTE_DE_PROPOSITION",
};

function avecRepondeur(): EtatRep[] {
  const j1 = jour(DEPART, "F4", true);
  const j2 = jour(j1, "F3", true);
  return [
    { titre: "Situation de départ", texte: "Le candidat a accepté F1. Il garde F3, F4 et F5 en attente car il les préfère à F1, les ordonne F3 > F4 > F5, et active le répondeur automatique.", statuts: DEPART },
    { titre: "Une place se libère en F4", texte: "F4 lui fait une proposition. Elle est mieux classée que F1 dans son ordre de préférence.", statuts: { ...DEPART, F4: "PROPOSITION_DU_JOUR" }, nouvelle: "F4" },
    { titre: "Le répondeur agit", texte: "F4 est acceptée automatiquement. F1 (moins bien classée) et F5 (moins bien classé que F4) sont supprimés : leurs places sont libérées pour d'autres candidats. F3, préféré, reste en attente.", statuts: j1, nouvelle: "F4" },
    { titre: "Puis F3 se libère", texte: "La proposition de F3 est acceptée automatiquement et F4 est libérée. Le candidat a obtenu son vœu préféré sans se connecter.", statuts: j2, nouvelle: "F3" },
  ];
}

function sansRepondeur(): EtatRep[] {
  const j1 = jour(DEPART, "F4", false);
  return [
    { titre: "Situation de départ", texte: "Le candidat a accepté F1 et a ordonné ses vœux en attente F3 > F4 > F5 avant la fin de la phase principale, sans activer le répondeur.", statuts: DEPART },
    { titre: "Proposition en F4 pendant la GDD", texte: "F4 lui fait une proposition.", statuts: { ...DEPART, F4: "PROPOSITION_DU_JOUR" }, nouvelle: "F4" },
    { titre: "Démission automatique", texte: "F5, moins bien classé que F4, est supprimé. F1 (déjà acceptée) et F3 (préféré) sont conservés : le candidat doit choisir entre F1 et F4 dans le délai prescrit.", statuts: j1, nouvelle: "F4" },
  ];
}

export const EXEMPLES_REPONDEUR = { avec: avecRepondeur(), sans: sansRepondeur() };

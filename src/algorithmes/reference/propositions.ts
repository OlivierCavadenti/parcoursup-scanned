/**
 * Calcul quotidien des propositions d'admission — portage TypeScript fidèle.
 *
 * Sources officielles (dépôt « algorithmes-de-parcoursup », version Maven 2024-2,
 * commit 8c406bf du 12/06/2024, licence AGPL-3.0) :
 *   - propositions/algo/AlgoPropositions.java          boucle principale
 *   - propositions/algo/GroupeAffectation.java         appel dans l'ordre d'appel, estimation du rang du dernier appelé
 *   - propositions/algo/GroupeInternat.java            barres (positions) d'admission internat
 *   - propositions/algo/Voeu.java                      statuts et transitions
 *   - propositions/algo/RepondeurAutomatique.java      répondeur automatique
 *   - propositions/algo/DemissionAutoVoeuxOrdonnes.java démissions automatiques (GDD)
 *
 * Fidélité : conforme — validé par comparaison différentielle avec le code Java
 * officiel sur des simulations multi-journées (tests/conformance/propositions.test.ts).
 *
 * Non portés (hors périmètre du calcul) : chargement SQL, affichages des rangs
 * sur liste d'attente (AlgosAffichages), vérification a posteriori
 * « non bloquante » qui exclut un groupe en cas d'anomalie
 * (VerificationsResultatsAlgoPropositions). Voir LIMITATIONS.md.
 */
import { ErreurVerification } from "./ordre-appel";

export const INT_MAX = 2147483647;

export type StatutVoeu =
  | "EN_ATTENTE_DE_PROPOSITION"
  | "PROPOSITION_DU_JOUR"
  | "REP_AUTO_DEMISSION_ATTENTE"
  | "DEMISSION_AUTO_VOEU_ORDONNE_EN_ATTENTE"
  | "DEMISSION_AUTO_VOEU_ORDONNE_PROPOSITION_EN_ATTENTE_REP"
  | "REP_AUTO_ACCEPTE"
  | "REP_AUTO_REFUS_PROPOSITION"
  | "PROPOSITION_JOURS_PRECEDENTS_EN_ATTENTE_DE_REPONSE_DU_CANDIDAT"
  | "PROPOSITION_JOURS_PRECEDENTS_ACCEPTEE"
  | "PROPOSITION_JOURS_PRECEDENTS_REFUSEE"
  | "REFUS_OU_DEMISSION"
  | "NON_CLASSE";

export interface Parametres {
  /** nombre de jours depuis l'ouverture de la phase d'admission (1 le premier jour) */
  nbJoursCampagne: number;
  nbJoursCampagneDateFinReservationInternats: number;
  nbJoursCampagneDateDebutGDD: number;
  nbJoursCampagneDateFinOrdonnancementGDD: number;
}

export interface GroupeAffectationEntree {
  cGpCod: number;
  gTiCod: number;
  gTaCod: number;
  /** nombre de recrutements souhaité (capacité × taux d'appel, « A_RG_NBR_SOU ») */
  nbRecrutementsSouhaite: number;
  /** rang limite d'appel : tous les candidats de rang ≤ reçoivent une proposition (0 = aucun) */
  rangLimite: number;
  rangDernierAppeleActuellement: number;
  rangDernierAppeleReference: number;
  finReservationInternats: boolean;
  /** drapeau « a_rg_flg_adm_stop » (évolution 2024) : groupe exclu du calcul */
  admStop: boolean;
}

export interface InternatId {
  cGiCod: number;
  gTiCod: number;
  /** 0 pour un internat commun à plusieurs formations */
  gTaCod: number;
}

export interface InternatEntree {
  id: InternatId;
  capacite: number;
}

export interface VoeuEntree {
  gCnCod: number;
  cGpCod: number;
  gTiCod: number;
  gTaCod: number;
  avecInternat: boolean;
  /** internat à classement propre (null si pas de demande, ou internat sans classement) */
  internat: InternatId | null;
  ordreAppel: number;
  rangInternat: number;
  /** rang dans l'ordre de préférence du candidat (0 = vœux non ordonnés) */
  rangPreferences: number;
  statut: StatutVoeu;
  affecteHorsPP: boolean;
}

export interface EntreePropositions {
  parametres: Parametres;
  groupes: GroupeAffectationEntree[];
  internats: InternatEntree[];
  voeux: VoeuEntree[];
  candidatsAvecRepondeurAutomatique: number[];
}

export type RaisonProposition = "PLACES_VACANTES" | "RANG_LIMITE" | "FORMATION_DEJA_OBTENUE" | "MEME_CANDIDAT";

export type Decision =
  | { type: "PROPOSITION"; raison: RaisonProposition; placesRestantesAvant: number }
  | { type: "BLOQUE_INTERNAT"; rangInternat: number; positionAdmission: number }
  | { type: "PAS_DE_PLACE"; placesRestantesAvant: number }
  | { type: "GROUPE_ARRETE" };

export type EvenementAlgo =
  | { type: "ITERATION"; iteration: number }
  | { type: "INIT_INTERNAT"; internat: string; positionMaximaleAdmission: number; placesVacantes: number }
  | { type: "PASSE_GROUPES"; iteration: number; passe: number; groupes: string[] }
  | { type: "BARRE_INTERNAT_ABAISSEE"; internat: string; ancienne: number; nouvelle: number; candidatEnCause: number }
  | { type: "REPONDEUR"; voeu: string; nouveauStatut: StatutVoeu; rangMeilleureProposition: number }
  | { type: "DEMISSION_GDD"; voeu: string; nouveauStatut: StatutVoeu; rangMeilleureProposition: number }
  | { type: "FIN"; iterations: number; placesLibereesTotal: number };

export interface VoeuSortie extends VoeuEntree {
  cle: string;
  repondeurActive: boolean;
  decision?: Decision;
}

export interface SortiePropositions {
  voeux: VoeuSortie[];
  internats: { id: InternatId; cle: string; capacite: number; positionAdmission: number; positionMaximaleAdmission: number }[];
  groupes: { cle: string; cGpCod: number; gTiCod: number; gTaCod: number; estimationRangDernierAppele: number; nbRecrutementsSouhaite: number }[];
  evenements: EvenementAlgo[];
}

export const cleGroupe = (g: { cGpCod: number; gTiCod: number; gTaCod: number }) => `${g.cGpCod}:${g.gTiCod}:${g.gTaCod}`;
export const cleInternat = (i: InternatId) => `${i.cGiCod}:${i.gTiCod}:${i.gTaCod}`;
export const cleVoeu = (v: { gCnCod: number; gTaCod: number; avecInternat: boolean }) =>
  `${v.gCnCod}:${v.gTaCod}:${v.avecInternat ? 1 : 0}`;

/* ------------------------------------------------------------------ */
/* Prédicats de statut (Voeu.java)                                     */
/* ------------------------------------------------------------------ */

export const estPropositionDuJour = (s: StatutVoeu) => s === "REP_AUTO_ACCEPTE" || s === "PROPOSITION_DU_JOUR";
export const estProposition = (s: StatutVoeu) =>
  s === "REP_AUTO_ACCEPTE" ||
  s === "PROPOSITION_DU_JOUR" ||
  s === "PROPOSITION_JOURS_PRECEDENTS_ACCEPTEE" ||
  s === "PROPOSITION_JOURS_PRECEDENTS_EN_ATTENTE_DE_REPONSE_DU_CANDIDAT";
export const aEteProposeJoursPrecedents = (s: StatutVoeu) =>
  s === "PROPOSITION_JOURS_PRECEDENTS_ACCEPTEE" ||
  s === "PROPOSITION_JOURS_PRECEDENTS_EN_ATTENTE_DE_REPONSE_DU_CANDIDAT" ||
  s === "PROPOSITION_JOURS_PRECEDENTS_REFUSEE";
export const estEnAttente = (s: StatutVoeu) => s === "EN_ATTENTE_DE_PROPOSITION";

/* ------------------------------------------------------------------ */
/* Modèle interne                                                      */
/* ------------------------------------------------------------------ */

interface Groupe {
  cle: string;
  e: GroupeAffectationEntree;
  estimation: number;
  voeuxEnAttente: Voeu[];
  affectes: Set<number>;
}

interface Internat {
  cle: string;
  e: InternatEntree;
  positionAdmission: number;
  positionMaximaleAdmission: number;
  estInitialise: boolean;
  voeuxEnAttente: Voeu[];
  affectes: Set<number>;
}

interface Voeu {
  cle: string;
  e: VoeuEntree;
  statut: StatutVoeu;
  repondeurActive: boolean;
  groupe: Groupe;
  internat: Internat | null;
  decision?: Decision;
}

/** GroupeAffectation.calculerEstimationRangDernierAppeleADateFinReservationInternat */
export function calculerEstimationRangDernierAppele(
  rangDernierAppeleActuellement: number,
  rangDernierAppeleAnterieur: number,
  rangLimiteAppelBloc: number,
  p: Parametres,
): number {
  if (rangDernierAppeleActuellement < rangDernierAppeleAnterieur) {
    throw new ErreurVerification("RANG_DERNIER_APPELE", "Rang du dernier appelé incohérent (inférieur à la référence).");
  }
  const NB_JOURS_POUR_INTERPOLATION_INTERNAT = 4;
  if (p.nbJoursCampagne <= 1) return INT_MAX;
  if (p.nbJoursCampagne >= p.nbJoursCampagneDateFinReservationInternats) {
    return Math.max(rangLimiteAppelBloc, rangDernierAppeleActuellement);
  }
  if (rangDernierAppeleActuellement <= 0) return INT_MAX;
  let estimation: number;
  if (rangDernierAppeleAnterieur <= 0) {
    estimation = Math.trunc(
      (rangDernierAppeleActuellement * (p.nbJoursCampagneDateFinReservationInternats - 1)) / (p.nbJoursCampagne - 1),
    );
  } else {
    const nbJoursRestants = p.nbJoursCampagneDateFinReservationInternats - p.nbJoursCampagne;
    estimation =
      rangDernierAppeleActuellement +
      Math.trunc((nbJoursRestants * (rangDernierAppeleActuellement - rangDernierAppeleAnterieur)) / NB_JOURS_POUR_INTERPOLATION_INTERNAT);
  }
  return Math.max(estimation, Math.max(rangLimiteAppelBloc, rangDernierAppeleActuellement));
}

/* tri stable par clé numérique, départage déterministe (candidat, internat) */
const parOrdreAppel = (a: Voeu, b: Voeu) =>
  a.e.ordreAppel - b.e.ordreAppel || a.e.gCnCod - b.e.gCnCod || Number(a.e.avecInternat) - Number(b.e.avecInternat);
const parRangInternat = (a: Voeu, b: Voeu) => a.e.rangInternat - b.e.rangInternat || a.e.gCnCod - b.e.gCnCod || a.e.gTaCod - b.e.gTaCod;

function nbPlacesVacantesGroupe(g: Groupe) {
  return Math.max(0, g.e.nbRecrutementsSouhaite - g.affectes.size);
}
function nbPlacesVacantesInternat(i: Internat) {
  return Math.max(0, i.e.capacite - i.affectes.size);
}
const internatDejaObtenu = (v: Voeu) => v.internat !== null && v.internat.affectes.has(v.e.gCnCod);
const formationDejaObtenue = (v: Voeu) => v.groupe.affectes.has(v.e.gCnCod);
const estDesactiveParPositionAdmissionInternat = (v: Voeu) =>
  v.internat !== null && !internatDejaObtenu(v) && v.e.rangInternat > v.internat.positionAdmission;

function proposer(v: Voeu) {
  if (v.statut !== "EN_ATTENTE_DE_PROPOSITION") {
    throw new ErreurVerification("PROPOSITION_IMPOSSIBLE", `Proposition impossible sur ${v.cle}`);
  }
  v.statut = v.repondeurActive ? "REP_AUTO_ACCEPTE" : "PROPOSITION_DU_JOUR";
}

/** GroupeAffectation.mettreAJourPropositions */
function mettreAJourPropositions(g: Groupe) {
  let aPourvoir = nbPlacesVacantesGroupe(g);
  for (const v of g.voeuxEnAttente) v.statut = "EN_ATTENTE_DE_PROPOSITION";
  let dernierCandidatAvecProposition = -1;
  const tries = [...g.voeuxEnAttente].sort(parOrdreAppel);
  for (const v of tries) {
    if (estDesactiveParPositionAdmissionInternat(v)) {
      v.decision = { type: "BLOQUE_INTERNAT", rangInternat: v.e.rangInternat, positionAdmission: v.internat!.positionAdmission };
      continue;
    }
    const avant = aPourvoir;
    let raison: RaisonProposition | null = null;
    if (aPourvoir > 0) raison = "PLACES_VACANTES";
    else if (v.e.ordreAppel <= g.e.rangLimite) raison = "RANG_LIMITE";
    else if (formationDejaObtenue(v)) raison = "FORMATION_DEJA_OBTENUE";
    else if (dernierCandidatAvecProposition === v.e.gCnCod) raison = "MEME_CANDIDAT";
    if (raison) {
      proposer(v);
      if (!formationDejaObtenue(v) && dernierCandidatAvecProposition !== v.e.gCnCod) aPourvoir--;
      dernierCandidatAvecProposition = v.e.gCnCod;
      v.decision = { type: "PROPOSITION", raison, placesRestantesAvant: avant };
    } else {
      v.decision = { type: "PAS_DE_PLACE", placesRestantesAvant: avant };
    }
  }
}

/** GroupeInternat.calculerRangMaximalAdmissionInternatSelonEstimationRangDernierAppele */
function calculerRangMaximalAdmissionInternat(i: Internat, p: Parametres): number {
  if (p.nbJoursCampagne >= p.nbJoursCampagneDateFinReservationInternats) return INT_MAX;
  let compteur = 0;
  let dernierRangEligible = 0;
  const vacantes = nbPlacesVacantesInternat(i);
  for (const v of [...i.voeuxEnAttente].sort(parRangInternat)) {
    if (compteur === vacantes) break;
    const ignorer =
      v.e.ordreAppel > v.groupe.estimation || v.e.rangInternat === dernierRangEligible || internatDejaObtenu(v);
    if (!ignorer) {
      dernierRangEligible = v.e.rangInternat;
      compteur++;
    }
  }
  return dernierRangEligible;
}

/** GroupeInternat.initialiserPositionAdmission */
function initialiserPositionAdmission(i: Internat, p: Parametres) {
  if (p.nbJoursCampagne <= 0) throw new ErreurVerification("DATE_ANTERIEURE", "Le calcul doit être lancé à partir du jour 1.");
  const finReservation = i.voeuxEnAttente.some((v) => v.groupe.e.finReservationInternats);
  i.positionMaximaleAdmission = finReservation ? INT_MAX : calculerRangMaximalAdmissionInternat(i, p);
  i.positionAdmission = i.positionMaximaleAdmission;
  i.estInitialise = true;
}

/** GroupeInternat.mettreAJourPositionAdmission — renvoie le candidat en cause si la barre a baissé */
function mettreAJourPositionAdmission(i: Internat): number | null {
  if (!i.estInitialise) throw new ErreurVerification("INTERNAT_NON_INITIALISE", "Position non initialisée.");
  let compte = 0;
  let dernier = -1;
  for (const v of [...i.voeuxEnAttente].sort(parRangInternat)) {
    if (i.affectes.has(v.e.gCnCod)) continue;
    if (v.e.gCnCod === dernier) continue;
    if (v.e.rangInternat > i.positionAdmission) return null;
    if (estProposition(v.statut)) {
      compte++;
      dernier = v.e.gCnCod;
      if (compte > nbPlacesVacantesInternat(i)) {
        i.positionAdmission = v.e.rangInternat - 1;
        return v.e.gCnCod;
      }
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Répondeur automatique et démissions automatiques GDD               */
/* ------------------------------------------------------------------ */

function refuserParRepondeur(v: Voeu) {
  if (v.e.affecteHorsPP) throw new ErreurVerification("HORS_PP", `Vœu ${v.cle} affecté hors PP non refusable.`);
  if (estProposition(v.statut)) v.statut = "REP_AUTO_REFUS_PROPOSITION";
  else if (!v.repondeurActive) throw new ErreurVerification("REFUS_AUTO_IMPOSSIBLE", `Refus automatique impossible (${v.cle}).`);
  else if (v.statut !== "EN_ATTENTE_DE_PROPOSITION") throw new ErreurVerification("REFUS_AUTO_IMPOSSIBLE", `Refus automatique impossible (${v.cle}).`);
  else v.statut = "REP_AUTO_DEMISSION_ATTENTE";
}

function appliquerRepondeurAutomatique(voeux: Voeu[], ra: Set<number>, ev: EvenementAlgo[]): number {
  if (ra.size === 0) return 0;
  const concernes = voeux.filter(
    (v) => ra.has(v.e.gCnCod) && !v.e.affecteHorsPP && (estEnAttente(v.statut) || estProposition(v.statut)),
  );
  for (const v of concernes) {
    if (estEnAttente(v.statut) && !v.repondeurActive) {
      throw new ErreurVerification("RA_SANS_RANG", `Vœu en attente sans rang de préférence pour un candidat avec répondeur (${v.cle}).`);
    }
  }
  const meilleur = new Map<number, number>();
  for (const v of concernes) {
    if (estPropositionDuJour(v.statut)) {
      meilleur.set(v.e.gCnCod, Math.min(meilleur.get(v.e.gCnCod) ?? INT_MAX, v.e.rangPreferences));
    }
  }
  let places = 0;
  for (const v of concernes) {
    const m = meilleur.get(v.e.gCnCod);
    if (m === undefined) continue;
    if (aEteProposeJoursPrecedents(v.statut) || v.e.rangPreferences > m) {
      if (estProposition(v.statut)) places++;
      refuserParRepondeur(v);
      ev.push({ type: "REPONDEUR", voeu: v.cle, nouveauStatut: v.statut, rangMeilleureProposition: m });
    }
  }
  return places;
}

function refuserParDemissionGDD(v: Voeu) {
  const s = v.statut;
  if (!estPropositionDuJour(s) && !estEnAttente(s) && s !== "PROPOSITION_JOURS_PRECEDENTS_EN_ATTENTE_DE_REPONSE_DU_CANDIDAT") {
    throw new ErreurVerification("GDD_NON_REFUSABLE", `Vœu ${v.cle} non refusable automatiquement.`);
  } else if (!aEteProposeJoursPrecedents(s) && v.e.rangPreferences <= 0) {
    throw new ErreurVerification("GDD_SANS_RANG", `Vœu ${v.cle} sans rang non refusable automatiquement.`);
  } else if (v.repondeurActive) {
    throw new ErreurVerification("GDD_AVEC_RA", `Vœu ${v.cle} avec répondeur non refusable par la démission GDD.`);
  } else if (estEnAttente(s)) {
    v.statut = "DEMISSION_AUTO_VOEU_ORDONNE_EN_ATTENTE";
  } else {
    v.statut = "DEMISSION_AUTO_VOEU_ORDONNE_PROPOSITION_EN_ATTENTE_REP";
  }
}

function appliquerDemissionAutoGDD(voeux: Voeu[], ra: Set<number>, ev: EvenementAlgo[]): number {
  const meilleur = new Map<number, number>();
  for (const v of voeux) {
    if (estPropositionDuJour(v.statut) && v.e.rangPreferences > 0 && !ra.has(v.e.gCnCod)) {
      meilleur.set(v.e.gCnCod, Math.min(meilleur.get(v.e.gCnCod) ?? INT_MAX, v.e.rangPreferences));
    }
  }
  let places = 0;
  for (const v of voeux) {
    const m = meilleur.get(v.e.gCnCod) ?? INT_MAX;
    if (
      v.e.rangPreferences > m &&
      (estEnAttente(v.statut) ||
        estPropositionDuJour(v.statut) ||
        (v.statut === "PROPOSITION_JOURS_PRECEDENTS_EN_ATTENTE_DE_REPONSE_DU_CANDIDAT" && !v.e.affecteHorsPP))
    ) {
      if (estProposition(v.statut)) places++;
      refuserParDemissionGDD(v);
      ev.push({ type: "DEMISSION_GDD", voeu: v.cle, nouveauStatut: v.statut, rangMeilleureProposition: m });
    }
  }
  return places;
}

/* ------------------------------------------------------------------ */
/* Vérification d'intégrité des entrées (VerificationEntreeAlgoPropositions, extraits) */
/* ------------------------------------------------------------------ */

function verifierIntegrite(groupes: Groupe[], internats: Internat[]) {
  for (const g of groupes) {
    const ordreVersCandidat = new Map<number, number>();
    const candidatVersOrdre = new Map<number, number>();
    for (const v of g.voeuxEnAttente) {
      const c = ordreVersCandidat.get(v.e.ordreAppel);
      if (c === undefined) ordreVersCandidat.set(v.e.ordreAppel, v.e.gCnCod);
      else if (c !== v.e.gCnCod) throw new ErreurVerification("INTEGRITE_C", `Deux candidats ont le même rang d'appel dans le groupe ${g.cle}.`);
      const o = candidatVersOrdre.get(v.e.gCnCod);
      if (o === undefined) candidatVersOrdre.set(v.e.gCnCod, v.e.ordreAppel);
      else if (o !== v.e.ordreAppel) throw new ErreurVerification("INTEGRITE_D", `Le candidat ${v.e.gCnCod} a deux rangs dans le groupe ${g.cle}.`);
      if (v.e.ordreAppel <= 0) throw new ErreurVerification("INTEGRITE_E", `Rang d'appel nul ou négatif dans le groupe ${g.cle}.`);
    }
  }
  for (const i of internats) {
    const rangVersCandidat = new Map<number, number>();
    const candidatVersRang = new Map<number, number>();
    for (const v of i.voeuxEnAttente) {
      if (v.e.rangInternat <= 0) throw new ErreurVerification("INTEGRITE_E", `Classement internat nul ou négatif (${i.cle}).`);
      const c = rangVersCandidat.get(v.e.rangInternat);
      if (c === undefined) rangVersCandidat.set(v.e.rangInternat, v.e.gCnCod);
      else if (c !== v.e.gCnCod) throw new ErreurVerification("INTEGRITE_C", `Deux candidats ont le même rang à l'internat ${i.cle}.`);
      const r = candidatVersRang.get(v.e.gCnCod);
      if (r === undefined) candidatVersRang.set(v.e.gCnCod, v.e.rangInternat);
      else if (r !== v.e.rangInternat) throw new ErreurVerification("INTEGRITE_D", `Le candidat ${v.e.gCnCod} a deux rangs à l'internat ${i.cle}.`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* Boucle principale (AlgoPropositions.calcule)                        */
/* ------------------------------------------------------------------ */

export function calculerPropositions(entree: EntreePropositions): SortiePropositions {
  const p = entree.parametres;
  const evenements: EvenementAlgo[] = [];
  const groupes = new Map<string, Groupe>();
  for (const ge of entree.groupes) {
    if (ge.nbRecrutementsSouhaite < 0 || ge.rangLimite < 0 || ge.rangDernierAppeleActuellement < 0) {
      throw new ErreurVerification("GROUPE_INCOHERENT", `Paramètres incohérents pour le groupe ${cleGroupe(ge)}.`);
    }
    const cle = cleGroupe(ge);
    if (groupes.has(cle)) throw new ErreurVerification("GROUPE_DUPLIQUE", `Groupe ${cle} dupliqué.`);
    groupes.set(cle, {
      cle,
      e: ge,
      estimation: calculerEstimationRangDernierAppele(ge.rangDernierAppeleActuellement, ge.rangDernierAppeleReference, ge.rangLimite, p),
      voeuxEnAttente: [],
      affectes: new Set(),
    });
  }
  const internats = new Map<string, Internat>();
  for (const ie of entree.internats) {
    if (ie.capacite < 0) throw new ErreurVerification("CAPACITE_NEGATIVE", `Capacité négative pour l'internat ${cleInternat(ie.id)}.`);
    const cle = cleInternat(ie.id);
    if (internats.has(cle)) throw new ErreurVerification("INTERNAT_DUPLIQUE", `Internat ${cle} dupliqué.`);
    internats.set(cle, { cle, e: ie, positionAdmission: 0, positionMaximaleAdmission: 0, estInitialise: false, voeuxEnAttente: [], affectes: new Set() });
  }
  const voeux: Voeu[] = [];
  const vus = new Set<string>();
  for (const ve of entree.voeux) {
    const cle = cleVoeu(ve);
    if (vus.has(cle)) throw new ErreurVerification("VOEU_DUPLIQUE", `Vœu ${cle} dupliqué.`);
    vus.add(cle);
    const groupe = groupes.get(cleGroupe(ve));
    if (!groupe) throw new ErreurVerification("GROUPE_INCONNU", `Groupe inconnu pour le vœu ${cle}.`);
    let internat: Internat | null = null;
    if (ve.internat) {
      internat = internats.get(cleInternat(ve.internat)) ?? null;
      if (!internat) throw new ErreurVerification("INTERNAT_INCONNU", `Internat inconnu pour le vœu ${cle}.`);
    }
    if (ve.affecteHorsPP && !aEteProposeJoursPrecedents(ve.statut)) {
      throw new ErreurVerification("HORS_PP", `Statut incohérent pour le vœu affecté hors PP ${cle}.`);
    }
    if (ve.ordreAppel < 0 || ve.rangPreferences < 0 || ve.rangInternat < 0) {
      throw new ErreurVerification("RANGS_NEGATIFS", `Rangs négatifs pour le vœu ${cle}.`);
    }
    if (ve.ordreAppel === 0 && !aEteProposeJoursPrecedents(ve.statut) && ve.statut !== "NON_CLASSE") {
      throw new ErreurVerification("ORDRE_APPEL_MANQUANT", `Ordre d'appel manquant pour le vœu ${cle}.`);
    }
    voeux.push({ cle, e: ve, statut: ve.statut, repondeurActive: false, groupe, internat });
  }
  const ra = new Set(entree.candidatsAvecRepondeurAutomatique);

  let iteration = 0;
  let placesLibereesTotal = 0;
  for (;;) {
    iteration++;
    evenements.push({ type: "ITERATION", iteration });

    /* preparerGroupes */
    for (const g of groupes.values()) {
      g.voeuxEnAttente = [];
      g.affectes.clear();
    }
    for (const i of internats.values()) {
      i.voeuxEnAttente = [];
      i.affectes.clear();
      i.estInitialise = false;
    }
    for (const v of voeux) {
      v.repondeurActive = v.e.rangPreferences > 0 && ra.has(v.e.gCnCod);
      if (estEnAttente(v.statut)) {
        v.groupe.voeuxEnAttente.push(v);
        v.internat?.voeuxEnAttente.push(v);
      }
      if (estProposition(v.statut)) {
        v.groupe.affectes.add(v.e.gCnCod);
        v.internat?.affectes.add(v.e.gCnCod);
      }
    }
    verifierIntegrite([...groupes.values()], [...internats.values()]);

    /* calculerNouvellesPropositions */
    let aMettreAJour = [...groupes.values()].filter((g) => !g.e.admStop);
    for (const g of groupes.values()) if (g.e.admStop) for (const v of g.voeuxEnAttente) v.decision = { type: "GROUPE_ARRETE" };
    for (const i of internats.values()) {
      initialiserPositionAdmission(i, p);
      evenements.push({ type: "INIT_INTERNAT", internat: i.cle, positionMaximaleAdmission: i.positionMaximaleAdmission, placesVacantes: nbPlacesVacantesInternat(i) });
    }
    let passe = 0;
    while (aMettreAJour.length > 0) {
      passe++;
      evenements.push({ type: "PASSE_GROUPES", iteration, passe, groupes: aMettreAJour.map((g) => g.cle) });
      for (const g of aMettreAJour) mettreAJourPropositions(g);
      const suivants = new Set<Groupe>();
      for (const i of internats.values()) {
        const ancienne = i.positionAdmission;
        const enCause = mettreAJourPositionAdmission(i);
        if (enCause !== null) {
          evenements.push({ type: "BARRE_INTERNAT_ABAISSEE", internat: i.cle, ancienne, nouvelle: i.positionAdmission, candidatEnCause: enCause });
          for (const v of i.voeuxEnAttente) if (!v.groupe.e.admStop) suivants.add(v.groupe);
        }
      }
      aMettreAJour = [...suivants];
    }

    let placesGDD = 0;
    if (p.nbJoursCampagne >= p.nbJoursCampagneDateDebutGDD) placesGDD = appliquerDemissionAutoGDD(voeux, ra, evenements);
    const placesRA = appliquerRepondeurAutomatique(voeux, ra, evenements);
    placesLibereesTotal += placesGDD + placesRA;
    if (placesRA === 0 && placesGDD === 0) break;
  }
  evenements.push({ type: "FIN", iterations: iteration, placesLibereesTotal });

  return {
    voeux: voeux.map((v) => ({ ...v.e, cle: v.cle, statut: v.statut, repondeurActive: v.repondeurActive, decision: v.decision })),
    internats: [...internats.values()].map((i) => ({
      id: i.e.id,
      cle: i.cle,
      capacite: i.e.capacite,
      positionAdmission: i.positionAdmission,
      positionMaximaleAdmission: i.positionMaximaleAdmission,
    })),
    groupes: [...groupes.values()].map((g) => ({
      cle: g.cle,
      cGpCod: g.e.cGpCod,
      gTiCod: g.e.gTiCod,
      gTaCod: g.e.gTaCod,
      estimationRangDernierAppele: g.estimation,
      nbRecrutementsSouhaite: g.e.nbRecrutementsSouhaite,
    })),
    evenements,
  };
}

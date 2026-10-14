/**
 * Exemple de l'annexe A de la présentation officielle (mai 2023) : formation de
 * 6 places, internat de 4 places, 10 candidats. Le résultat final et la suite des
 * barres internat proviennent du moteur de référence ; chaque passe intermédiaire
 * est reconstituée avec la règle de GroupeAffectation.mettreAJourPropositions
 * (cohérence vérifiée par tests/unit/schemas.test.ts).
 */
import { calculerPropositions, INT_MAX, type EntreePropositions, type VoeuEntree } from "@/algorithmes/reference/propositions";

export const SANS_INTERNAT = new Set([1, 2, 5, 7, 9, 10]);
export const CLASSEMENT_INTERNAT = [7, 4, 10, 1, 5, 9, 6, 3, 8, 2];
export const PLACES_FORMATION = 6;
export const PLACES_INTERNAT = 4;
export const rangInternat = (c: number) => CLASSEMENT_INTERNAT.indexOf(c) + 1;

export function entreeAnnexeA(): EntreePropositions {
  const internat = { cGiCod: 1, gTiCod: 0, gTaCod: 1 };
  const voeux: VoeuEntree[] = [];
  for (let c = 1; c <= 10; c++) {
    const base = { gCnCod: c, cGpCod: 1, gTiCod: 1, gTaCod: 1, ordreAppel: c, rangPreferences: 0, statut: "EN_ATTENTE_DE_PROPOSITION" as const, affecteHorsPP: false };
    voeux.push({ ...base, avecInternat: true, internat, rangInternat: rangInternat(c) });
    if (SANS_INTERNAT.has(c)) voeux.push({ ...base, avecInternat: false, internat: null, rangInternat: 0 });
  }
  return {
    parametres: { nbJoursCampagne: 20, nbJoursCampagneDateFinReservationInternats: 10, nbJoursCampagneDateDebutGDD: 90, nbJoursCampagneDateFinOrdonnancementGDD: 90 },
    groupes: [{ cGpCod: 1, gTiCod: 1, gTaCod: 1, nbRecrutementsSouhaite: PLACES_FORMATION, rangLimite: 0, rangDernierAppeleActuellement: 0, rangDernierAppeleReference: 0, finReservationInternats: false, admStop: false }],
    internats: [{ id: internat, capacite: PLACES_INTERNAT }],
    voeux,
    candidatsAvecRepondeurAutomatique: [],
  };
}

export type EtatVoeuInternat = "absent" | "propose" | "bloque" | "attente";

export interface LignePasse {
  candidat: number;
  sans: EtatVoeuInternat;
  avec: EtatVoeuInternat;
}

export interface Passe {
  barre: number;
  lignes: LignePasse[];
  internatsProposes: number[];
  /** candidat dont le rang internat provoque la surcapacité, s'il y en a */
  enCause: number | null;
  barreSuivante: number | null;
  dernierAppele: number;
}

function calculerPasse(barre: number): Omit<Passe, "barreSuivante"> {
  let places = PLACES_FORMATION;
  let dernierCandidat = -1;
  let dernierAppele = 0;
  const lignes: LignePasse[] = [];
  for (let c = 1; c <= 10; c++) {
    const l: LignePasse = { candidat: c, sans: SANS_INTERNAT.has(c) ? "attente" : "absent", avec: "attente" };
    /* vœu avec internat puis vœu sans internat (même rang d'appel) */
    for (const avec of [true, false]) {
      if (!avec && !SANS_INTERNAT.has(c)) continue;
      if (avec && rangInternat(c) > barre) {
        l.avec = "bloque";
        continue;
      }
      if (places > 0 || dernierCandidat === c) {
        if (dernierCandidat !== c) places--;
        dernierCandidat = c;
        dernierAppele = c;
        if (avec) l.avec = "propose";
        else l.sans = "propose";
      }
    }
    lignes.push(l);
  }
  const internatsProposes = lignes.filter((l) => l.avec === "propose").map((l) => l.candidat).sort((a, b) => rangInternat(a) - rangInternat(b));
  const enCause = internatsProposes.length > PLACES_INTERNAT ? internatsProposes[PLACES_INTERNAT]! : null;
  return { barre, lignes, internatsProposes, enCause, dernierAppele };
}

function construire() {
  const sortie = calculerPropositions(entreeAnnexeA());
  const barres = [INT_MAX, ...sortie.evenements.flatMap((e) => (e.type === "BARRE_INTERNAT_ABAISSEE" ? [e.nouvelle] : []))];
  const passes: Passe[] = barres.map((b, i) => ({ ...calculerPasse(b), barreSuivante: barres[i + 1] ?? null }));
  return { passes, sortie };
}

export const ANNEXE_A = construire();

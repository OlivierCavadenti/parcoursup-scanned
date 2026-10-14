/**
 * Scénario fictif « une formation, plusieurs jours » : les propositions de chaque
 * jour sont calculées par le moteur de référence (portage conforme v2024-2) ;
 * seules les réponses des candidats sont scriptées.
 */
import { calculerPropositions, type Decision, type StatutVoeu, type VoeuEntree } from "@/algorithmes/reference/propositions";

export type EtatLigne = "attente" | "proposition" | "acceptee" | "refusee" | "partie";

export interface Ligne {
  id: number;
  nom: string;
  rangAppel: number;
  etat: EtatLigne;
  nouveau: boolean;
  positionAttente: number | null;
  decision?: Decision;
}

export interface EtapeProp {
  jour: number;
  phase: "depart" | "calcul" | "reponses";
  titre: string;
  texte: string;
  lignes: Ligne[];
  placesSouhaitees: number;
  placesLibresAvantCalcul: number | null;
  rangDernierAppele: number;
}

const NOMS = ["Adam", "Lina", "Yanis", "Chloé", "Rayan", "Manon", "Ethan", "Sarah", "Nolan", "Léna", "Tom", "Maëlys"];
export const CAPACITE = 4;

type Reponse = { id: number; action: "accepte" | "refuse" | "part" };
const REPONSES: Record<number, { texte: string; actions: Reponse[] }> = {
  1: {
    texte: "Lina refuse (elle préfère une autre formation). Adam et Yanis acceptent. Chloé ne répond pas encore : sa proposition reste « en attente de réponse » et occupe une place.",
    actions: [{ id: 2, action: "refuse" }, { id: 1, action: "accepte" }, { id: 3, action: "accepte" }],
  },
  2: {
    texte: "Chloé finit par refuser. Rayan accepte. Ethan, en liste d'attente, renonce à ce vœu : tous ceux qui le suivaient gagnent une position.",
    actions: [{ id: 4, action: "refuse" }, { id: 5, action: "accepte" }, { id: 7, action: "part" }],
  },
  3: {
    texte: "Manon refuse à son tour. Une nouvelle place se libère.",
    actions: [{ id: 6, action: "refuse" }],
  },
};

function construire(): EtapeProp[] {
  const etats = new Map<number, EtatLigne>(NOMS.map((_, i) => [i + 1, "attente"]));
  const etapes: EtapeProp[] = [];
  let dernier = 0;
  let decisions = new Map<number, Decision | undefined>();
  let nouveaux = new Set<number>();

  const photo = (jour: number, phase: EtapeProp["phase"], titre: string, texte: string, placesLibres: number | null): EtapeProp => {
    let pos = 0;
    return {
      jour,
      phase,
      titre,
      texte,
      placesSouhaitees: CAPACITE,
      placesLibresAvantCalcul: placesLibres,
      rangDernierAppele: dernier,
      lignes: NOMS.map((nom, i) => {
        const id = i + 1;
        const etat = etats.get(id)!;
        return { id, nom, rangAppel: id, etat, nouveau: nouveaux.has(id), positionAttente: etat === "attente" ? ++pos : null, decision: decisions.get(id) };
      }),
    };
  };

  etapes.push(photo(0, "depart", "L'ordre d'appel", "Douze candidats fictifs, déjà rangés dans l'ordre d'appel d'une formation de 4 places. Personne n'a encore de proposition.", null));

  for (let jour = 1; jour <= 4; jour++) {
    const statut = (e: EtatLigne): StatutVoeu | null =>
      e === "attente" ? "EN_ATTENTE_DE_PROPOSITION" : e === "proposition" ? "PROPOSITION_JOURS_PRECEDENTS_EN_ATTENTE_DE_REPONSE_DU_CANDIDAT" : e === "acceptee" ? "PROPOSITION_JOURS_PRECEDENTS_ACCEPTEE" : null;
    const voeux: VoeuEntree[] = [];
    for (const [id, e] of etats) {
      const st = statut(e);
      if (st) voeux.push({ gCnCod: id, cGpCod: 1, gTiCod: 1, gTaCod: 1, avecInternat: false, internat: null, ordreAppel: id, rangInternat: 0, rangPreferences: 0, statut: st, affecteHorsPP: false });
    }
    const occupees = [...etats.values()].filter((e) => e === "proposition" || e === "acceptee").length;
    const sortie = calculerPropositions({
      parametres: { nbJoursCampagne: jour, nbJoursCampagneDateFinReservationInternats: 1, nbJoursCampagneDateDebutGDD: 99, nbJoursCampagneDateFinOrdonnancementGDD: 99 },
      groupes: [{ cGpCod: 1, gTiCod: 1, gTaCod: 1, nbRecrutementsSouhaite: CAPACITE, rangLimite: 0, rangDernierAppeleActuellement: dernier, rangDernierAppeleReference: 0, finReservationInternats: false, admStop: false }],
      internats: [],
      voeux,
      candidatsAvecRepondeurAutomatique: [],
    });
    nouveaux = new Set();
    decisions = new Map();
    for (const v of sortie.voeux) {
      decisions.set(v.gCnCod, v.decision);
      if (v.statut === "PROPOSITION_DU_JOUR") {
        etats.set(v.gCnCod, "proposition");
        nouveaux.add(v.gCnCod);
        dernier = Math.max(dernier, v.ordreAppel);
      }
    }
    const recus = [...nouveaux].map((id) => NOMS[id - 1]).join(", ");
    etapes.push(
      photo(
        jour,
        "calcul",
        `Jour ${jour} · calcul des propositions`,
        nouveaux.size
          ? `${CAPACITE - occupees} place(s) à pourvoir (${CAPACITE} − ${occupees} proposition(s) déjà en cours ou acceptées). On descend dans l'ordre d'appel : ${recus} ${nouveaux.size > 1 ? "reçoivent" : "reçoit"} une proposition.`
          : "Aucune place libre : personne de nouveau n'est appelé.",
        CAPACITE - occupees,
      ),
    );
    const rep = REPONSES[jour];
    if (rep) {
      nouveaux = new Set();
      for (const a of rep.actions) etats.set(a.id, a.action === "accepte" ? "acceptee" : a.action === "refuse" ? "refusee" : "partie");
      etapes.push(photo(jour, "reponses", `Jour ${jour} · réponses des candidats`, rep.texte, null));
    }
  }
  return etapes;
}

export const ETAPES_PROPOSITIONS = construire();

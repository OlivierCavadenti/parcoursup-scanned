/**
 * Calcul de l'ordre d'appel — portage TypeScript fidèle.
 *
 * Source officielle : fr.parcoursup.algos.ordreappel.algo.GroupeClassement
 * (méthodes calculerOrdreAppel et selectionnerMeilleurVoeu), dépôt
 * « algorithmes-de-parcoursup », version Maven 2024-2 (commit 8c406bf du
 * 12/06/2024), licence AGPL-3.0. Voir docs/research/algorithms.md.
 *
 * Fidélité : conforme — validé par comparaison différentielle avec le code
 * Java officiel (tests/conformance/ordre-appel.test.ts).
 *
 * En plus du résultat, la fonction produit une trace pas à pas utilisée par le
 * débogueur pédagogique : chaque étape correspond exactement à une itération
 * de la boucle « while » du code officiel.
 */

export type TypeCandidat =
  | "BOURSIER_DU_SECTEUR"
  | "BOURSIER_HORS_SECTEUR"
  | "NON_BOURSIER_DU_SECTEUR"
  | "NON_BOURSIER_HORS_SECTEUR";

/** Ordre de l'énumération Java (EnumMap itère dans cet ordre). */
export const TYPES_CANDIDAT: readonly TypeCandidat[] = [
  "BOURSIER_DU_SECTEUR",
  "BOURSIER_HORS_SECTEUR",
  "NON_BOURSIER_DU_SECTEUR",
  "NON_BOURSIER_HORS_SECTEUR",
];

export interface VoeuClasse {
  /** identifiant du candidat (G_CN_COD) */
  candidat: number;
  /** rang dans le classement pédagogique transmis par la commission (> 0, unique) */
  rang: number;
  boursier: boolean;
  duSecteur: boolean;
}

export interface GroupeClassement {
  id: number;
  /** taux minimum de boursiers, en pourcents (0 à 100) */
  tauxMinBoursiersPourcents: number;
  /** taux minimum de candidats du secteur, en pourcents (0 à 100) — interprétation du taux maximum de non-résidents */
  tauxMinDuSecteurPourcents: number;
  voeux: VoeuClasse[];
}

export interface VoeuAppele extends VoeuClasse {
  rangAppel: number;
  type: TypeCandidat;
}

/** Règle effectivement appliquée pour choisir le candidat à une étape. */
export type RegleChoix =
  | "AUCUNE_CONTRAINTE"
  | "CONTRAINTE_BOURSIERS"
  | "CONTRAINTE_SECTEUR"
  | "DEUX_CONTRAINTES"
  | "CONFLIT_PRIORITE_BOURSIERS";

export interface EtapeOrdreAppel {
  /** position k (1-indexée) attribuée à l'issue de l'étape */
  k: number;
  nbAppelesAvant: number;
  nbBoursiersAppelesAvant: number;
  nbDuSecteurAppelesAvant: number;
  contrainteTauxBoursier: boolean;
  contrainteTauxSecteur: boolean;
  /** têtes des quatre files au moment du choix */
  tetes: Partial<Record<TypeCandidat, VoeuClasse>>;
  /** candidats éligibles (têtes satisfaisant toutes les contraintes actives) */
  eligibles: number[];
  choisi: VoeuClasse;
  regle: RegleChoix;
}

export class ErreurVerification extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = "ErreurVerification";
  }
}

export function typeCandidat(v: Pick<VoeuClasse, "boursier" | "duSecteur">): TypeCandidat {
  if (v.boursier) return v.duSecteur ? "BOURSIER_DU_SECTEUR" : "BOURSIER_HORS_SECTEUR";
  return v.duSecteur ? "NON_BOURSIER_DU_SECTEUR" : "NON_BOURSIER_HORS_SECTEUR";
}

/** Vérifications d'entrée (GroupeClassement.verifierCoherenceTaux / verifierRangs). */
export function verifierEntreeOrdreAppel(g: GroupeClassement): void {
  const tauxOk = (t: number) => Number.isInteger(t) && t >= 0 && t <= 100;
  if (!tauxOk(g.tauxMinBoursiersPourcents)) {
    throw new ErreurVerification("TAUX_BOURSIER", "Le taux minimum de boursiers doit être un entier entre 0 et 100.");
  }
  if (!tauxOk(g.tauxMinDuSecteurPourcents)) {
    throw new ErreurVerification("TAUX_SECTEUR", "Le taux de candidats du secteur doit être un entier entre 0 et 100.");
  }
  const vus = new Set<number>();
  const candidats = new Set<number>();
  for (const v of g.voeux) {
    if (!Number.isInteger(v.rang) || v.rang <= 0) {
      throw new ErreurVerification("RANG_INVALIDE", `Rang invalide (${v.rang}) pour le candidat ${v.candidat}.`);
    }
    if (vus.has(v.rang)) {
      throw new ErreurVerification("RANG_DUPLIQUE", `Deux candidats ont le même rang de classement (${v.rang}).`);
    }
    if (candidats.has(v.candidat)) {
      throw new ErreurVerification("CANDIDAT_DUPLIQUE", `Le candidat ${v.candidat} apparaît deux fois.`);
    }
    vus.add(v.rang);
    candidats.add(v.candidat);
  }
}

export interface ResultatOrdreAppel {
  ordre: VoeuAppele[];
  etapes: EtapeOrdreAppel[];
}

/**
 * Calcule l'ordre d'appel d'un groupe de classement.
 * @param avecTrace si faux, n'enregistre pas les étapes (grands volumes)
 */
export function calculerOrdreAppel(g: GroupeClassement, avecTrace = true): ResultatOrdreAppel {
  verifierEntreeOrdreAppel(g);

  /* tri par rang de classement, les mieux classés en tête */
  const voeux = [...g.voeux].sort((a, b) => a.rang - b.rang);

  /* une file FIFO par type de candidat, chacune ordonnée par rang */
  const files: Record<TypeCandidat, VoeuClasse[]> = {
    BOURSIER_DU_SECTEUR: [],
    BOURSIER_HORS_SECTEUR: [],
    NON_BOURSIER_DU_SECTEUR: [],
    NON_BOURSIER_HORS_SECTEUR: [],
  };
  const tetesIdx: Record<TypeCandidat, number> = {
    BOURSIER_DU_SECTEUR: 0,
    BOURSIER_HORS_SECTEUR: 0,
    NON_BOURSIER_DU_SECTEUR: 0,
    NON_BOURSIER_HORS_SECTEUR: 0,
  };
  let nbBoursiersTotal = 0;
  let nbDuSecteurTotal = 0;
  for (const v of voeux) {
    files[typeCandidat(v)].push(v);
    if (v.boursier) nbBoursiersTotal++;
    if (v.duSecteur) nbDuSecteurTotal++;
  }
  const tete = (t: TypeCandidat): VoeuClasse | undefined => files[t][tetesIdx[t]];

  let nbAppeles = 0;
  let nbBoursiersAppeles = 0;
  let nbDuSecteurAppeles = 0;
  const ordre: VoeuAppele[] = [];
  const etapes: EtapeOrdreAppel[] = [];

  while (ordre.length < voeux.length) {
    /* lequel ou lesquels des critères contraignent le choix du prochain candidat */
    const contrainteTauxBoursier =
      nbBoursiersAppeles < nbBoursiersTotal &&
      nbBoursiersAppeles * 100 < g.tauxMinBoursiersPourcents * (1 + nbAppeles);
    const contrainteTauxSecteur =
      nbDuSecteurAppeles < nbDuSecteurTotal &&
      nbDuSecteurAppeles * 100 < g.tauxMinDuSecteurPourcents * (1 + nbAppeles);

    /* candidats en tête de file satisfaisant les contraintes actives */
    let meilleur: VoeuClasse | undefined;
    const eligibles: number[] = [];
    for (const t of TYPES_CANDIDAT) {
      const v = tete(t);
      if (!v) continue;
      if ((v.boursier || !contrainteTauxBoursier) && (v.duSecteur || !contrainteTauxSecteur)) {
        eligibles.push(v.candidat);
        if (!meilleur || v.rang < meilleur.rang) meilleur = v;
      }
    }

    let regle: RegleChoix;
    if (meilleur) {
      regle =
        contrainteTauxBoursier && contrainteTauxSecteur
          ? "DEUX_CONTRAINTES"
          : contrainteTauxBoursier
            ? "CONTRAINTE_BOURSIERS"
            : contrainteTauxSecteur
              ? "CONTRAINTE_SECTEUR"
              : "AUCUNE_CONTRAINTE";
    } else {
      /* Aucun candidat ne satisfait les deux contraintes à la fois : il ne reste
         plus de boursier du secteur. Le taux boursier prime (loi du 8 mars 2018) :
         on prend le premier boursier hors secteur. */
      if (!(contrainteTauxBoursier && contrainteTauxSecteur)) {
        throw new Error("Invariant violé : aucune contrainte active mais aucun éligible");
      }
      meilleur = tete("BOURSIER_HORS_SECTEUR");
      if (!meilleur || tete("BOURSIER_DU_SECTEUR")) {
        throw new Error("Invariant violé : il doit rester un boursier hors secteur et aucun boursier du secteur");
      }
      regle = "CONFLIT_PRIORITE_BOURSIERS";
    }

    if (avecTrace) {
      const tetes: Partial<Record<TypeCandidat, VoeuClasse>> = {};
      for (const t of TYPES_CANDIDAT) {
        const v = tete(t);
        if (v) tetes[t] = v;
      }
      etapes.push({
        k: nbAppeles + 1,
        nbAppelesAvant: nbAppeles,
        nbBoursiersAppelesAvant: nbBoursiersAppeles,
        nbDuSecteurAppelesAvant: nbDuSecteurAppeles,
        contrainteTauxBoursier,
        contrainteTauxSecteur,
        tetes,
        eligibles,
        choisi: meilleur,
        regle,
      });
    }

    /* retrait de la tête de file et ajout à l'ordre d'appel */
    const t = typeCandidat(meilleur);
    tetesIdx[t]++;
    nbAppeles++;
    if (meilleur.boursier) nbBoursiersAppeles++;
    if (meilleur.duSecteur) nbDuSecteurAppeles++;
    ordre.push({ ...meilleur, rangAppel: nbAppeles, type: t });
  }

  return { ordre, etapes };
}

/**
 * Fonctions pures de la chaîne de données (testées par tests/unit/donnees.test.ts).
 */

/** Analyse un CSV (séparateur « ; » par défaut) en respectant les guillemets. */
export function parserCSV(texte, sep = ";") {
  const lignes = [];
  let ligne = [];
  let champ = "";
  let guillemets = false;
  for (let i = 0; i < texte.length; i++) {
    const c = texte[i];
    if (guillemets) {
      if (c === '"') {
        if (texte[i + 1] === '"') {
          champ += '"';
          i++;
        } else guillemets = false;
      } else champ += c;
    } else if (c === '"') guillemets = true;
    else if (c === sep) {
      ligne.push(champ);
      champ = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && texte[i + 1] === "\n") i++;
      ligne.push(champ);
      lignes.push(ligne);
      ligne = [];
      champ = "";
    } else champ += c;
  }
  if (champ !== "" || ligne.length) {
    ligne.push(champ);
    lignes.push(ligne);
  }
  if (lignes.length && lignes[0].length && lignes[0][0].charCodeAt(0) === 0xfeff) lignes[0][0] = lignes[0][0].slice(1);
  return lignes.filter((l) => l.length > 1 || (l.length === 1 && l[0] !== ""));
}

export function convertir(valeur, type) {
  if (valeur === undefined || valeur === null) return null;
  const v = String(valeur).trim();
  if (v === "") return null;
  if (type === "texte") return v;
  const n = Number(v.replace(",", "."));
  if (!Number.isFinite(n)) return null;
  if (type === "pourcentage" && (n < 0 || n > 100)) return null;
  return n;
}

/**
 * Normalise des lignes CSV selon la configuration des indicateurs.
 * Retourne les enregistrements (tableaux dans l'ordre des indicateurs) et le rapport de colonnes.
 */
export function normaliser(lignes, config) {
  const [entete, ...donnees] = lignes;
  const index = new Map(entete.map((c, i) => [c.trim().toLowerCase(), i]));
  const correspondance = config.indicateurs.map((ind) => {
    const col = ind.colonnes.find((c) => index.has(c));
    return { ...ind, colonne: col ?? null, i: col ? index.get(col) : -1 };
  });
  const manquants = correspondance.filter((c) => c.colonne === null).map((c) => c.cle);
  const obligatoiresManquants = config.obligatoires.filter((k) => manquants.includes(k));
  const enregistrements = obligatoiresManquants.length
    ? []
    : donnees.map((l) => correspondance.map((c) => (c.i >= 0 ? convertir(l[c.i], c.type) : null)));
  const utilisees = new Set(correspondance.map((c) => c.colonne).filter(Boolean));
  return {
    champs: correspondance.map(({ cle, label, type, colonne }) => ({ cle, label, type, colonne })),
    enregistrements,
    manquants,
    obligatoiresManquants,
    colonnesNonUtilisees: entete.filter((c) => !utilisees.has(c.trim().toLowerCase())),
  };
}

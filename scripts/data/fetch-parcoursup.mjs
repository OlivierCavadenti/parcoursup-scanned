#!/usr/bin/env node
/**
 * Récupère les jeux de données Parcoursup (MESR, data.enseignementsup-recherche.gouv.fr),
 * les valide et les normalise en fichiers JSON statiques pour l'explorateur.
 *
 * Exécuté au déploiement (GitHub Actions). En cas d'échec, écrit un manifeste
 * « echec » avec la raison : le site affiche alors un état explicite, sans
 * aucune donnée inventée.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { normaliser, parserCSV } from "./normaliser.mjs";

const BASE = "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1";
const RACINE = path.resolve("public/data/parcoursup");
const config = JSON.parse(await readFile(path.resolve("src/data/adapters/colonnes.json"), "utf8"));

async function get(url, type = "json") {
  for (let essai = 1; essai <= 3; essai++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": "parcoursup-decrypte (observatoire citoyen)" }, signal: AbortSignal.timeout(180_000) });
      if (r.status === 404) return null;
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return type === "json" ? await r.json() : await r.text();
    } catch (e) {
      if (essai === 3) throw new Error(`${url} : ${e.message}`);
      await new Promise((ok) => setTimeout(ok, 2000 * essai));
    }
  }
}

async function main() {
  await mkdir(RACINE, { recursive: true });
  let catalogue = null;
  try {
    catalogue = await get(`${BASE}/catalog/datasets?where=${encodeURIComponent('search("parcoursup")')}&limit=100`);
  } catch (e) {
    console.warn("Catalogue indisponible, on tente le jeu principal :", e.message);
  }
  const ids = new Set(["fr-esr-parcoursup"]);
  for (const d of catalogue?.results ?? []) if (/^fr-esr-parcoursup([-_]\d{4})?$/.test(d.dataset_id)) ids.add(d.dataset_id);
  console.log("Jeux de données candidats :", [...ids].join(", "));

  const sessions = [];
  const rapports = [];
  for (const id of ids) {
    const meta = await get(`${BASE}/catalog/datasets/${id}`);
    if (!meta) {
      rapports.push({ id, statut: "introuvable" });
      continue;
    }
    const definitions = Object.fromEntries((meta.fields ?? []).map((f) => [f.name, { label: f.label, description: f.description ?? null }]));
    const csv = await get(`${BASE}/catalog/datasets/${id}/exports/csv?delimiter=%3B&lang=fr`, "text");
    if (!csv) {
      rapports.push({ id, statut: "export indisponible" });
      continue;
    }
    const n = normaliser(parserCSV(csv), config);
    const iSession = n.champs.findIndex((c) => c.cle === "session");
    rapports.push({ id, statut: n.obligatoiresManquants.length ? "schema-inattendu" : "ok", lignes: n.enregistrements.length, manquants: n.manquants, colonnesNonUtilisees: n.colonnesNonUtilisees.slice(0, 80), modifie: meta.metas?.default?.modified ?? null });
    if (n.obligatoiresManquants.length) continue;
    const parSession = new Map();
    for (const e of n.enregistrements) {
      const s = String(e[iSession] ?? id.match(/(\d{4})$/)?.[1] ?? "inconnue");
      if (!parSession.has(s)) parSession.set(s, []);
      parSession.get(s).push(e);
    }
    for (const [s, lignes] of parSession) {
      if (sessions.some((x) => x.session === s)) continue; // première source rencontrée conservée
      const champs = n.champs.map((c) => ({ ...c, description: c.colonne ? (definitions[c.colonne]?.description ?? null) : null, labelOfficiel: c.colonne ? (definitions[c.colonne]?.label ?? null) : null }));
      await writeFile(path.join(RACINE, `${s}.json`), JSON.stringify({ session: s, source: id, champs, lignes }));
      sessions.push({ session: s, source: id, lignes: lignes.length, manquants: n.manquants });
      console.log(`Session ${s} (${id}) : ${lignes.length} formations, ${n.manquants.length} indicateur(s) absent(s)`);
    }
  }
  sessions.sort((a, b) => b.session.localeCompare(a.session));
  const manifeste = {
    statut: sessions.length ? "ok" : "echec",
    raison: sessions.length ? null : "Aucun millésime exploitable (voir rapports).",
    genereLe: new Date().toISOString(),
    portail: "https://data.enseignementsup-recherche.gouv.fr/",
    licence: "Licence Ouverte / Open Licence",
    sessions,
    rapports,
  };
  await writeFile(path.join(RACINE, "manifest.json"), JSON.stringify(manifeste, null, 2));
  console.log(`Manifeste : ${manifeste.statut}, ${sessions.length} session(s).`);
}

main().catch(async (e) => {
  console.error("Import impossible :", e.message);
  await mkdir(RACINE, { recursive: true });
  await writeFile(
    path.join(RACINE, "manifest.json"),
    JSON.stringify({ statut: "echec", raison: `Téléchargement impossible : ${e.message}`, genereLe: new Date().toISOString(), portail: "https://data.enseignementsup-recherche.gouv.fr/", sessions: [], rapports: [] }, null, 2),
  );
  process.exitCode = 0; // le site se construit quand même, avec un état explicite
});

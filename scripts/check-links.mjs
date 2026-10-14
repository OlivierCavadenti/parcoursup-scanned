#!/usr/bin/env node
/**
 * Vérifie les liens externes présents dans le site construit (dossier out/).
 * Signale les liens cassés ; code de sortie 1 si au moins un lien est en erreur.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

async function* fichiersHtml(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* fichiersHtml(p);
    else if (e.name.endsWith(".html")) yield p;
  }
}

const liens = new Map();
for await (const f of fichiersHtml(path.resolve("out"))) {
  const html = await readFile(f, "utf8");
  for (const m of html.matchAll(/href="(https?:\/\/[^"#]+)(#[^"]*)?"/g)) {
    const url = m[1].replace(/&amp;/g, "&");
    if (!liens.has(url)) liens.set(url, path.relative("out", f));
  }
}

async function tester(url) {
  for (const methode of ["HEAD", "GET"]) {
    try {
      const r = await fetch(url, { method: methode, redirect: "follow", signal: AbortSignal.timeout(20000), headers: { "user-agent": "parcoursup-decrypte-link-check" } });
      if (r.ok || r.status === 405 || r.status === 403 || r.status === 429) return { ok: r.ok, statut: r.status };
      if (methode === "GET") return { ok: false, statut: r.status };
    } catch (e) {
      if (methode === "GET") return { ok: false, statut: e.message };
    }
  }
}

let erreurs = 0;
const urls = [...liens.keys()];
console.log(`${urls.length} liens externes uniques à vérifier.`);
for (let i = 0; i < urls.length; i += 8) {
  const lot = urls.slice(i, i + 8);
  const res = await Promise.all(lot.map(tester));
  lot.forEach((u, k) => {
    const r = res[k];
    if (!r.ok) {
      erreurs += r.statut === 403 || r.statut === 429 || r.statut === 405 ? 0 : 1;
      console.log(`${r.statut === 403 || r.statut === 429 || r.statut === 405 ? "⚠" : "✗"} ${r.statut} ${u}  (page : ${liens.get(u)})`);
    }
  });
}
console.log(erreurs ? `${erreurs} lien(s) en erreur.` : "Aucun lien cassé détecté.");
process.exitCode = erreurs ? 1 : 0;

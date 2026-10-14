"use client";

import { AnimatePresence, motion } from "motion/react";
import { BarChart3, Check, Database, ExternalLink, Loader2, Plus, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { asset } from "@/lib/site";
import { cn } from "@/lib/cn";

/* ---------- schémas des fichiers produits par scripts/data/fetch-parcoursup.mjs ---------- */
const ManifestSchema = z.object({
  statut: z.enum(["ok", "echec"]),
  raison: z.string().nullable().optional(),
  genereLe: z.string(),
  portail: z.string(),
  sessions: z.array(z.object({ session: z.string(), source: z.string(), lignes: z.number(), manquants: z.array(z.string()) })),
});
type Manifest = z.infer<typeof ManifestSchema>;

const ChampSchema = z.object({
  cle: z.string(),
  label: z.string(),
  type: z.enum(["texte", "nombre", "pourcentage"]),
  colonne: z.string().nullable(),
  description: z.string().nullable().optional(),
  labelOfficiel: z.string().nullable().optional(),
});
type Champ = z.infer<typeof ChampSchema>;
const SessionSchema = z.object({ session: z.string(), source: z.string(), champs: z.array(ChampSchema), lignes: z.array(z.array(z.union([z.string(), z.number(), z.null()]))) });

type Formation = Record<string, string | number | null> & { _i: number };

const INDICATEURS_FICHE = ["capacite", "voeux", "voeuxPP", "classesPP", "propositions", "acceptes", "tauxAcces", "pctBoursiers", "pctFemmes", "pctBG", "pctBT", "pctBP", "rangGrp1", "rangGrp2", "rangGrp3"];

const sansAccents = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const fmt = (v: unknown, type?: Champ["type"]) =>
  v === null || v === undefined || v === "" ? "—" : typeof v === "number" ? (type === "pourcentage" ? `${v.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %` : v.toLocaleString("fr-FR")) : String(v);

export function Explorateur() {
  const [manifest, setManifest] = useState<Manifest | null | "absent">(null);
  const [session, setSession] = useState<string | null>(null);
  const [donnees, setDonnees] = useState<{ champs: Champ[]; formations: Formation[]; source: string } | null>(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [academie, setAcademie] = useState("");
  const [filiere, setFiliere] = useState("");
  const [selectivite, setSelectivite] = useState("");
  const [nb, setNb] = useState(30);
  const [comparaison, setComparaison] = useState<number[]>([]);
  const [fiche, setFiche] = useState<number | null>(null);

  useEffect(() => {
    fetch(asset("/data/parcoursup/manifest.json"))
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("absent"))))
      .then((j) => {
        const m = ManifestSchema.parse(j);
        setManifest(m);
        setSession(m.sessions[0]?.session ?? null);
      })
      .catch(() => setManifest("absent"));
  }, []);

  useEffect(() => {
    if (!session) return;
    setChargement(true);
    setErreur(null);
    fetch(asset(`/data/parcoursup/${session}.json`))
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((j) => {
        const s = SessionSchema.parse(j);
        const formations = s.lignes.map((l, i) => {
          const o: Formation = { _i: i };
          s.champs.forEach((c, k) => (o[c.cle] = l[k] ?? null));
          return o;
        });
        setDonnees({ champs: s.champs, formations, source: s.source });
        setComparaison([]);
        setFiche(null);
      })
      .catch((e: Error) => setErreur(`Impossible de lire les données de la session ${session} (${e.message}).`))
      .finally(() => setChargement(false));
  }, [session]);

  const champ = useCallback((cle: string) => donnees?.champs.find((c) => c.cle === cle), [donnees]);
  const valeurs = (cle: string) => [...new Set((donnees?.formations ?? []).map((f) => f[cle]).filter((v): v is string => typeof v === "string"))].sort((a, b) => a.localeCompare(b, "fr"));

  const resultats = useMemo(() => {
    if (!donnees) return [];
    const mots = sansAccents(q).split(/\s+/).filter(Boolean);
    return donnees.formations
      .filter((f) => (!academie || f.academie === academie) && (!filiere || f.filiere === filiere) && (!selectivite || f.selectivite === selectivite))
      .filter((f) => {
        if (!mots.length) return true;
        const texte = sansAccents([f.formation, f.etab, f.ville, f.detail, f.depLib].filter(Boolean).join(" "));
        return mots.every((m) => texte.includes(m));
      })
      .sort((a, b) => (Number(b.voeux) || 0) - (Number(a.voeux) || 0));
  }, [donnees, q, academie, filiere, selectivite]);

  if (manifest === null) {
    return (
      <div className="flex items-center gap-3 rounded-3xl bg-surface p-8 ring-1 ring-line" role="status">
        <Loader2 className="h-5 w-5 animate-spin text-accent" aria-hidden="true" /> Chargement de l'index des données…
      </div>
    );
  }
  if (manifest === "absent" || manifest.statut !== "ok") {
    return (
      <div className="rounded-[28px] bg-surface p-8 shadow-soft ring-1 ring-line" role="status">
        <Database className="h-8 w-8 text-muted" aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl font-semibold text-ink">Données non importées dans cette version du site</h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-ink-2">
          Les statistiques sont téléchargées depuis le portail officiel au moment du déploiement. Cette fois, l'import n'a pas abouti
          {manifest !== "absent" && manifest.raison ? ` : ${manifest.raison}` : "."} Plutôt que d'afficher des chiffres approximatifs, l'explorateur reste vide.
        </p>
        <a href="https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-parcoursup/" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-2">
          Consulter le jeu de données sur le portail officiel <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    );
  }

  const tauxAcces = resultats.map((f) => f.tauxAcces).filter((v): v is number => typeof v === "number");
  const formationsComparees = comparaison.map((i) => donnees?.formations[i]).filter(Boolean) as Formation[];
  const ficheF = fiche !== null ? donnees?.formations[fiche] : undefined;

  return (
    <div className="space-y-6">
      {/* barre de filtres */}
      <div className="sticky top-16 z-20 -mx-4 bg-bg/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-3xl sm:px-0">
        <div className="grid gap-2 rounded-3xl bg-surface p-3 shadow-soft ring-1 ring-line md:grid-cols-[2fr_repeat(4,1fr)]">
          <label className="relative block">
            <span className="sr-only">Rechercher une formation, un établissement ou une ville</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setNb(30);
              }}
              placeholder="Formation, établissement, ville…"
              className="h-11 w-full rounded-2xl bg-surface-2 pl-10 pr-3 text-ink outline-none ring-1 ring-line placeholder:text-muted focus:ring-2 focus:ring-accent-2"
            />
          </label>
          {[
            { v: session ?? "", set: (x: string) => setSession(x), opts: manifest.sessions.map((s) => s.session), label: "Session", tous: null },
            { v: academie, set: setAcademie, opts: valeurs("academie"), label: "Académie", tous: "Toutes les académies" },
            { v: filiere, set: setFiliere, opts: valeurs("filiere"), label: "Filière", tous: "Toutes les filières" },
            { v: selectivite, set: setSelectivite, opts: valeurs("selectivite"), label: "Sélectivité", tous: "Sélective ou non" },
          ].map((f) => (
            <label key={f.label} className="block">
              <span className="sr-only">{f.label}</span>
              <select
                value={f.v}
                onChange={(e) => {
                  f.set(e.target.value);
                  setNb(30);
                }}
                className="h-11 w-full rounded-2xl bg-surface-2 px-3 text-sm text-ink ring-1 ring-line focus:ring-2 focus:ring-accent-2"
              >
                {f.tous !== null && <option value="">{f.tous}</option>}
                {f.opts.map((o) => (
                  <option key={o} value={o}>
                    {f.label === "Session" ? `Session ${o}` : o}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>

      {erreur && <p className="rounded-2xl bg-rose-soft p-4 text-rose">{erreur}</p>}
      {chargement && (
        <p className="flex items-center gap-2 text-muted" role="status">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Chargement de la session {session}…
        </p>
      )}

      {donnees && (
        <>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="text-ink-2" aria-live="polite">
              <strong className="font-display text-2xl text-ink">{resultats.length.toLocaleString("fr-FR")}</strong> formation(s) · session {session} · source{" "}
              <code className="text-sm">{donnees.source}</code>
            </p>
            {tauxAcces.length > 10 && <Histogramme valeurs={tauxAcces} />}
          </div>

          {formationsComparees.length > 0 && <Comparateur formations={formationsComparees} champ={champ} retirer={(i) => setComparaison((c) => c.filter((x) => x !== i))} />}

          <ul className="grid gap-3 md:grid-cols-2">
            {resultats.slice(0, nb).map((f) => {
              const compare = comparaison.includes(f._i);
              return (
                <li key={f._i} className="flex flex-col rounded-3xl bg-surface p-5 ring-1 ring-line transition hover:shadow-soft">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">{fmt(f.filiere)}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-ink">{fmt(f.formation)}</h3>
                  <p className="text-sm text-ink-2">
                    {fmt(f.etab)} · {fmt(f.ville)}
                  </p>
                  <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {(["capacite", "voeux", "tauxAcces"] as const).map((k) => (
                      <div key={k} className="rounded-xl bg-surface-2 p-2">
                        <dt className="text-[0.68rem] leading-tight text-muted">{k === "capacite" ? "Places" : k === "voeux" ? "Candidats" : "Taux d'accès"}</dt>
                        <dd className="font-semibold tabular-nums text-ink">{fmt(f[k], champ(k)?.type)}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => setFiche(f._i)} className="flex-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-2">
                      Voir la fiche
                    </button>
                    <button
                      type="button"
                      aria-pressed={compare}
                      disabled={!compare && comparaison.length >= 4}
                      onClick={() => setComparaison((c) => (compare ? c.filter((x) => x !== f._i) : [...c, f._i]))}
                      className={cn("inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ring-1 disabled:opacity-40", compare ? "bg-accent-soft text-accent ring-accent/40" : "text-ink-2 ring-line-strong hover:ring-ink/40")}
                    >
                      {compare ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />} Comparer
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          {nb < resultats.length && (
            <div className="text-center">
              <button type="button" onClick={() => setNb((n) => n + 30)} className="rounded-full px-5 py-2.5 font-semibold text-primary ring-1 ring-line-strong hover:bg-surface">
                Afficher 30 formations de plus
              </button>
            </div>
          )}
        </>
      )}

      <AnimatePresence>{ficheF && donnees && <Fiche formation={ficheF} champs={donnees.champs} fermer={() => setFiche(null)} session={session!} />}</AnimatePresence>
    </div>
  );
}

function Histogramme({ valeurs }: { valeurs: number[] }) {
  const classes = Array.from({ length: 10 }, (_, i) => valeurs.filter((v) => (i === 9 ? v >= 90 : v >= i * 10 && v < (i + 1) * 10)).length);
  const max = Math.max(...classes, 1);
  return (
    <figure className="w-full max-w-sm">
      <figcaption className="mb-1 flex items-center gap-1.5 text-xs text-muted">
        <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" /> Répartition du taux d'accès dans la sélection (par tranches de 10 points)
      </figcaption>
      <div className="flex h-16 items-end gap-1" role="img" aria-label={`Histogramme : ${classes.map((c, i) => `${i * 10}–${i * 10 + 10} % : ${c}`).join(", ")}`}>
        {classes.map((c, i) => (
          <motion.div key={i} className="flex-1 rounded-t bg-accent-2" initial={{ height: 0 }} animate={{ height: `${(c / max) * 100}%` }} transition={{ delay: i * 0.03 }} title={`${i * 10}–${i * 10 + 10} % : ${c}`} />
        ))}
      </div>
      <div className="mt-1 flex justify-between font-mono text-[0.65rem] text-muted">
        <span>0 %</span>
        <span>100 %</span>
      </div>
    </figure>
  );
}

function Comparateur({ formations, champ, retirer }: { formations: Formation[]; champ: (k: string) => Champ | undefined; retirer: (i: number) => void }) {
  const lignes = INDICATEURS_FICHE.filter((k) => champ(k)?.colonne);
  return (
    <section aria-labelledby="titre-comparateur" className="overflow-hidden rounded-3xl bg-surface shadow-soft ring-1 ring-line">
      <h2 id="titre-comparateur" className="border-b border-line px-5 py-3 font-display text-xl font-semibold text-ink">
        Comparaison ({formations.length}/4)
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="bg-surface-2 text-left">
              <th scope="col" className="px-4 py-3 font-semibold text-ink">Indicateur</th>
              {formations.map((f) => (
                <th key={f._i} scope="col" className="px-4 py-3 align-top font-semibold text-ink">
                  <span className="line-clamp-2">{fmt(f.formation)}</span>
                  <span className="block text-xs font-normal text-muted">{fmt(f.etab)}</span>
                  <button type="button" onClick={() => retirer(f._i)} className="mt-1 inline-flex items-center gap-1 text-xs text-rose" aria-label={`Retirer ${f.formation} de la comparaison`}>
                    <X className="h-3 w-3" aria-hidden="true" /> retirer
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {lignes.map((k) => (
              <tr key={k}>
                <th scope="row" className="px-4 py-2.5 text-left font-medium text-ink-2">{champ(k)?.labelOfficiel ?? champ(k)?.label}</th>
                {formations.map((f) => (
                  <td key={f._i} className={cn("px-4 py-2.5 tabular-nums", f[k] === null ? "text-muted" : "text-ink")}>
                    {f[k] === null ? "non publié" : fmt(f[k], champ(k)?.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-line px-5 py-3 text-xs text-muted">
        Seuls des indicateurs d'une même session sont comparés. « Non publié » : valeur absente du jeu de données. Aucun score global n'est calculé.
      </p>
    </section>
  );
}

function Fiche({ formation, champs, fermer, session }: { formation: Formation; champs: Champ[]; fermer: () => void; session: string }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && fermer();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [fermer]);
  const bacs = (["pctBG", "pctBT", "pctBP"] as const).map((k) => ({ k, v: formation[k], label: k === "pctBG" ? "Général" : k === "pctBT" ? "Technologique" : "Professionnel" }));
  const capacite = Number(formation.capacite) || 0;
  const entonnoir = (["voeux", "classesPP", "propositions", "acceptes"] as const).map((k) => ({ k, v: typeof formation[k] === "number" ? (formation[k] as number) : null, champ: champs.find((c) => c.cle === k) }));
  const maxE = Math.max(...entonnoir.map((e) => e.v ?? 0), 1);
  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={fermer}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="fiche-titre"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[28px] bg-surface p-6 shadow-float sm:rounded-[28px] sm:p-8"
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              {fmt(formation.filiere)} · session {session}
            </p>
            <h2 id="fiche-titre" className="mt-1 font-display text-3xl font-semibold leading-tight text-ink">
              {fmt(formation.formation)}
            </h2>
            <p className="mt-1 text-ink-2">
              {fmt(formation.etab)} · {fmt(formation.ville)} ({fmt(formation.depLib)}) · académie {fmt(formation.academie)}
            </p>
          </div>
          <button type="button" onClick={fermer} autoFocus className="rounded-full p-2 text-ink-2 hover:bg-surface-2" aria-label="Fermer la fiche">
            <X className="h-5 w-5" />
          </button>
        </div>

        <section className="mt-6" aria-labelledby="entonnoir">
          <h3 id="entonnoir" className="text-sm font-semibold text-ink">
            Du vœu à l'acceptation
          </h3>
          <ul className="mt-3 space-y-2">
            {entonnoir.map((e, i) => (
              <li key={e.k}>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-2">{e.champ?.labelOfficiel ?? e.champ?.label}</span>
                  <span className="font-semibold tabular-nums text-ink">{fmt(e.v)}</span>
                </div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-surface-3">
                  <motion.div className="h-full rounded-full bg-primary-2" initial={{ width: 0 }} animate={{ width: `${((e.v ?? 0) / maxE) * 100}%` }} transition={{ delay: i * 0.08, type: "spring", stiffness: 120, damping: 20 }} />
                </div>
              </li>
            ))}
            {capacite > 0 && <li className="text-xs text-muted">Capacité affichée : {capacite.toLocaleString("fr-FR")} places.</li>}
          </ul>
        </section>

        {bacs.some((b) => typeof b.v === "number") && (
          <section className="mt-6" aria-labelledby="bacs">
            <h3 id="bacs" className="text-sm font-semibold text-ink">
              Type de baccalauréat des admis
            </h3>
            <div className="mt-3 flex h-4 overflow-hidden rounded-full bg-surface-3" role="img" aria-label={bacs.map((b) => `${b.label} : ${fmt(b.v, "pourcentage")}`).join(", ")}>
              {bacs.map((b, i) => (
                <motion.div key={b.k} className={["bg-primary-2", "bg-accent-2", "bg-amber-2"][i]} initial={{ width: 0 }} animate={{ width: `${typeof b.v === "number" ? b.v : 0}%` }} />
              ))}
            </div>
            <ul className="mt-2 flex flex-wrap gap-4 text-xs text-ink-2">
              {bacs.map((b, i) => (
                <li key={b.k} className="flex items-center gap-1.5">
                  <span className={cn("h-2.5 w-2.5 rounded-full", ["bg-primary-2", "bg-accent-2", "bg-amber-2"][i])} /> {b.label} : {fmt(b.v, "pourcentage")}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-6" aria-labelledby="indicateurs">
          <h3 id="indicateurs" className="text-sm font-semibold text-ink">
            Tous les indicateurs publiés et leur définition
          </h3>
          <dl className="mt-3 divide-y divide-line rounded-2xl ring-1 ring-line">
            {INDICATEURS_FICHE.map((k) => champs.find((c) => c.cle === k)).filter((c): c is Champ => !!c && !!c.colonne).map((c) => (
              <div key={c.cle} className="grid gap-1 px-4 py-3 sm:grid-cols-[1fr_auto]">
                <dt>
                  <span className="text-sm font-medium text-ink">{c.labelOfficiel ?? c.label}</span>
                  {c.description && <span className="mt-0.5 block text-xs leading-relaxed text-muted">{c.description}</span>}
                  <span className="mt-0.5 block font-mono text-[0.65rem] text-muted">colonne {c.colonne}</span>
                </dt>
                <dd className="font-semibold tabular-nums text-ink sm:text-right">{fmt(formation[c.cle], c.type)}</dd>
              </div>
            ))}
          </dl>
        </section>
        <p className="mt-5 rounded-2xl bg-amber-soft/60 p-4 text-sm leading-relaxed text-ink-2">
          Ces chiffres décrivent la formation pour la session {session}. Le taux d'accès n'est pas une probabilité d'admission individuelle, et les rangs du
          dernier appelé d'une année ne garantissent rien pour la suivante.
        </p>
        {typeof formation.lien === "string" && formation.lien.startsWith("http") && (
          <a href={formation.lien} className="mt-4 inline-flex items-center gap-2 font-semibold text-primary underline underline-offset-2">
            Fiche officielle sur Parcoursup <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}

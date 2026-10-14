"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { PlayerControls, Progression } from "./PlayerControls";
import { usePlayer } from "./usePlayer";
import { cn } from "@/lib/cn";

/*
 * Scénario fictif et simplifié (aucune donnée réelle), cohérent avec les règles
 * du calcul officiel : ordre d'appel avec taux boursier (25 %), propositions dans
 * l'ordre d'appel tant qu'il reste des places, place libérée par un refus et
 * proposée le lendemain au suivant de l'ordre d'appel.
 */

type CId = "E" | "L" | "I" | "N" | "J" | "S";
type FId = "A" | "B" | "C";

const CANDIDATS: { id: CId; nom: string; boursier?: boolean }[] = [
  { id: "E", nom: "Emma" },
  { id: "L", nom: "Lucas" },
  { id: "I", nom: "Inès", boursier: true },
  { id: "N", nom: "Noah" },
  { id: "J", nom: "Jade" },
  { id: "S", nom: "Sami" },
];

const FORMATIONS: { id: FId; nom: string; detail: string; places: number }[] = [
  { id: "A", nom: "BUT Informatique", detail: "2 places · taux boursiers 25 %", places: 2 },
  { id: "B", nom: "Licence de droit", detail: "2 places", places: 2 },
  { id: "C", nom: "CPGE scientifique", detail: "1 place", places: 1 },
];

const VOEUX: [CId, FId][] = [
  ["E", "A"], ["E", "C"],
  ["L", "A"], ["L", "B"],
  ["I", "A"], ["I", "B"],
  ["N", "B"], ["N", "C"],
  ["J", "B"],
  ["S", "C"], ["S", "A"],
];

const CLASSEMENT: Record<FId, CId[]> = { A: ["E", "L", "S", "I"], B: ["N", "J", "L", "I"], C: ["S", "E", "N"] };
const ORDRE_APPEL: Record<FId, CId[]> = { A: ["I", "E", "L", "S"], B: ["N", "J", "L", "I"], C: ["S", "E", "N"] };

type EtatLien = "neutre" | "attente" | "proposition" | "acceptee" | "refusee" | "abandon";

interface Etape {
  titre: string;
  texte: string;
  ordre: "pedagogique" | "appel";
  liens: Partial<Record<`${CId}${FId}`, EtatLien>>;
  places: boolean;
}

const ETAPES: Etape[] = [
  {
    titre: "Les vœux",
    texte: "Six lycéens fictifs formulent leurs vœux. Pendant la phase principale, ils n'ont pas à les classer entre eux.",
    ordre: "pedagogique",
    liens: {},
    places: false,
  },
  {
    titre: "Le classement",
    texte: "La commission d'examen de chaque formation étudie les dossiers et établit son classement pédagogique. C'est une décision de l'établissement.",
    ordre: "pedagogique",
    liens: {},
    places: false,
  },
  {
    titre: "L'ordre d'appel",
    texte: "Parcoursup transforme le classement en ordre d'appel. Le BUT a un taux minimum de 25 % de boursiers : Inès, boursière, remonte en tête.",
    ordre: "appel",
    liens: {},
    places: false,
  },
  {
    titre: "Jour 1 : propositions",
    texte: "Chaque formation fait des propositions en suivant son ordre d'appel, tant qu'il reste des places. Les autres candidats sont en liste d'attente.",
    ordre: "appel",
    liens: { IA: "proposition", EA: "proposition", NB: "proposition", JB: "proposition", SC: "proposition", LA: "attente", SA: "attente", LB: "attente", IB: "attente", EC: "attente", NC: "attente" },
    places: true,
  },
  {
    titre: "Les réponses",
    texte: "Emma préfère la CPGE, où elle est en attente : elle refuse le BUT. Une place se libère. Les autres acceptent leur proposition.",
    ordre: "appel",
    liens: { IA: "acceptee", EA: "refusee", NB: "acceptee", JB: "acceptee", SC: "acceptee", LA: "attente", SA: "attente", LB: "attente", IB: "attente", EC: "attente", NC: "attente" },
    places: true,
  },
  {
    titre: "Jour 2 : la place est reproposée",
    texte: "Au calcul suivant, la place libérée va au candidat suivant dans l'ordre d'appel du BUT : Lucas. Il accepte et renonce à son vœu en droit.",
    ordre: "appel",
    liens: { IA: "acceptee", EA: "abandon", NB: "acceptee", JB: "acceptee", SC: "acceptee", LA: "acceptee", SA: "attente", LB: "abandon", IB: "attente", EC: "attente", NC: "attente" },
    places: true,
  },
  {
    titre: "Les listes d'attente avancent",
    texte: "Lucas parti, Inès gagne une place sur la liste d'attente du droit. Emma reste 1re sur celle de la CPGE : sa position dépend des réponses des autres.",
    ordre: "appel",
    liens: { IA: "acceptee", EA: "abandon", NB: "acceptee", JB: "acceptee", SC: "acceptee", LA: "acceptee", SA: "attente", LB: "abandon", IB: "attente", EC: "attente", NC: "attente" },
    places: true,
  },
];

/* ---------- géométrie (horizontale sur grand écran, verticale sur mobile) ---------- */
type Mode = "h" | "v";
const GEO = {
  h: {
    vb: "0 0 1000 540",
    candidat: (i: number) => ({ x: 150, y: 62 + i * 83 }),
    carte: (k: number) => ({ x: 520, y: [24, 200, 376][k]!, w: 450, h: 148 }),
    ancreCarte: (k: number) => ({ x: 520, y: [24, 200, 376][k]! + 74 }),
    ancreCandidat: (p: { x: number; y: number }) => ({ x: p.x + 26, y: p.y }),
    slot: (k: number, i: number) => ({ x: 580 + i * 72, y: [24, 200, 376][k]! + 102 }),
  },
  v: {
    vb: "0 0 400 682",
    candidat: (i: number) => ({ x: 40 + i * 64, y: 40 }),
    carte: (k: number) => ({ x: 12, y: [112, 304, 496][k]!, w: 376, h: 172 }),
    ancreCarte: (k: number) => ({ x: 200, y: [112, 304, 496][k]! }),
    ancreCandidat: (p: { x: number; y: number }) => ({ x: p.x, y: p.y + 40 }),
    slot: (k: number, i: number) => ({ x: 52 + i * 62, y: [112, 304, 496][k]! + 118 }),
  },
} as const;

const COULEUR_LIEN: Record<EtatLien, { stroke: string; width: number; dash?: string; opacity: number }> = {
  neutre: { stroke: "var(--line-strong)", width: 1.6, opacity: 0.9 },
  attente: { stroke: "var(--primary-2)", width: 1.6, dash: "5 6", opacity: 0.55 },
  proposition: { stroke: "var(--green-2)", width: 3, opacity: 1 },
  acceptee: { stroke: "var(--green)", width: 3.6, opacity: 1 },
  refusee: { stroke: "var(--rose-2)", width: 3, opacity: 1 },
  abandon: { stroke: "var(--rose-2)", width: 1.5, opacity: 0 },
};

function useMode(): Mode {
  const [mode, setMode] = useState<Mode>("h");
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const maj = () => setMode(mq.matches ? "h" : "v");
    maj();
    mq.addEventListener("change", maj);
    return () => mq.removeEventListener("change", maj);
  }, []);
  return mode;
}

export function HeroDiagram() {
  const player = usePlayer(ETAPES.length, { intervalle: 3600, boucle: true, pauseFin: 5200 });
  const mode = useMode();
  const g = GEO[mode];
  const e = ETAPES[player.etape]!;
  const s = player.etape;

  const etatLien = (c: CId, f: FId): EtatLien => e.liens[`${c}${f}`] ?? "neutre";
  const candidatDansListe = (f: FId, c: CId) => {
    const l = etatLien(c, f);
    return l !== "abandon" && !(l === "refusee" && s > 4);
  };

  return (
    <figure ref={player.ref} className="relative overflow-hidden rounded-[32px] bg-surface shadow-float ring-1 ring-line">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Démonstration · scénario fictif</p>
        <p className="hidden text-xs text-muted sm:block">6 candidats · 3 formations · 2 jours</p>
      </div>

      <svg viewBox={g.vb} className="block h-auto w-full" role="img" aria-labelledby="hero-titre hero-desc">
        <title id="hero-titre">Du vœu à la proposition d'admission</title>
        <desc id="hero-desc">{e.texte}</desc>
        <defs>
          <filter id="ombre" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0e1a33" floodOpacity="0.10" />
          </filter>
          <linearGradient id="carteGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--surface)" />
            <stop offset="1" stopColor="var(--surface-2)" />
          </linearGradient>
        </defs>

        {/* liens vœux (grand écran uniquement : en vertical ils croiseraient les cartes) */}
        {mode === "h" && VOEUX.map(([c, f], idx) => {
          const ic = CANDIDATS.findIndex((x) => x.id === c);
          const kf = FORMATIONS.findIndex((x) => x.id === f);
          const a = g.ancreCandidat(g.candidat(ic));
          const b = g.ancreCarte(kf);
          const d =
            mode === "h"
              ? `M${a.x},${a.y} C${a.x + 180},${a.y} ${b.x - 180},${b.y} ${b.x},${b.y}`
              : `M${a.x},${a.y} C${a.x},${a.y + 60} ${b.x},${b.y - 70} ${b.x},${b.y}`;
          const st = COULEUR_LIEN[etatLien(c, f)];
          return (
            <motion.path
              key={`${c}${f}-${mode}`}
              d={d}
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: st.opacity, stroke: st.stroke, strokeWidth: st.width }}
              transition={{ pathLength: { duration: 1.1, delay: s === 0 ? idx * 0.08 : 0, ease: "easeInOut" }, default: { duration: 0.6 } }}
              strokeDasharray={st.dash}
            />
          );
        })}

        {/* impulsions sur les nouvelles propositions */}
        <AnimatePresence>
          {mode === "h" && (s === 3 || s === 5) &&
            VOEUX.filter(([c, f]) => {
              const l = etatLien(c, f);
              return s === 3 ? l === "proposition" : c === "L" && f === "A";
            }).map(([c, f]) => {
              const ic = CANDIDATS.findIndex((x) => x.id === c);
              const kf = FORMATIONS.findIndex((x) => x.id === f);
              const a = g.ancreCandidat(g.candidat(ic));
              const b = g.ancreCarte(kf);
              return (
                <motion.circle
                  key={`pulse-${c}${f}-${s}`}
                  r={6}
                  fill="var(--green-2)"
                  initial={{ cx: b.x, cy: b.y, opacity: 0 }}
                  animate={{ cx: a.x, cy: a.y, opacity: [0, 1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.3, ease: "easeInOut" }}
                />
              );
            })}
        </AnimatePresence>

        {/* cartes formations */}
        {FORMATIONS.map((f, k) => {
          const c = g.carte(k);
          const liste = (e.ordre === "appel" ? ORDRE_APPEL : CLASSEMENT)[f.id];
          const visibles = s >= 1 ? liste.filter((cid) => candidatDansListe(f.id, cid)) : [];
          let attente = 0;
          return (
            <g key={f.id}>
              <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={22} fill="url(#carteGrad)" stroke="var(--line)" filter="url(#ombre)" />
              <text x={c.x + 22} y={c.y + 34} fontSize={mode === "h" ? 22 : 19} fontWeight={650} fill="var(--ink)" style={{ fontFamily: "var(--font-display)" }}>
                {f.nom}
              </text>
              <text x={c.x + 22} y={c.y + 57} fontSize={mode === "h" ? 15 : 14} fill="var(--muted)">
                {f.detail}
              </text>
              {s >= 1 && (
                <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={c.x + c.w - 22} y={c.y + 34} fontSize={13} textAnchor="end" fill="var(--accent)" fontWeight={600}>
                  {e.ordre === "appel" ? "ordre d'appel" : "classement pédagogique"}
                </motion.text>
              )}
              {/* zone des places */}
              {e.places && (
                <motion.rect
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x={g.slot(k, 0).x - 26}
                  y={g.slot(k, 0).y - 30}
                  width={f.places * (mode === "h" ? 72 : 62) - 10 + 2}
                  height={60}
                  rx={16}
                  fill="var(--green-soft)"
                  stroke="var(--green-2)"
                  strokeDasharray="4 4"
                />
              )}
              {visibles.map((cid) => {
                const pos = liste.indexOf(cid);
                const reel = visibles.indexOf(cid);
                const p = g.slot(k, reel);
                const cand = CANDIDATS.find((x) => x.id === cid)!;
                const l = etatLien(cid, f.id);
                const enAttente = l === "attente";
                if (enAttente) attente++;
                const remonte = e.ordre === "appel" && CLASSEMENT[f.id].indexOf(cid) > pos;
                return (
                  <motion.g
                    key={cid}
                    initial={{ opacity: 0, x: p.x, y: p.y + 14 }}
                    animate={{ opacity: l === "refusee" ? 0.35 : 1, x: p.x, y: p.y }}
                    transition={{ type: "spring", stiffness: 140, damping: 18, delay: s === 1 ? pos * 0.12 : 0 }}
                  >
                    <circle r={mode === "h" ? 24 : 21} fill={cand.boursier ? "var(--amber-2)" : "var(--surface)"} stroke={l === "acceptee" || l === "proposition" ? "var(--green-2)" : l === "refusee" ? "var(--rose-2)" : "var(--line-strong)"} strokeWidth={l === "acceptee" || l === "proposition" ? 3 : 1.5} />
                    <text textAnchor="middle" dy={5.5} fontSize={mode === "h" ? 16 : 14} fontWeight={700} fill={cand.boursier ? "#2b1a00" : "var(--ink)"}>
                      {cand.id}
                    </text>
                    <text textAnchor="middle" y={mode === "h" ? -32 : -29} fontSize={12} fill="var(--muted)" fontWeight={600}>
                      {enAttente ? `attente n°${attente}` : `${pos + 1}${pos === 0 ? "er" : "e"}`}
                    </text>
                    {remonte && (
                      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} textAnchor="middle" y={mode === "h" ? 42 : 38} fontSize={12} fontWeight={700} fill="var(--green)">
                        ▲ boursière
                      </motion.text>
                    )}
                  </motion.g>
                );
              })}
            </g>
          );
        })}

        {/* candidats */}
        {CANDIDATS.map((c, i) => {
          const p = g.candidat(i);
          const accepte = s >= 4 && (Object.entries(e.liens) as [string, EtatLien][]).some(([k, v]) => k.startsWith(c.id) && v === "acceptee");
          return (
            <g key={c.id} transform={`translate(${p.x},${p.y})`}>
              <motion.circle r={mode === "h" ? 26 : 22} fill={c.boursier ? "var(--amber-2)" : "var(--primary)"} animate={{ scale: accepte ? 1.06 : 1 }} />
              {accepte && <motion.circle r={mode === "h" ? 31 : 26} fill="none" stroke="var(--green-2)" strokeWidth={2.5} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />}
              <text textAnchor="middle" dy={6} fontSize={17} fontWeight={700} fill={c.boursier ? "#2b1a00" : "var(--on-primary)"}>
                {c.id}
              </text>
              <text
                x={mode === "h" ? -40 : 0}
                y={mode === "h" ? 5 : 42}
                textAnchor={mode === "h" ? "end" : "middle"}
                fontSize={mode === "h" ? 16 : 13}
                fontWeight={600}
                fill="var(--ink)"
              >
                {c.nom}
              </text>
              {c.boursier && mode === "h" && (
                <text x={-40} y={23} textAnchor="end" fontSize={11.5} fill="var(--amber)" fontWeight={600}>
                  boursière
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="border-t border-line bg-surface-2/50 px-5 py-4 sm:px-6">
        <div className="min-h-[5.5rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={s} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <p className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-bold text-on-primary">{s + 1}</span>
                {e.titre}
              </p>
              <p className="mt-1.5 text-[0.97rem] leading-relaxed text-ink-2">{e.texte}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-3 space-y-2">
          <Progression nb={ETAPES.length} courant={s} onAller={player.aller} libelles={ETAPES.map((x) => x.titre)} />
          <PlayerControls player={player} nbEtapes={ETAPES.length} libelle="démonstration" className={cn("[&_label]:hidden sm:[&_label]:flex")} />
        </div>
      </div>
    </figure>
  );
}

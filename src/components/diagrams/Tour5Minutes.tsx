"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Building2, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

function useCycle(nb: number, ms: number) {
  const reduit = useReducedMotion();
  const [i, setI] = useState(reduit ? nb - 1 : 0);
  useEffect(() => {
    if (reduit) return;
    const t = setInterval(() => setI((x) => (x + 1) % nb), ms);
    return () => clearInterval(t);
  }, [nb, ms, reduit]);
  return reduit ? nb - 1 : i;
}

const ressort = { type: "spring", stiffness: 220, damping: 22 } as const;

/* ---------- 1. Les vœux ---------- */
function VisuelVoeux() {
  const f = ["Licence", "BUT", "BTS"];
  const phase = useCycle(4, 1100);
  return (
    <svg viewBox="0 0 360 220" className="h-full w-full" role="img" aria-label="Un candidat formule trois vœux non classés">
      <circle cx={60} cy={110} r={30} fill="var(--accent-2)" />
      <text x={60} y={117} textAnchor="middle" fontSize={20} fontWeight={700} fill="#04201d">
        Vous
      </text>
      {f.map((nom, i) => {
        const y = 40 + i * 70;
        return (
          <g key={nom}>
            <motion.path d={`M92,110 C180,110 180,${y} 238,${y}`} fill="none" stroke="var(--primary-2)" strokeWidth={2.5} initial={{ pathLength: 0 }} animate={{ pathLength: phase > i ? 1 : 0 }} transition={{ duration: 0.6 }} />
            <motion.g initial={{ opacity: 0.3 }} animate={{ opacity: phase > i ? 1 : 0.3 }}>
              <rect x={240} y={y - 22} width={110} height={44} rx={12} fill="var(--surface)" stroke="var(--line-strong)" />
              <text x={295} y={y + 6} textAnchor="middle" fontSize={16} fontWeight={600} fill="var(--ink)">
                {nom}
              </text>
            </motion.g>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- 2. Le classement ---------- */
function VisuelClassement() {
  const phase = useCycle(2, 2200);
  const ordre = phase === 0 ? [3, 0, 4, 1, 2] : [0, 1, 2, 3, 4];
  const noms = ["Ana", "Bilal", "Côme", "Dina", "Eva"];
  return (
    <div className="flex h-full items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2 text-violet">
        <Building2 className="h-12 w-12" aria-hidden="true" />
        <span className="text-sm font-semibold">Commission</span>
      </div>
      <ol className="w-48 space-y-1.5">
        {ordre.map((k, pos) => (
          <motion.li key={k} layout transition={ressort} className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-sm shadow-soft ring-1 ring-line">
            <FileText className="h-4 w-4 text-muted" aria-hidden="true" />
            <span className="flex-1 font-medium text-ink">{noms[k]}</span>
            <motion.span className="font-mono text-xs text-violet" animate={{ opacity: phase === 1 ? 1 : 0 }}>
              {pos + 1}
              <sup>{pos === 0 ? "er" : "e"}</sup>
            </motion.span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- 3. L'ordre d'appel ---------- */
function VisuelOrdreAppel() {
  const phase = useCycle(2, 2400);
  const noms = ["Ana", "Bilal", "Côme", "Dina", "Eva"];
  const ordre = phase === 0 ? [0, 1, 2, 3, 4] : [3, 0, 1, 2, 4];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <p className="text-sm font-semibold text-ink-2">{phase === 0 ? "Classement pédagogique" : "Ordre d'appel (taux boursiers 20 %)"}</p>
      <ol className="flex gap-2">
        {ordre.map((k, pos) => (
          <motion.li key={k} layout transition={ressort} className="flex flex-col items-center gap-1">
            <span className={cn("grid h-14 w-14 place-items-center rounded-2xl text-sm font-bold shadow-soft", k === 3 ? "bg-amber-2 text-[#2b1a00]" : "bg-surface text-ink ring-1 ring-line")}>{noms[k]}</span>
            <span className="font-mono text-xs text-muted">{pos + 1}</span>
          </motion.li>
        ))}
      </ol>
      <motion.p className="text-sm font-semibold text-amber" animate={{ opacity: phase === 1 ? 1 : 0 }}>
        Dina, boursière, remonte pour respecter le taux.
      </motion.p>
    </div>
  );
}

/* ---------- 4. Les propositions ---------- */
function VisuelPropositions() {
  const phase = useCycle(5, 900);
  const noms = ["Dina", "Ana", "Bilal", "Côme", "Eva"];
  const assis = Math.min(phase, 3);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <div className="flex gap-3">
        {[0, 1, 2].map((s) => (
          <div key={s} className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-dashed border-green-2/60 bg-green-soft/40">
            <AnimatePresence>
              {s < assis && (
                <motion.span layoutId={`p-${s}`} className="grid h-14 w-14 place-items-center rounded-xl bg-green-2 text-sm font-bold text-[#03251a]" transition={ressort}>
                  {noms[s]}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {noms.map((n, i) =>
          i < assis ? (
            <span key={n} className="h-12 w-12" />
          ) : (
            <motion.span key={n} layoutId={`p-${i}`} className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-xs font-bold text-primary" transition={ressort}>
              {n}
            </motion.span>
          ),
        )}
      </div>
      <p className="text-sm text-muted">3 places · on descend dans l'ordre d'appel</p>
    </div>
  );
}

/* ---------- 5. Les réponses ---------- */
function VisuelReponses() {
  const phase = useCycle(3, 1800);
  const assis = phase === 0 ? ["Dina", "Ana", "Bilal"] : phase === 1 ? ["Dina", null, "Bilal"] : ["Dina", "Côme", "Bilal"];
  const attente = phase === 2 ? ["Eva"] : ["Côme", "Eva"];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <div className="flex gap-3">
        {assis.map((n, s) => (
          <div key={s} className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-dashed border-green-2/60 bg-green-soft/40">
            <AnimatePresence mode="popLayout">
              {n && (
                <motion.span key={n} layoutId={`r-${n}`} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="grid h-14 w-14 place-items-center rounded-xl bg-green-2 text-sm font-bold text-[#03251a]" transition={ressort}>
                  {n}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {attente.map((n, i) => (
          <motion.span key={n} layoutId={`r-${n}`} layout className="relative grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-xs font-bold text-primary" transition={ressort}>
            {n}
            <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-ink text-[0.6rem] text-bg">{i + 1}</span>
          </motion.span>
        ))}
      </div>
      <p className="h-5 text-sm font-medium text-ink-2">{phase === 1 ? "Ana refuse : une place se libère." : phase === 2 ? "Côme reçoit la place ; Eva avance." : "Chacun répond dans les délais."}</p>
    </div>
  );
}

/* ---------- 6. À retenir ---------- */
function VisuelRetenir() {
  const items = [
    { t: "Classement", d: "décidé par la formation", c: "bg-violet-soft text-violet" },
    { t: "Ordre d'appel", d: "classement + taux légaux, calculé une fois", c: "bg-primary-soft text-primary" },
    { t: "Position d'attente", d: "change chaque jour selon les réponses des autres", c: "bg-accent-soft text-accent" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      {items.map((x, i) => (
        <motion.div key={x.t} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.25 }} className={cn("rounded-2xl px-4 py-3", x.c)}>
          <p className="font-display text-lg font-semibold">{x.t}</p>
          <p className="text-sm text-ink-2">{x.d}</p>
        </motion.div>
      ))}
    </div>
  );
}

const ECRANS = [
  {
    titre: "Vous formulez des vœux",
    texte: "Vous choisissez des formations sur la plateforme et confirmez vos vœux. Pendant la phase principale, vous n'avez pas à les classer entre eux : chaque formation examine votre dossier indépendamment.",
    Visuel: VisuelVoeux,
  },
  {
    titre: "Chaque formation classe les dossiers",
    texte: "Une commission d'examen des vœux, propre à chaque formation, étudie les dossiers selon ses critères et établit un classement pédagogique. Cette décision n'est pas prise par l'algorithme national.",
    Visuel: VisuelClassement,
  },
  {
    titre: "Le classement devient un ordre d'appel",
    texte: "Parcoursup applique ensuite les taux fixés par le recteur (minimum de boursiers, et parfois de candidats du secteur). Certains candidats remontent : c'est l'ordre d'appel, calculé une seule fois.",
    Visuel: VisuelOrdreAppel,
  },
  {
    titre: "Les propositions suivent l'ordre d'appel",
    texte: "Chaque jour, l'algorithme national envoie des propositions dans l'ordre d'appel, tant que la formation a des places (selon ses données d'appel). Les suivants sont en liste d'attente.",
    Visuel: VisuelPropositions,
  },
  {
    titre: "Chacun répond, les places circulent",
    texte: "Quand un candidat refuse ou renonce, sa place est proposée au suivant lors d'un calcul ultérieur. C'est pourquoi votre position en liste d'attente évolue au fil des jours.",
    Visuel: VisuelReponses,
  },
  {
    titre: "Trois nombres à ne pas confondre",
    texte: "Votre rang de classement (choix de la formation), votre rang dans l'ordre d'appel (classement + taux) et votre position en liste d'attente (qui change chaque jour). Aucun ne garantit une admission à l'avance.",
    Visuel: VisuelRetenir,
  },
];

export function Tour5Minutes() {
  const [i, setI] = useState(0);
  const [sens, setSens] = useState(1);
  const e = ECRANS[i]!;
  const aller = (j: number) => {
    setSens(j > i ? 1 : -1);
    setI(Math.max(0, Math.min(ECRANS.length - 1, j)));
  };
  return (
    <div
      className="overflow-hidden rounded-[32px] bg-surface shadow-float ring-1 ring-line"
      onKeyDown={(ev) => {
        if (ev.key === "ArrowRight") aller(i + 1);
        if (ev.key === "ArrowLeft") aller(i - 1);
      }}
    >
      <div className="flex gap-1.5 px-5 pt-5 sm:px-8" role="tablist" aria-label="Écrans">
        {ECRANS.map((x, j) => (
          <button key={x.titre} type="button" role="tab" aria-selected={j === i} aria-label={`Écran ${j + 1} : ${x.titre}`} onClick={() => aller(j)} className="h-6 flex-1">
            <span className="block h-1.5 overflow-hidden rounded-full bg-surface-3">
              <motion.span className="block h-full bg-accent-2" animate={{ width: j <= i ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
            </span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" custom={sens}>
        <motion.div
          key={i}
          custom={sens}
          initial={{ opacity: 0, x: 40 * sens }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 * sens }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="grid items-center gap-6 px-5 py-8 sm:px-8 md:grid-cols-2 md:gap-10 md:py-12"
          role="tabpanel"
          aria-live="polite"
        >
          <div>
            <p className="font-mono text-sm text-accent">
              {i + 1} / {ECRANS.length}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">{e.titre}</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-2">{e.texte}</p>
          </div>
          <div className="h-64 rounded-3xl bg-surface-2/70 p-4 ring-1 ring-line sm:h-72">
            <e.Visuel />
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center justify-between border-t border-line px-5 py-4 sm:px-8">
        <button type="button" onClick={() => aller(i - 1)} disabled={i === 0} className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium text-ink-2 hover:bg-surface-2 disabled:opacity-40">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Précédent
        </button>
        {i < ECRANS.length - 1 ? (
          <button type="button" onClick={() => aller(i + 1)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-on-primary shadow-soft hover:bg-primary-2">
            Suivant <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <Link href="/comprendre/" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-on-primary shadow-soft hover:bg-primary-2">
            Approfondir <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
      <p className="sr-only">Utilisez les flèches gauche et droite du clavier pour naviguer entre les écrans.</p>
    </div>
  );
}

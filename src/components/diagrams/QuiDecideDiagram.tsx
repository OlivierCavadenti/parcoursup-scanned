"use client";

import { AnimatePresence, motion } from "motion/react";
import { BookOpenCheck, Building2, Cpu, EyeOff, FileText, Gavel, ListOrdered, Mail, MessageSquareReply, Scale, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { ACTEURS, CHAINE_DECISION, type Acteur } from "@/content/qui-decide";
import { CODE_REFS, lienGitlab } from "@/content/code-refs";
import { source } from "@/content/sources";
import { usePlayer } from "./usePlayer";
import { cn } from "@/lib/cn";

const ICONES = [User, Building2, Users, ListOrdered, Scale, Cpu, Mail, MessageSquareReply];

export function QuiDecideDiagram() {
  const n = CHAINE_DECISION.length;
  const player = usePlayer(n, { intervalle: 2600, boucle: true, pauseFin: 2600 });
  const [choisi, setChoisi] = useState<number | null>(null);
  const actif = choisi ?? player.etape;
  const e = CHAINE_DECISION[actif]!;
  const a = ACTEURS[e.acteur];

  useEffect(() => {
    if (choisi !== null && player.lecture) player.basculer();
  }, [choisi, player]);

  return (
    <div ref={player.ref} className="rounded-[28px] bg-surface shadow-float ring-1 ring-line">
      {/* légende des acteurs */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line px-5 py-4 sm:px-7">
        {(Object.keys(ACTEURS) as Acteur[]).map((k) => (
          <span key={k} className="flex items-center gap-2 text-sm text-ink-2">
            <span className={cn("h-3 w-3 rounded-full", ACTEURS[k].couleur)} aria-hidden="true" />
            {ACTEURS[k].libelle}
          </span>
        ))}
        <span className="ml-auto text-xs text-muted">Cliquez sur une étape</span>
      </div>

      {/* chaîne */}
      <div className="relative px-4 pb-4 pt-6 sm:px-7">
        <div className="absolute left-10 right-10 top-[3.35rem] hidden h-[3px] rounded-full bg-surface-3 lg:block" aria-hidden="true">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent-2 via-violet-2 to-primary-2"
            animate={{ width: `${(actif / (n - 1)) * 100}%` }}
            transition={{ type: "spring", stiffness: 90, damping: 20 }}
          />
          <motion.div
            className="absolute -top-[9px] grid h-[21px] w-[21px] place-items-center rounded-md bg-ink text-bg shadow-soft"
            animate={{ left: `calc(${(actif / (n - 1)) * 100}% - 10px)` }}
            transition={{ type: "spring", stiffness: 90, damping: 20 }}
            aria-hidden="true"
          >
            <FileText className="h-3 w-3" />
          </motion.div>
        </div>
        <ol className="relative grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {CHAINE_DECISION.map((etape, i) => {
            const Icone = ICONES[i]!;
            const act = ACTEURS[etape.acteur];
            const estActif = i === actif;
            return (
              <li key={etape.id}>
                <button
                  type="button"
                  onClick={() => setChoisi(i)}
                  aria-pressed={estActif}
                  className={cn(
                    "group flex w-full flex-col items-center gap-2 rounded-2xl px-2 py-3 text-center transition",
                    estActif ? "bg-surface-2 ring-1 ring-line-strong" : "hover:bg-surface-2/60",
                  )}
                >
                  <motion.span
                    className={cn("relative grid h-14 w-14 place-items-center rounded-2xl text-white shadow-soft", act.couleur)}
                    animate={{ scale: estActif ? 1.1 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    <Icone className="h-6 w-6 text-[#0a1020]" aria-hidden="true" />
                    {estActif && (
                      <motion.span layoutId="halo-qui-decide" className="absolute -inset-1.5 rounded-[20px] ring-2 ring-ink/70" transition={{ type: "spring", stiffness: 300, damping: 26 }} />
                    )}
                  </motion.span>
                  <span className="text-sm font-semibold leading-tight text-ink">
                    <span className="mr-1 font-mono text-xs text-muted">{i + 1}</span>
                    {etape.titre}
                  </span>
                  <span className="hidden text-[0.72rem] leading-snug text-muted sm:block">{etape.court}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* détail */}
      <div className="border-t border-line px-5 py-6 sm:px-7" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={actif} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28 }}>
            <div className="flex flex-wrap items-center gap-3">
              <span className={cn("rounded-full px-3 py-1 text-xs font-bold", a.soft, a.texte)}>{a.libelle}</span>
              <h3 className="font-display text-2xl font-semibold text-ink">
                {actif + 1}. {e.titre}
              </h3>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-surface-2/60 p-4 ring-1 ring-line">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Gavel className="h-4 w-4 text-primary" aria-hidden="true" /> Qui décide quoi
                </p>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-ink-2">
                  {e.decide.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-green-soft/40 p-4 ring-1 ring-green/20">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <BookOpenCheck className="h-4 w-4 text-green" aria-hidden="true" /> Public et vérifiable
                </p>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-ink-2">
                  {e.public.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-surface-2 p-4 ring-1 ring-line-strong">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <EyeOff className="h-4 w-4 text-muted" aria-hidden="true" /> Non public ou inconnu
                </p>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-ink-2">
                  {e.nonPublic.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
              {e.code?.map((c) => (
                <a key={c} href={lienGitlab(CODE_REFS[c])} className="rounded-md bg-[#0d1426] px-2 py-1 font-mono text-teal-200 hover:bg-[#16203a]">
                  {CODE_REFS[c].titre} ↗
                </a>
              ))}
              <span>Sources :</span>
              {e.sources.map((id) => {
                const s = source(id);
                return (
                  <a key={id} href={s.url} className="underline decoration-line-strong underline-offset-2 hover:text-ink">
                    {s.titre.length > 60 ? `${s.titre.slice(0, 58)}…` : s.titre}
                  </a>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

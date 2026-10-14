"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Bot, Hand } from "lucide-react";
import { useState } from "react";
import { EXEMPLES_REPONDEUR, PREFERENCES, type Formation } from "./data/repondeur";
import { PlayerControls, Progression } from "./PlayerControls";
import { usePlayer } from "./usePlayer";
import type { StatutVoeu } from "@/algorithmes/reference/propositions";
import { cn } from "@/lib/cn";

const LIB: Record<string, { t: string; cls: string }> = {
  EN_ATTENTE_DE_PROPOSITION: { t: "en attente", cls: "bg-primary-soft text-primary" },
  PROPOSITION_DU_JOUR: { t: "nouvelle proposition", cls: "bg-green-soft text-green ring-2 ring-green-2" },
  REP_AUTO_ACCEPTE: { t: "acceptée automatiquement", cls: "bg-green-2 text-[#03251a]" },
  PROPOSITION_JOURS_PRECEDENTS_ACCEPTEE: { t: "acceptée", cls: "bg-green-2 text-[#03251a]" },
  PROPOSITION_JOURS_PRECEDENTS_EN_ATTENTE_DE_REPONSE_DU_CANDIDAT: { t: "réponse attendue", cls: "bg-green-soft text-green" },
};

export function RepondeurDiagram() {
  const [mode, setMode] = useState<"avec" | "sans">("avec");
  const etapes = EXEMPLES_REPONDEUR[mode];
  const player = usePlayer(etapes.length, { intervalle: 3800 });
  const e = etapes[Math.min(player.etape, etapes.length - 1)]!;

  return (
    <figure ref={player.ref} className="overflow-hidden rounded-[28px] bg-surface shadow-float ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Exemples officiels · section 6 · calcul exact</p>
          <p className="mt-1 font-display text-lg font-semibold text-ink">Vœux ordonnés : que se passe-t-il à la réception d'une proposition ?</p>
        </div>
        <div role="radiogroup" aria-label="Répondeur automatique" className="inline-flex rounded-full bg-surface-2 p-1 ring-1 ring-line">
          {(["avec", "sans"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => {
                setMode(m);
                player.debut();
              }}
              className={cn("inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition", mode === m ? "bg-surface text-ink shadow-soft" : "text-muted hover:text-ink")}
            >
              {m === "avec" ? <Bot className="h-4 w-4" /> : <Hand className="h-4 w-4" />}
              {m === "avec" ? "Avec répondeur" : "Sans répondeur"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 px-5 py-6 sm:px-7 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="mb-3 text-sm font-semibold text-ink">Ordre de préférence du candidat</p>
          <LayoutGroup>
            <ol className="space-y-2">
              <AnimatePresence>
                {PREFERENCES.filter((f) => e.statuts[f] !== "SUPPRIME").map((f: Formation) => {
                  const st = e.statuts[f] as StatutVoeu;
                  const lib = LIB[st] ?? { t: st, cls: "bg-surface-2" };
                  return (
                    <motion.li
                      key={f}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 60, transition: { duration: 0.5 } }}
                      className={cn("flex items-center gap-3 rounded-2xl px-4 py-3 ring-1", e.nouvelle === f ? "bg-green-soft/50 ring-green-2/60" : "bg-surface-2/60 ring-line")}
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-surface font-mono text-xs font-bold text-ink-2 ring-1 ring-line">{PREFERENCES.indexOf(f) + 1}</span>
                      <span className="flex-1 font-display text-lg font-semibold text-ink">Formation {f}</span>
                      <motion.span layout className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", lib.cls)}>
                        {lib.t}
                      </motion.span>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ol>
          </LayoutGroup>
          <p className="mt-3 text-xs text-muted">Les vœux qui disparaissent sont supprimés automatiquement ; leurs places sont libérées.</p>
        </div>
        <div className="flex flex-col justify-between gap-4">
          <div className="rounded-2xl bg-surface-2/60 p-5 ring-1 ring-line" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={`${mode}-${player.etape}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="font-display text-xl font-semibold text-ink">{e.titre}</p>
                <p className="mt-2 leading-relaxed text-ink-2">{e.texte}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="space-y-3">
            <Progression nb={etapes.length} courant={player.etape} onAller={player.aller} />
            <PlayerControls player={player} nbEtapes={etapes.length} libelle="répondeur automatique" />
          </div>
        </div>
      </div>
    </figure>
  );
}

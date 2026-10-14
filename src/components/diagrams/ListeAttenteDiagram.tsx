"use client";

import { AnimatePresence, motion } from "motion/react";
import { PlayerControls, Progression } from "./PlayerControls";
import { usePlayer } from "./usePlayer";
import { cn } from "@/lib/cn";

/*
 * Exemple fictif : formation de 20 places, 40 candidats dans l'ordre d'appel.
 * « Vous » êtes 33e au classement pédagogique et 31e dans l'ordre d'appel
 * (deux boursiers classés après vous sont remontés devant vous).
 * Règle respectée à chaque jour : les places libérées sont proposées dans
 * l'ordre d'appel aux candidats encore en attente.
 */
const VOUS = 31;
const NB = 40;
type Etat = "proposition" | "parti" | "attente";

interface Jour {
  titre: string;
  texte: string;
  propositions: number[];
  partis: number[];
}

const JOURS: Jour[] = [
  {
    titre: "Jour 1",
    texte: "Les 20 premiers de l'ordre d'appel reçoivent une proposition. Vous êtes en attente : 10 candidats encore en attente sont devant vous, vous êtes donc 11e sur la liste d'attente.",
    propositions: range(1, 20),
    partis: [],
  },
  {
    titre: "Jour 2",
    texte: "4 candidats ont refusé leur proposition (places libérées) et 3 candidats devant vous ont renoncé à leur vœu. Les 4 places vont aux suivants dans l'ordre d'appel. Vous gagnez 7 positions.",
    propositions: [...range(1, 20).filter((r) => ![3, 8, 12, 17].includes(r)), 21, 22, 24, 25],
    partis: [3, 8, 12, 17, 23, 26, 29],
  },
  {
    titre: "Jour 3",
    texte: "3 nouveaux refus : 3 places sont proposées aux candidats 27, 28 et 30. Plus personne n'est devant vous en liste d'attente.",
    propositions: [...range(1, 20).filter((r) => ![3, 8, 12, 17, 5, 14, 19].includes(r)), 21, 22, 24, 25, 27, 28, 30],
    partis: [3, 8, 12, 17, 23, 26, 29, 5, 14, 19],
  },
  {
    titre: "Jour 4",
    texte: "Un refus de plus : la place vous est proposée. Le rang du dernier appelé passe à 31 — le vôtre.",
    propositions: [...range(1, 20).filter((r) => ![3, 8, 12, 17, 5, 14, 19, 10].includes(r)), 21, 22, 24, 25, 27, 28, 30, 31],
    partis: [3, 8, 12, 17, 23, 26, 29, 5, 14, 19, 10],
  },
];

function range(a: number, b: number) {
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}

export function ListeAttenteDiagram() {
  const player = usePlayer(JOURS.length, { intervalle: 4200 });
  const j = JOURS[player.etape]!;
  const etat = (r: number): Etat => (j.propositions.includes(r) ? "proposition" : j.partis.includes(r) ? "parti" : "attente");
  const dernier = Math.max(...j.propositions);
  const position = etat(VOUS) === "attente" ? range(1, VOUS).filter((r) => etat(r) === "attente").length : null;

  const indicateurs = [
    { k: "Rang au classement pédagogique", v: "33", note: "Fixé par la commission. Ne change pas.", cls: "text-violet" },
    { k: "Rang dans l'ordre d'appel", v: "31", note: "Après application des taux. Ne change pas.", cls: "text-primary" },
    { k: "Position en liste d'attente", v: position ? String(position) : "—", note: "Candidats encore en attente devant vous, plus vous. Évolue chaque jour.", cls: "text-accent" },
    { k: "Rang du dernier appelé", v: String(dernier), note: "Plus grand rang d'appel ayant reçu une proposition. Augmente avec le temps.", cls: "text-green" },
  ];

  return (
    <figure ref={player.ref} className="overflow-hidden rounded-[28px] bg-surface shadow-float ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Exemple fictif</p>
          <p className="mt-1 font-display text-lg font-semibold text-ink">Une formation de 20 places, 40 candidats dans l'ordre d'appel</p>
        </div>
        <span className="rounded-full bg-surface-2 px-3 py-1 font-mono text-sm text-ink-2">{j.titre}</span>
      </div>
      <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-5 py-6 sm:px-7">
          <div className="grid grid-cols-10 gap-1.5 sm:gap-2" role="img" aria-label={`Ordre d'appel : ${j.propositions.length} propositions, vous êtes ${position ? `${position}e en liste d'attente` : "appelé"}`}>
            {range(1, NB).map((r) => {
              const e = etat(r);
              const vous = r === VOUS;
              return (
                <motion.div
                  key={r}
                  layout
                  className={cn(
                    "relative grid aspect-square place-items-center rounded-lg text-[0.65rem] font-semibold tabular-nums sm:text-xs",
                    e === "proposition" && "bg-green-2 text-[#03251a]",
                    e === "attente" && "bg-primary-soft text-primary",
                    e === "parti" && "border border-dashed border-line-strong bg-transparent text-muted",
                    vous && "z-10",
                  )}
                  animate={{ scale: vous ? 1.12 : 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {r}
                  {vous && <span className="absolute -inset-1 rounded-[11px] ring-[3px] ring-accent-2" aria-hidden="true" />}
                  {r === dernier && (
                    <motion.span layoutId="dernier-appele" className="absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-green" aria-hidden="true" />
                  )}
                </motion.div>
              );
            })}
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-2">
            <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-green-2" /> proposition en cours ou acceptée</li>
            <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-primary-soft ring-1 ring-primary/30" /> en attente</li>
            <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded ring-1 ring-line-strong" /> a refusé ou renoncé</li>
            <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded ring-2 ring-accent-2" /> vous (31e)</li>
          </ul>
        </div>
        <div className="space-y-3 border-t border-line bg-surface-2/50 px-5 py-6 sm:px-7 lg:border-l lg:border-t-0">
          {indicateurs.map((i) => (
            <div key={i.k} className="flex items-center gap-4 rounded-2xl bg-surface p-3.5 ring-1 ring-line">
              <AnimatePresence mode="popLayout">
                <motion.span key={i.v} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} className={cn("w-14 text-center font-display text-3xl font-semibold tabular-nums", i.cls)}>
                  {i.v}
                </motion.span>
              </AnimatePresence>
              <div>
                <p className="text-sm font-semibold text-ink">{i.k}</p>
                <p className="text-xs leading-snug text-muted">{i.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-line px-5 py-4 sm:px-7">
        <div className="min-h-[3.5rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p key={player.etape} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[0.97rem] leading-relaxed text-ink-2">
              {j.texte}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="mt-3 space-y-3">
          <Progression nb={JOURS.length} courant={player.etape} onAller={player.aller} />
          <PlayerControls player={player} nbEtapes={JOURS.length} libelle="liste d'attente" />
        </div>
      </div>
    </figure>
  );
}

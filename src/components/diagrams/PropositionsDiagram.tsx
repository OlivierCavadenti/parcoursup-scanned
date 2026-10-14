"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Armchair } from "lucide-react";
import { CAPACITE, ETAPES_PROPOSITIONS, type EtatLigne, type Ligne } from "./data/propositions";
import { PlayerControls, Progression } from "./PlayerControls";
import { usePlayer } from "./usePlayer";
import { cn } from "@/lib/cn";

const PILL: Record<EtatLigne, { label: string; cls: string }> = {
  attente: { label: "En attente", cls: "bg-primary-soft text-primary" },
  proposition: { label: "Proposition reçue", cls: "bg-green-soft text-green ring-1 ring-green-2/50" },
  acceptee: { label: "Acceptée", cls: "bg-green-2 text-[#03251a]" },
  refusee: { label: "Refusée", cls: "bg-rose-soft text-rose" },
  partie: { label: "A renoncé", cls: "bg-surface-3 text-muted" },
};

function Siege({ ligne, index }: { ligne?: Ligne; index: number }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.div
        layout
        className={cn(
          "relative grid h-14 w-14 place-items-center rounded-2xl text-sm font-bold sm:h-16 sm:w-16",
          !ligne && "border-2 border-dashed border-line-strong text-muted",
          ligne?.etat === "acceptee" && "bg-green-2 text-[#03251a] shadow-soft",
          ligne?.etat === "proposition" && "bg-green-soft text-green ring-2 ring-green-2",
        )}
      >
        <AnimatePresence mode="popLayout">
          {ligne ? (
            <motion.span key={ligne.id} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              {ligne.nom.slice(0, 2)}
            </motion.span>
          ) : (
            <motion.span key="libre" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Armchair className="h-5 w-5" aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <span className="text-[0.7rem] font-medium text-muted">{ligne ? (ligne.etat === "acceptee" ? "acceptée" : "en attente de réponse") : `place ${index + 1} libre`}</span>
    </div>
  );
}

export function PropositionsDiagram() {
  const n = ETAPES_PROPOSITIONS.length;
  const player = usePlayer(n, { intervalle: 3400 });
  const e = ETAPES_PROPOSITIONS[player.etape]!;
  const occupants = e.lignes.filter((l) => l.etat === "acceptee" || l.etat === "proposition");
  const nbAttente = e.lignes.filter((l) => l.etat === "attente").length;

  return (
    <figure ref={player.ref} className="overflow-hidden rounded-[28px] bg-surface shadow-float ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Scénario fictif · calcul par le moteur de référence</p>
          <p className="mt-1 font-display text-lg font-semibold text-ink">Une formation de {CAPACITE} places, jour après jour</p>
        </div>
        <span className="rounded-full bg-surface-2 px-3 py-1 font-mono text-sm text-ink-2">{e.jour === 0 ? "Avant l'ouverture" : `Jour ${e.jour}`}</span>
      </div>

      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        <div className="px-4 py-5 sm:px-7">
          <p className="mb-3 text-sm font-semibold text-ink">Ordre d'appel</p>
          <LayoutGroup>
            <ol className="space-y-1.5">
              {e.lignes.map((l) => {
                const pill = PILL[l.etat];
                const inactif = l.etat === "refusee" || l.etat === "partie";
                return (
                  <motion.li
                    layout
                    key={l.id}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl px-3 py-2 ring-1 transition-colors",
                      l.nouveau ? "bg-green-soft/60 ring-green-2/60" : "bg-surface-2/60 ring-line",
                      inactif && "border border-dashed border-line-strong bg-transparent ring-transparent",
                    )}
                  >
                    {l.nouveau && (
                      <motion.span className="absolute inset-0 rounded-xl ring-2 ring-green-2" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.6 }} aria-hidden="true" />
                    )}
                    <span className="w-6 text-right font-mono text-sm tabular-nums text-muted">{l.rangAppel}</span>
                    <span className={cn("flex-1 font-medium", inactif ? "text-muted line-through decoration-1" : "text-ink")}>{l.nom}</span>
                    <motion.span layout className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", pill.cls)}>
                      {pill.label}
                    </motion.span>
                    <span className="w-24 text-right text-xs tabular-nums text-muted">
                      {l.positionAttente !== null && (
                        <motion.span key={l.positionAttente} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block">
                          n° {l.positionAttente} en liste
                        </motion.span>
                      )}
                    </span>
                    {e.rangDernierAppele === l.rangAppel && (
                      <motion.span
                        layoutId="marqueur-dernier"
                        className="absolute -bottom-[5px] left-2 right-2 h-0.5 rounded bg-accent-2"
                        aria-hidden="true"
                      />
                    )}
                  </motion.li>
                );
              })}
            </ol>
          </LayoutGroup>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted">
            <span className="h-0.5 w-6 rounded bg-accent-2" aria-hidden="true" /> rang du dernier appelé : <strong className="text-ink">{e.rangDernierAppele || "—"}</strong>
          </p>
        </div>

        <div className="flex flex-col gap-5 border-t border-line bg-surface-2/50 px-5 py-6 sm:px-7 lg:border-l lg:border-t-0">
          <div>
            <p className="text-sm font-semibold text-ink">Les {CAPACITE} places</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {Array.from({ length: CAPACITE }, (_, i) => (
                <Siege key={i} ligne={occupants[i]} index={i} />
              ))}
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-2 text-center">
            {[
              ["Places libres", CAPACITE - occupants.length],
              ["En liste d'attente", nbAttente],
              ["Dernier appelé", e.rangDernierAppele || "—"],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded-2xl bg-surface p-3 ring-1 ring-line">
                <dt className="text-[0.7rem] font-medium leading-tight text-muted">{k}</dt>
                <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-ink">
                  <motion.span key={String(v)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="inline-block">
                    {v}
                  </motion.span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="min-h-[9rem] rounded-2xl bg-surface p-4 ring-1 ring-line" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={player.etape} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                <p className="font-semibold text-ink">{e.titre}</p>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-2">{e.texte}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="space-y-3 border-t border-line px-5 py-4 sm:px-7">
        <Progression nb={n} courant={player.etape} onAller={player.aller} libelles={ETAPES_PROPOSITIONS.map((x) => x.titre)} />
        <PlayerControls player={player} nbEtapes={n} libelle="propositions jour après jour" />
      </div>
      <figcaption className="border-t border-line px-5 py-3 text-xs text-muted sm:px-7">
        Les propositions sont calculées par le portage du code officiel ; les réponses des candidats sont inventées pour l'exemple. La « position en liste » est une
        illustration simplifiée : Parcoursup calcule le rang affiché avec ses propres règles (AlgosAffichages).
      </figcaption>
    </figure>
  );
}

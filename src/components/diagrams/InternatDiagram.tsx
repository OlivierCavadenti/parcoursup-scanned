"use client";

import { AnimatePresence, motion } from "motion/react";
import { BedDouble, GraduationCap } from "lucide-react";
import { ANNEXE_A, CLASSEMENT_INTERNAT, PLACES_FORMATION, PLACES_INTERNAT, rangInternat, type EtatVoeuInternat } from "./data/internat";
import { PlayerControls, Progression } from "./PlayerControls";
import { usePlayer } from "./usePlayer";
import { INT_MAX } from "@/algorithmes/reference/propositions";
import { cn } from "@/lib/cn";

const fmt = (b: number) => (b >= INT_MAX ? "aucune limite" : String(b));

function Puce({ etat, avec }: { etat: EtatVoeuInternat; avec: boolean }) {
  if (etat === "absent") return <span className="h-8 w-8 sm:w-24" aria-hidden="true" />;
  const Icone = avec ? BedDouble : GraduationCap;
  return (
    <motion.span
      layout
      className={cn(
        "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold transition-colors sm:w-24",
        etat === "propose" && "bg-green-2 text-[#03251a]",
        etat === "attente" && "bg-surface text-muted ring-1 ring-line-strong",
        etat === "bloque" && "bg-rose-soft text-rose ring-1 ring-rose/30",
      )}
    >
      <Icone className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">{etat === "propose" ? "proposé" : etat === "bloque" ? "bloqué" : "attente"}</span>
    </motion.span>
  );
}

export function InternatDiagram() {
  const { passes } = ANNEXE_A;
  const player = usePlayer(passes.length, { intervalle: 4200 });
  const p = passes[player.etape]!;
  const derniere = player.etape === passes.length - 1;
  const surcapacite = p.internatsProposes.length > PLACES_INTERNAT;
  const hauteurLigne = 40;
  const barreY = p.barre >= INT_MAX ? CLASSEMENT_INTERNAT.length * hauteurLigne : p.barre * hauteurLigne;

  return (
    <figure ref={player.ref} className="overflow-hidden rounded-[28px] bg-surface shadow-float ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Exemple officiel · annexe A · calcul exact</p>
          <p className="mt-1 font-display text-lg font-semibold text-ink">{PLACES_FORMATION} places en formation, {PLACES_INTERNAT} places d'internat</p>
        </div>
        <span className="rounded-full bg-surface-2 px-3 py-1 text-sm text-ink-2">
          Passe {player.etape + 1} · barre internat : <strong className="font-mono text-ink">{fmt(p.barre)}</strong>
        </span>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="px-4 py-5 sm:px-7">
          <div className="mb-2 grid grid-cols-[2.5rem_1fr_auto_auto] items-center gap-2 text-xs font-semibold text-muted">
            <span>Appel</span>
            <span>Candidat</span>
            <span className="w-8 text-center sm:w-24">sans internat</span>
            <span className="w-8 text-center sm:w-24">avec internat</span>
          </div>
          <ol className="space-y-1.5">
            {p.lignes.map((l) => (
              <li key={l.candidat} className={cn("grid grid-cols-[2.5rem_1fr_auto_auto] items-center gap-2 rounded-xl px-2 py-1.5 ring-1", l.candidat === p.enCause ? "bg-rose-soft/50 ring-rose/40" : "bg-surface-2/60 ring-line")}>
                <span className="text-center font-mono text-sm text-muted">{l.candidat}</span>
                <span className="text-sm font-semibold text-ink">
                  C{l.candidat} <span className="font-normal text-muted">· internat {rangInternat(l.candidat)}e</span>
                </span>
                <Puce etat={l.sans} avec={false} />
                <Puce etat={l.avec} avec />
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-muted">
            La formation descend dans l'ordre d'appel jusqu'à épuiser ses {PLACES_FORMATION} places ; le dernier appelé est C{p.dernierAppele}.
          </p>
        </div>

        <div className="border-t border-line bg-surface-2/50 px-5 py-6 sm:px-7 lg:border-l lg:border-t-0">
          <p className="text-sm font-semibold text-ink">Classement internat</p>
          <div className="relative mt-3" style={{ height: CLASSEMENT_INTERNAT.length * hauteurLigne }}>
            {CLASSEMENT_INTERNAT.map((c, i) => {
              const propose = p.internatsProposes.includes(c);
              return (
                <div key={c} className="absolute inset-x-0 flex items-center gap-3" style={{ top: i * hauteurLigne, height: hauteurLigne }}>
                  <span className="w-6 text-right font-mono text-xs text-muted">{i + 1}</span>
                  <motion.span
                    className={cn("grid h-8 flex-1 place-items-center rounded-lg text-sm font-semibold", propose ? "bg-green-2 text-[#03251a]" : "bg-surface text-ink-2 ring-1 ring-line")}
                    animate={{ scale: c === p.enCause ? [1, 1.04, 1] : 1 }}
                    transition={{ duration: 0.8, repeat: c === p.enCause ? Infinity : 0 }}
                  >
                    C{c}
                  </motion.span>
                </div>
              );
            })}
            <motion.div
              className="absolute -left-2 -right-2 flex items-center"
              initial={false}
              animate={{ top: barreY - 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              <div className="h-[3px] flex-1 rounded-full bg-accent-2 shadow-[0_0_12px_var(--accent-2)]" />
              <span className="ml-2 whitespace-nowrap rounded-full bg-accent-2 px-2 py-0.5 text-[0.7rem] font-bold text-[#04201d]">barre {fmt(p.barre)}</span>
            </motion.div>
          </div>
          <div className="mt-5 flex items-center justify-between rounded-2xl bg-surface p-4 ring-1 ring-line">
            <span className="text-sm text-ink-2">Internats proposés</span>
            <span className={cn("font-display text-2xl font-semibold tabular-nums", surcapacite ? "text-rose" : "text-green")}>
              {p.internatsProposes.length} / {PLACES_INTERNAT}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-line px-5 py-4 sm:px-7" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p key={player.etape} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[0.97rem] leading-relaxed text-ink-2">
            {surcapacite ? (
              <>
                Avec une barre à <strong>{fmt(p.barre)}</strong>, {p.internatsProposes.length} candidats recevraient une place d'internat pour {PLACES_INTERNAT} lits.
                Le {PLACES_INTERNAT + 1}e au classement internat est C{p.enCause} (rang {rangInternat(p.enCause!)}) : la barre descend juste en dessous, à{" "}
                <strong>{p.barreSuivante}</strong>, et la formation refait sa descente dans l'ordre d'appel.
              </>
            ) : derniere ? (
              <>
                Barre stabilisée à <strong>{fmt(p.barre)}</strong> : {PLACES_INTERNAT} places d'internat sur {PLACES_INTERNAT}. Propositions sans internat : C1, C2, C5,
                C7, C9 ; avec internat : C1, C4, C5, C7 — exactement le résultat publié dans la documentation officielle. C3, C6 et C8 n'ont demandé que l'internat :
                ils restent en attente.
              </>
            ) : null}
          </motion.p>
        </AnimatePresence>
        <div className="mt-4 space-y-3">
          <Progression nb={passes.length} courant={player.etape} onAller={player.aller} />
          <PlayerControls player={player} nbEtapes={passes.length} libelle="barre internat" />
        </div>
      </div>
    </figure>
  );
}

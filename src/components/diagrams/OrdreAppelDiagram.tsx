"use client";

import { LayoutGroup, motion, AnimatePresence } from "motion/react";
import { ArrowUp, Check } from "lucide-react";
import { useMemo } from "react";
import { EXEMPLES_OA, type ExempleOA } from "./data/ordre-appel";
import { Jeton, STYLE_TYPE } from "./Jeton";
import { PlayerControls, Progression } from "./PlayerControls";
import { usePlayer } from "./usePlayer";
import { TYPES_CANDIDAT, type TypeCandidat } from "@/algorithmes/reference/ordre-appel";
import { cn } from "@/lib/cn";

const LIBELLE_REGLE_COURT: Record<string, string> = {
  AUCUNE_CONTRAINTE: "Aucun taux n'est contraignant : on prend le premier du classement pédagogique.",
  CONTRAINTE_BOURSIERS: "Le taux de boursiers est contraignant : on prend le premier boursier encore disponible.",
  CONTRAINTE_SECTEUR: "Le taux de candidats du secteur est contraignant : on prend le premier candidat du secteur.",
  DEUX_CONTRAINTES: "Les deux taux sont contraignants : on prend le premier boursier du secteur.",
  CONFLIT_PRIORITE_BOURSIERS: "Conflit entre les deux taux, sans boursier du secteur disponible : le taux boursier prime (loi du 8 mars 2018).",
};

function Jauge({ libelle, valeur, total, cible, couleur, contrainte }: { libelle: string; valeur: number; total: number; cible: number; couleur: string; contrainte: boolean | null }) {
  const pct = total === 0 ? 0 : (valeur / total) * 100;
  return (
    <div>
      <p className="text-sm font-medium text-ink">{libelle}</p>
      <p className="mt-0.5 flex items-baseline gap-2 text-sm text-muted">
        <span className="font-display text-2xl font-semibold tabular-nums text-ink">{total ? Math.round(pct) : 0} %</span>
        <span className="tabular-nums">
          {valeur} sur {total} · minimum {cible} %
        </span>
      </p>
      <div className="relative mt-2 h-3 overflow-hidden rounded-full bg-surface-3">
        <motion.div className={cn("h-full rounded-full", couleur)} animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 160, damping: 24 }} />
        <div className="absolute inset-y-[-3px] w-0.5 rounded bg-ink" style={{ left: `${cible}%` }} aria-hidden="true" />
      </div>
      {contrainte !== null && (
        <p className={cn("mt-1.5 text-xs font-semibold", contrainte ? "text-rose" : "text-green")}>
          {contrainte ? "Contraignant pour la place suivante" : "Respecté"}
        </p>
      )}
    </div>
  );
}

export function OrdreAppelDiagram({ exemple = "boursiers-25", compact = false }: { exemple?: ExempleOA["cle"]; compact?: boolean }) {
  const ex = EXEMPLES_OA[exemple];
  const n = ex.jetons.length;
  const player = usePlayer(n + 1, { intervalle: 1250 });
  const s = player.etape; // s candidats déjà appelés
  const jetonParId = useMemo(() => new Map(ex.jetons.map((j) => [j.id, j])), [ex]);
  const appeles = ex.ordre.slice(0, s);
  const appelesIds = new Set(appeles.map((o) => o.candidat));
  const derniere = s > 0 ? ex.etapes[s - 1] : undefined;
  const prochaine = s < n ? ex.etapes[s] : undefined;
  const typesUtiles = TYPES_CANDIDAT.filter((t) => ex.jetons.some((j) => j.type === t));
  const nbB = appeles.filter((o) => o.boursier).length;
  const nbR = appeles.filter((o) => o.duSecteur).length;

  const legende = (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-2">
      {typesUtiles.map((t) => (
        <li key={t} className="flex items-center gap-1.5">
          <span className={cn("h-3.5 w-3.5 rounded", STYLE_TYPE[t].cls)} aria-hidden="true" />
          {ex.qR === 0 ? (t.startsWith("BOURSIER") ? "Boursier" : "Non boursier") : STYLE_TYPE[t].libelle}
        </li>
      ))}
    </ul>
  );

  return (
    <figure ref={player.ref} className="overflow-hidden rounded-[28px] bg-surface shadow-float ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Exemple officiel · calcul exact</p>
          <p className="mt-1 font-display text-lg font-semibold text-ink">{ex.titre}</p>
        </div>
        {legende}
      </div>

      <LayoutGroup id={`oa-${exemple}`}>
        <div className={cn("grid gap-0", !compact && "lg:grid-cols-[1fr_300px]")}>
          <div className="space-y-6 px-5 py-6 sm:px-7">
            {/* Classement pédagogique */}
            <section aria-label="Classement pédagogique">
              <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-surface-3 text-[0.7rem]">1</span>
                Classement pédagogique <span className="font-normal text-muted">— transmis par la commission</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {ex.jetons.map((j) => (
                  <div key={j.id} className="flex flex-col items-center gap-0.5">
                    <Jeton label={j.label} type={j.type} etat={appelesIds.has(j.id) ? "fantome" : "normal"} taille="sm" />
                    <span className="font-mono text-[0.6rem] text-muted">{j.rang}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Files par type */}
            <section aria-label="Files d'attente par type de candidat">
              <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-surface-3 text-[0.7rem]">2</span>
                Une file par type de candidat <span className="font-normal text-muted">— chacune dans l'ordre du classement</span>
              </h3>
              <div className="space-y-2">
                {typesUtiles.map((t: TypeCandidat) => {
                  const file = ex.jetons.filter((j) => j.type === t && !appelesIds.has(j.id));
                  const teteEligible = prochaine && file[0] && prochaine.eligibles.includes(file[0].id);
                  return (
                    <div key={t} className="flex min-h-[3.25rem] items-center gap-3 rounded-2xl bg-surface-2/80 px-3 py-2 ring-1 ring-line">
                      <span className="w-20 shrink-0 text-[0.7rem] font-semibold leading-tight text-muted sm:w-24">
                        {ex.qR === 0 ? (t.startsWith("BOURSIER") ? "Boursiers" : "Non boursiers") : STYLE_TYPE[t].court}
                      </span>
                      <div className="flex flex-1 flex-wrap gap-1.5">
                        {file.length === 0 && <span className="text-xs italic text-muted">file vide</span>}
                        {file.map((j, i) => (
                          <Jeton key={j.id} layoutId={`${exemple}-${j.id}`} label={j.label} type={j.type} etat={i === 0 && teteEligible ? "eligible" : "normal"} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Ordre d'appel */}
            <section aria-label="Ordre d'appel calculé">
              <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-accent-2 text-[0.7rem] text-[#04201d]">3</span>
                Ordre d'appel <span className="font-normal text-muted">— construit place par place</span>
              </h3>
              <div className="flex min-h-[4.25rem] flex-wrap gap-1.5 rounded-2xl border-2 border-dashed border-accent-2/40 bg-accent-soft/30 p-2.5">
                {appeles.map((o, i) => {
                  const j = jetonParId.get(o.candidat)!;
                  const gain = o.rang - o.rangAppel;
                  return (
                    <div key={o.candidat} className="flex flex-col items-center gap-0.5">
                      <Jeton layoutId={`${exemple}-${o.candidat}`} label={j.label} type={j.type} etat={i === s - 1 ? "choisi" : "normal"} />
                      <span className={cn("flex items-center font-mono text-[0.6rem]", gain > 0 ? "font-bold text-green" : "text-muted")}>
                        {gain > 0 && <ArrowUp className="h-2.5 w-2.5" aria-hidden="true" />}
                        {o.rangAppel}
                      </span>
                    </div>
                  );
                })}
                {s === 0 && <p className="self-center px-2 text-sm text-muted">Lancez l'animation : les candidats vont être appelés un par un.</p>}
              </div>
            </section>
          </div>

          {/* Panneau d'explication */}
          <aside className={cn("flex flex-col gap-5 border-line bg-surface-2/50 px-5 py-6 sm:px-7", compact ? "border-t" : "border-t lg:border-l lg:border-t-0")}>
            <div className="space-y-4">
              <Jauge
                libelle="Boursiers parmi les appelés"
                valeur={nbB}
                total={s}
                cible={ex.qB}
                couleur="bg-amber-2"
                contrainte={prochaine ? prochaine.contrainteTauxBoursier : null}
              />
              {ex.qR > 0 && (
                <Jauge
                  libelle="Candidats du secteur"
                  valeur={nbR}
                  total={s}
                  cible={ex.qR}
                  couleur="bg-violet-2"
                  contrainte={prochaine ? prochaine.contrainteTauxSecteur : null}
                />
              )}
            </div>
            <div className="min-h-[8.5rem] rounded-2xl bg-surface p-4 ring-1 ring-line" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div key={s} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
                  {derniere ? (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted">Place n° {derniere.k}</p>
                      <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink">
                        <strong>{jetonParId.get(derniere.choisi.candidat)?.label}</strong> (rang {derniere.choisi.rang} au classement) est appelé{" "}
                        {derniere.choisi.rang > derniere.k ? (
                          <span className="font-semibold text-green">et remonte de {derniere.choisi.rang - derniere.k} place(s)</span>
                        ) : derniere.choisi.rang < derniere.k ? (
                          <span className="text-muted">et recule de {derniere.k - derniere.choisi.rang} place(s)</span>
                        ) : (
                          "à son rang"
                        )}
                        .
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-2">{LIBELLE_REGLE_COURT[derniere.regle]}</p>
                    </>
                  ) : (
                    <p className="text-sm leading-relaxed text-ink-2">
                      Le classement pédagogique est réparti en files selon le type de candidat. À chaque place, l'algorithme vérifie si un taux
                      est « contraignant », puis prend le meilleur candidat éligible parmi les têtes de file.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            {s === n && (
              <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5 text-xs text-ink-2">
                {ex.proprietes.filter((p) => p.applicable).map((p) => (
                  <li key={p.id} className="flex gap-2">
                    <Check className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", p.ok ? "text-green" : "text-rose")} aria-hidden="true" />
                    <span>
                      <strong className="text-ink">{p.id}</strong> {p.enonce}
                    </span>
                  </li>
                ))}
              </motion.ul>
            )}
          </aside>
        </div>
      </LayoutGroup>

      <div className="space-y-3 border-t border-line px-5 py-4 sm:px-7">
        <Progression nb={n + 1} courant={s} onAller={player.aller} />
        <PlayerControls player={player} nbEtapes={n + 1} libelle="ordre d'appel" />
      </div>
      <figcaption className="border-t border-line px-5 py-3 text-xs text-muted sm:px-7">
        Données : {ex.source}. Calcul effectué par le portage du code officiel (version 2024-2), vérifié sur ce même exemple.
      </figcaption>
    </figure>
  );
}

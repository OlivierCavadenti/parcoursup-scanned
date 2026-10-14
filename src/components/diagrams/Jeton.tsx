"use client";

import { motion } from "motion/react";
import type { TypeCandidat } from "@/algorithmes/reference/ordre-appel";
import { cn } from "@/lib/cn";

export const STYLE_TYPE: Record<TypeCandidat, { cls: string; libelle: string; court: string }> = {
  BOURSIER_DU_SECTEUR: { cls: "bg-amber-2 text-[#2b1a00] ring-2 ring-violet-2", libelle: "Boursier du secteur", court: "Boursier · secteur" },
  BOURSIER_HORS_SECTEUR: { cls: "bg-amber-2 text-[#2b1a00] ring-1 ring-amber/40", libelle: "Boursier hors secteur", court: "Boursier" },
  NON_BOURSIER_DU_SECTEUR: { cls: "bg-violet-soft text-violet ring-1 ring-violet/40", libelle: "Non boursier du secteur", court: "Secteur" },
  NON_BOURSIER_HORS_SECTEUR: { cls: "bg-surface text-ink-2 ring-1 ring-line-strong", libelle: "Non boursier hors secteur", court: "Autre" },
};

export function Jeton({
  label,
  type,
  layoutId,
  etat = "normal",
  taille = "md",
  className,
}: {
  label: string;
  type: TypeCandidat;
  layoutId?: string;
  etat?: "normal" | "eligible" | "choisi" | "fantome" | "attenue";
  taille?: "sm" | "md";
  className?: string;
}) {
  return (
    <motion.div
      layout
      layoutId={layoutId}
      transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.8 }}
      className={cn(
        "relative grid shrink-0 place-items-center rounded-[10px] font-semibold tabular-nums select-none",
        taille === "md" ? "h-9 w-9 text-[0.72rem] sm:h-10 sm:w-10 sm:text-[0.78rem]" : "h-7 w-7 text-[0.62rem]",
        STYLE_TYPE[type].cls,
        etat === "fantome" && "!bg-transparent !text-muted !ring-0 border border-dashed border-line-strong",
        etat === "attenue" && "!text-muted",
        className,
      )}
    >
      {etat === "eligible" && (
        <motion.span
          className="absolute -inset-1 rounded-[13px] ring-2 ring-accent-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: [0.4, 1, 0.4], scale: 1 }}
          transition={{ duration: 1.4, repeat: Infinity }}
          aria-hidden="true"
        />
      )}
      {etat === "choisi" && (
        <motion.span
          className="absolute -inset-1.5 rounded-[14px] bg-accent-2/25 ring-2 ring-accent-2"
          initial={{ opacity: 0, scale: 1.4 }}
          animate={{ opacity: 1, scale: 1 }}
          aria-hidden="true"
        />
      )}
      <span className="relative">{label}</span>
    </motion.div>
  );
}

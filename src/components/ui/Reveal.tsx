import { cn } from "@/lib/cn";

/** Apparition douce au défilement (CSS scroll-driven, aucun contenu masqué sans JS). */
export function Reveal({ children, as = "div", className }: { children: React.ReactNode; delay?: number; as?: "div" | "li" | "section"; className?: string }) {
  const T = as;
  return <T className={cn("reveal", className)}>{children}</T>;
}

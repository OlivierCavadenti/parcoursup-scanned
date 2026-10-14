import Link from "next/link";
import { ChevronRight, Clock, GraduationCap } from "lucide-react";
import { Container, Eyebrow } from "./primitives";

export type Niveau = "Découverte" | "Approfondissement" | "Technique";

export interface Miette {
  href: string;
  label: string;
}

export function PageHeader({
  titre,
  chapeau,
  eyebrow,
  miettes = [],
  niveau,
  duree,
  verification,
  children,
}: {
  titre: string;
  chapeau: React.ReactNode;
  eyebrow?: string;
  miettes?: Miette[];
  niveau?: Niveau;
  duree?: number;
  verification?: string;
  children?: React.ReactNode;
}) {
  const crumbs = [{ href: "/", label: "Accueil" }, ...miettes];
  return (
    <div className="relative overflow-hidden border-b border-line bg-gradient-to-b from-surface to-bg">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden="true" />
      <Container className="relative pb-12 pt-10 sm:pb-16 sm:pt-14">
        <nav aria-label="Fil d'Ariane">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
            {crumbs.map((m, i) => (
              <li key={m.href} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
                <Link href={m.href} className="rounded hover:text-ink">
                  {m.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <Eyebrow className="mt-8">{eyebrow}</Eyebrow>}
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink text-balance sm:text-5xl lg:text-[3.6rem]">
          {titre}
        </h1>
        <div className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-2 sm:text-xl">{chapeau}</div>
        {(niveau || duree || verification) && (
          <dl className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {niveau && (
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                <dt className="sr-only">Niveau</dt>
                <dd>Niveau : {niveau}</dd>
              </div>
            )}
            {duree && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <dt className="sr-only">Durée de lecture</dt>
                <dd>{duree} min de lecture</dd>
              </div>
            )}
            {verification && (
              <div>
                <dt className="inline">Vérifié le </dt>
                <dd className="inline">{verification}</dd>
              </div>
            )}
          </dl>
        )}
        {children}
      </Container>
    </div>
  );
}

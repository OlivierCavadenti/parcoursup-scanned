import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Comment fonctionne Parcoursup ? Le parcours complet",
  description: "Un parcours en sept modules pour comprendre Parcoursup : étapes, qui décide, examen des dossiers, ordre d'appel, quotas, listes d'attente et cas particuliers.",
};

const MODULES = [
  { href: "/comprendre/en-5-minutes/", n: "0", titre: "Comprendre en 5 minutes", texte: "Six écrans animés pour saisir l'essentiel.", duree: 5, niveau: "Découverte" },
  { href: "/comprendre/etapes/", n: "1", titre: "De la candidature à l'admission", texte: "Toutes les phases de la procédure, sur une frise.", duree: 7, niveau: "Découverte" },
  { href: "/comprendre/qui-decide/", n: "2", titre: "Qui décide ?", texte: "Ce que décide la formation, ce que fait la plateforme, ce qu'impose la loi.", duree: 8, niveau: "Découverte" },
  { href: "/comprendre/examen-des-dossiers/", n: "3", titre: "L'examen des dossiers", texte: "Le rôle des commissions et ce que l'on sait (ou pas) de leurs méthodes.", duree: 6, niveau: "Approfondissement" },
  { href: "/algorithmes/ordre-d-appel/", n: "4", titre: "L'ordre d'appel", texte: "Comment le classement devient l'ordre des propositions.", duree: 10, niveau: "Approfondissement" },
  { href: "/comprendre/quotas-et-priorites/", n: "5", titre: "Quotas et priorités", texte: "Taux de boursiers, de résidents, groupes de bacheliers.", duree: 8, niveau: "Approfondissement" },
  { href: "/comprendre/listes-d-attente/", n: "6", titre: "Les listes d'attente", texte: "Rang, position, dernier appelé : ce que disent les nombres.", duree: 9, niveau: "Découverte" },
  { href: "/comprendre/cas-particuliers/", n: "7", titre: "Cas particuliers", texte: "Sélectives ou non, BTS, BUT, CPGE, licences, apprentissage, internats.", duree: 8, niveau: "Approfondissement" },
];

export default function Comprendre() {
  return (
    <>
      <PageHeader
        eyebrow="Parcours pédagogique"
        titre="Comprendre Parcoursup, module par module"
        chapeau="Commencez par la version courte, puis approfondissez. Chaque page propose une explication simple, un schéma animé, les règles précises et ses sources."
      />
      <Container className="py-14">
        <ol className="grid gap-4 sm:grid-cols-2">
          {MODULES.map((m) => (
            <Reveal as="li" key={m.href}>
              <Link href={m.href} className="group flex h-full gap-5 rounded-3xl bg-surface p-6 shadow-soft ring-1 ring-line transition hover:-translate-y-1 hover:shadow-float">
                <span className="font-display text-5xl font-semibold leading-none text-line-strong transition group-hover:text-accent-2">{m.n}</span>
                <span className="flex-1">
                  <span className="flex items-center gap-3 text-xs text-muted">
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 font-semibold">{m.niveau}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {m.duree} min
                    </span>
                  </span>
                  <span className="mt-2 block font-display text-2xl font-semibold text-ink">{m.titre}</span>
                  <span className="mt-1.5 block leading-relaxed text-ink-2">{m.texte}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Ouvrir <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </Container>
    </>
  );
}

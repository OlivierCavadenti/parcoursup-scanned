import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { references } from "@/components/ui/References";
import { IDEES, type Verdict } from "@/content/idees-recues";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Idées reçues sur Parcoursup : vrai ou faux ?",
  description: "« Parcoursup choisit à la place des établissements », « le code est secret », « ma position ne bouge jamais »… Neuf idées reçues vérifiées, sources à l'appui.",
};

const VERDICT: Record<Verdict, string> = {
  Faux: "bg-rose-soft text-rose ring-rose/30",
  "Plutôt faux": "bg-amber-soft text-amber ring-amber/30",
  "Ça dépend": "bg-violet-soft text-violet ring-violet/30",
  "Vrai, mais": "bg-green-soft text-green ring-green/30",
};

export default function IdeesRecues() {
  const ids = [...new Set(IDEES.flatMap((i) => i.sources))];
  const { R, Liste } = references(ids);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: IDEES.map((i) => ({
      "@type": "Question",
      name: i.affirmation.replace(/[«»]/g, "").trim(),
      acceptedAnswer: { "@type": "Answer", text: `${i.verdict}. ${i.reponse} ${i.explication}` },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        miettes={[{ href: "/idees-recues/", label: "Idées reçues" }]}
        eyebrow="Vrai ou faux"
        titre="Les idées reçues sur Parcoursup"
        chapeau="Neuf affirmations fréquentes, vérifiées une à une. Quand la réponse dépend des situations, nous le disons plutôt que de trancher."
        niveau="Découverte"
        duree={8}
        verification="14 octobre 2026"
      />
      <Container size="md" className="space-y-6 py-12">
        {IDEES.map((i) => (
          <Reveal key={i.id}>
            <article id={i.id} className="scroll-mt-24 rounded-[28px] bg-surface p-6 shadow-soft ring-1 ring-line sm:p-8">
              <span className={cn("inline-block rounded-full px-3 py-1 text-sm font-bold ring-1 ring-inset", VERDICT[i.verdict])}>{i.verdict}</span>
              <h2 className="mt-4 font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">{i.affirmation}</h2>
              <p className="mt-3 text-lg font-medium text-ink">{i.reponse}</p>
              <p className="mt-3 leading-relaxed text-ink-2">
                {i.explication}
                {i.sources.map((s) => (
                  <R key={s} id={s} />
                ))}
              </p>
              <div className="mt-5 rounded-2xl bg-surface-2/70 p-4 ring-1 ring-line">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Contre-exemple</p>
                <p className="mt-1 text-ink-2">{i.contreExemple}</p>
              </div>
              {i.schema && (
                <Link href={i.schema.href} className="group mt-5 inline-flex items-center gap-1.5 font-semibold text-primary">
                  {i.schema.label} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              )}
              <p className="mt-4 text-xs text-muted">Vérifié le 14 octobre 2026 sur la base de la version 2024-2 du code et de la présentation officielle de mai 2023.</p>
            </article>
          </Reveal>
        ))}
        <Liste className="mt-10" />
      </Container>
    </>
  );
}

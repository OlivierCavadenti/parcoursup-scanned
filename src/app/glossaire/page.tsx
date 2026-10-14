import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/primitives";
import { GLOSSAIRE, TERME } from "@/content/glossaire";

export const metadata: Metadata = {
  title: "Glossaire de Parcoursup",
  description: "Ordre d'appel, rang limite, taux d'appel, barre internat, répondeur automatique, GDD… Toutes les notions de Parcoursup définies simplement.",
};

export default function Glossaire() {
  const tries = [...GLOSSAIRE].sort((a, b) => a.terme.localeCompare(b.terme, "fr"));
  const lettres = [...new Set(tries.map((t) => t.terme[0]!.toUpperCase()))];
  return (
    <>
      <PageHeader miettes={[{ href: "/glossaire/", label: "Glossaire" }]} eyebrow="Glossaire" titre="Les mots de Parcoursup" chapeau="Chaque terme technique du site, défini simplement. Les termes soulignés en pointillés dans les pages renvoient ici." />
      <Container size="md" className="py-12">
        <nav aria-label="Lettres" className="mb-10 flex flex-wrap gap-2">
          {lettres.map((l) => (
            <a key={l} href={`#lettre-${l}`} className="grid h-9 w-9 place-items-center rounded-full bg-surface font-semibold text-ink ring-1 ring-line hover:ring-ink/40">
              {l}
            </a>
          ))}
        </nav>
        <dl className="space-y-4">
          {tries.map((t, i) => (
            <div key={t.id} id={t.id} className="scroll-mt-24 rounded-3xl bg-surface p-6 ring-1 ring-line target:ring-2 target:ring-accent-2">
              {(i === 0 || tries[i - 1]!.terme[0]!.toUpperCase() !== t.terme[0]!.toUpperCase()) && <span id={`lettre-${t.terme[0]!.toUpperCase()}`} className="block scroll-mt-24" />}
              <dt className="font-display text-2xl font-semibold text-ink">{t.terme}</dt>
              <dd className="mt-2 leading-relaxed text-ink-2">{t.definition}</dd>
              <dd className="mt-3 flex flex-wrap gap-2 text-sm">
                {t.lien && (
                  <Link href={t.lien} className="font-semibold text-primary underline underline-offset-2">
                    En savoir plus
                  </Link>
                )}
                {t.voirAussi?.map((v) => (
                  <a key={v} href={`#${v}`} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-ink-2 hover:text-ink">
                    {TERME.get(v)?.terme}
                  </a>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </>
  );
}

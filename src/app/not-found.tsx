import { ButtonLink, Container } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container size="md" className="py-28 text-center">
      <p className="font-mono text-sm text-accent">Erreur 404</p>
      <h1 className="mt-3 font-display text-5xl font-semibold text-ink">Cette page n'est pas dans l'ordre d'appel.</h1>
      <p className="mt-4 text-lg text-ink-2">Elle n'existe pas, ou a changé d'adresse.</p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/">Retour à l'accueil</ButtonLink>
        <ButtonLink href="/comprendre/" variante="secondaire">
          Comprendre Parcoursup
        </ButtonLink>
      </div>
    </Container>
  );
}

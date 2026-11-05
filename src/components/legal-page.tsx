import { Container } from "./ui";
import { Prose } from "./prose";

export function LegalPage({ title, updated, body }: { title: string; updated: string; body: string[] }) {
  return (
    <Container className="pt-16">
      <h1 className="text-4xl font-medium sm:text-5xl">{title}</h1>
      <p className="mt-3 font-sans text-sm text-slate">{updated}</p>
      <div className="mt-8">
        <Prose body={body} />
      </div>
    </Container>
  );
}

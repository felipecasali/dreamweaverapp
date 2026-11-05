import type { DreamInterpreter, InterpretInput, InterpretOutput } from "./types";

/**
 * Placeholder provider used until a real model is chosen (AI_PROVIDER unset or "stub").
 * Produces a clearly labelled demo text so the full flow (journal, versions, quota)
 * can be tested end to end without any external API.
 */
const COPY = {
  en: {
    note: "Demo interpretation — the AI model has not been connected yet.",
    body: (style: string, words: string) =>
      `This is a sample reading in the "${style}" style. The images that stand out in your dream — ${words} — would be explored here, together with the feelings they carried and what they may echo from your waking life.`,
    fallbackTitle: "An untitled dream",
  },
  pt: {
    note: "Interpretação de demonstração — o modelo de IA ainda não foi conectado.",
    body: (style: string, words: string) =>
      `Esta é uma leitura de exemplo no estilo "${style}". As imagens que se destacam no seu sonho — ${words} — seriam exploradas aqui, junto com os sentimentos que trouxeram e o que podem refletir da sua vida desperta.`,
    fallbackTitle: "Um sonho sem título",
  },
  es: {
    note: "Interpretación de demostración: el modelo de IA aún no está conectado.",
    body: (style: string, words: string) =>
      `Esta es una lectura de ejemplo en el estilo "${style}". Las imágenes que destacan en tu sueño — ${words} — se explorarían aquí, junto con las emociones que trajeron y lo que pueden reflejar de tu vida despierta.`,
    fallbackTitle: "Un sueño sin título",
  },
} as const;

const PLEASANT = /\b(happy|calm|fly|flying|light|love|feliz|calma|voar|voando|luz|amor|volar|volando|alegr)/i;
const UNSETTLING = /\b(fall|falling|chase|chased|dark|fear|lost|cair|caindo|perseg|escuro|medo|perdid|caer|cayendo|oscur|miedo)/i;

function keyWords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4);
  return [...new Set(words)].slice(0, 3);
}

export const stubInterpreter: DreamInterpreter = {
  id: "stub",
  async interpret(input: InterpretInput): Promise<InterpretOutput> {
    const copy = COPY[input.locale];
    const words = keyWords(input.dream);
    const title = words.length
      ? words.map((w) => w[0].toUpperCase() + w.slice(1)).join(", ")
      : copy.fallbackTitle;
    const sentiment = PLEASANT.test(input.dream) ? 1 : UNSETTLING.test(input.dream) ? -1 : 0;

    return {
      title,
      body: `${copy.body(input.style, words.join(", ") || "…")}\n\n${copy.note}`,
      sentiment,
      model: "stub-v1",
    };
  },
};

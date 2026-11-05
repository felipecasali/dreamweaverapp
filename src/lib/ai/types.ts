import type { Locale } from "@/i18n/routing";

export const STYLES = ["default", "freud", "jung", "emotional", "spiritual", "cultural", "science"] as const;
export type InterpretationStyle = (typeof STYLES)[number];

export type InterpretInput = {
  dream: string;
  style: InterpretationStyle;
  locale: Locale;
  /** Age in years, only when the user saved a birth date. */
  age?: number;
};

export type InterpretOutput = {
  /** Short title for the journal entry, in the user's language. */
  title: string;
  /** Interpretation text shown to the user. Never contains instructions or system text. */
  body: string;
  /** -1 unsettling, 0 neutral, 1 pleasant */
  sentiment: -1 | 0 | 1;
  /** Provider/model identifier stored with the interpretation. */
  model: string;
};

export interface DreamInterpreter {
  readonly id: string;
  interpret(input: InterpretInput): Promise<InterpretOutput>;
}

import "server-only";
import { stubInterpreter } from "./stub";
import type { DreamInterpreter } from "./types";

export * from "./types";
export { buildSystemPrompt } from "./prompt";

/**
 * Picks the interpreter from AI_PROVIDER. To connect a real model, add a file in
 * this folder that implements DreamInterpreter (using buildSystemPrompt), and
 * register it here, e.g. `case "anthropic": return anthropicInterpreter;`.
 */
export function getInterpreter(): DreamInterpreter {
  switch (process.env.AI_PROVIDER ?? "stub") {
    case "stub":
    default:
      return stubInterpreter;
  }
}

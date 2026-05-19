import type { MessageKey } from "@/types/messages";

export type TerminalPhase =
  | { type: "divider" }
  | {
      type: "bar";
      labelKeys: MessageKey[];
      icons: string[];
      duration: number;
      tokenTarget?: number;
      showPercent?: boolean;
    }
  | { type: "lines"; lineKeys: MessageKey[] }
  | { type: "message"; textKey: MessageKey };

export type TerminalBlock = {
  type: "terminal-01";
  id: string;
  titleKey: MessageKey;
  sequence: TerminalPhase[];
};

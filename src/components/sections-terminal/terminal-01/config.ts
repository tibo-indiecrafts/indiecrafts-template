import type { TerminalBlock } from "./schema";

export const terminal01Key = "terminal-01" as const;
export const terminal01Namespace = "blocks.terminal-01" as const;

const ICONS = ["✦", "◆", "✶", "❋", "✸"];

export const terminal01Sample: Omit<TerminalBlock, "id"> = {
  type: "terminal-01",
  titleKey: "blocks.terminal-01.title",
  sequence: [
    { type: "divider" },
    {
      type: "bar",
      labelKeys: [
        "blocks.terminal-01.scanning",
        "blocks.terminal-01.analysing",
        "blocks.terminal-01.detecting",
        "blocks.terminal-01.profiling",
      ],
      icons: ICONS,
      duration: 3000,
      tokenTarget: 0.6,
      showPercent: true,
    },
    {
      type: "lines",
      lineKeys: [
        "blocks.terminal-01.newRole",
        "blocks.terminal-01.newTeam",
        "blocks.terminal-01.newChallenges",
      ],
    },
    { type: "divider" },
    {
      type: "bar",
      labelKeys: [
        "blocks.terminal-01.booting",
        "blocks.terminal-01.loading",
        "blocks.terminal-01.preparing",
        "blocks.terminal-01.initializing",
      ],
      icons: ICONS,
      duration: 3000,
      showPercent: false,
    },
    { type: "message", textKey: "blocks.terminal-01.message" },
    { type: "divider" },
    {
      type: "bar",
      labelKeys: ["blocks.terminal-01.almostThere"],
      icons: ICONS,
      duration: 2000,
      tokenTarget: 0.8,
      showPercent: false,
    },
  ],
};

import type {
  CommandMenuBlock,
  CommandMenuColorGroup,
  CommandMenuNavItem,
  CommandMenuPageGroup,
} from "./schema";

export const commandMenu03Key = "command-menu-03" as const;
export const commandMenu03Namespace = "blocks.command-menu-03" as const;

export const commandMenu03NavItems: readonly CommandMenuNavItem[] = [
  { id: "home", href: "/", keywords: ["home", "main", "index"] },
  { id: "dashboard", href: "/dashboard", keywords: ["dashboard", "overview"] },
  { id: "settings", href: "/settings", keywords: ["settings", "preferences"] },
];

export const commandMenu03PageGroups: readonly CommandMenuPageGroup[] = [
  {
    id: "getting-started",
    pages: [
      {
        id: "introduction",
        href: "/docs/introduction",
        keywords: ["intro", "start"],
      },
      {
        id: "installation",
        href: "/docs/installation",
        keywords: ["install", "setup"],
      },
      {
        id: "quick-start",
        href: "/docs/quick-start",
        keywords: ["quick", "begin"],
      },
    ],
  },
  {
    id: "utilities",
    pages: [
      {
        id: "typography",
        href: "/docs/utilities/typography",
        keywords: ["text", "font"],
      },
      {
        id: "colors",
        href: "/docs/utilities/colors",
        keywords: ["color", "theme"],
      },
      {
        id: "spacing",
        href: "/docs/utilities/spacing",
        keywords: ["margin", "padding"],
      },
    ],
  },
];

export const commandMenu03ColorGroups: readonly CommandMenuColorGroup[] = [
  {
    id: "neutral",
    colors: [
      { id: "neutral-50", className: "neutral-50", value: "oklch(0.985 0 0)" },
      { id: "neutral-100", className: "neutral-100", value: "oklch(0.97 0 0)" },
      {
        id: "neutral-200",
        className: "neutral-200",
        value: "oklch(0.922 0 0)",
      },
      {
        id: "neutral-500",
        className: "neutral-500",
        value: "oklch(0.556 0 0)",
      },
      {
        id: "neutral-900",
        className: "neutral-900",
        value: "oklch(0.205 0 0)",
      },
    ],
  },
  {
    id: "blue",
    colors: [
      {
        id: "blue-50",
        className: "blue-50",
        value: "oklch(0.97 0.014 254.604)",
      },
      {
        id: "blue-500",
        className: "blue-500",
        value: "oklch(0.623 0.214 259.815)",
      },
      {
        id: "blue-600",
        className: "blue-600",
        value: "oklch(0.546 0.245 262.881)",
      },
    ],
  },
];

export const commandMenu03Sample: Omit<CommandMenuBlock, "id"> = {
  type: "command-menu-03",
  defaultOpen: true,
};

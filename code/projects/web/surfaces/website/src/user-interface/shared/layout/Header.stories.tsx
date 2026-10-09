import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import en from "../../../../messages/en.json";
import { Header } from "./Header";
import { ThemeProvider } from "./ThemeProvider";

/**
 * Production site header: logo, the Sanity `navigation` items (plain links + dropdown
 * groups; a sheet below `lg`), locale switcher, theme toggle, and the auth link. Wrapped in
 * the real `ThemeProvider`, forced to the toolbar's `data-theme`.
 */
const meta = {
  title: "Layout/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    name: "Northwind Studio",
    items: [
      { kind: "internal", href: "/blog", label: "Journal", newTab: false },
      {
        kind: "group",
        label: "Services",
        icon: "sparkles",
        children: [
          {
            kind: "external",
            href: "https://northwind.example/design",
            label: "Design",
            newTab: false,
            icon: "rocket",
            description: "Brand and web design",
          },
          {
            kind: "external",
            href: "https://northwind.example/build",
            label: "Build",
            newTab: false,
            description: "Next.js sites on Sanity",
          },
        ],
      },
    ],
    showThemeToggle: true,
    themeModes: ["light", "dark"],
    showLocaleSwitcher: true,
  },
  decorators: [
    (Story) => (
      <ThemeProvider
        attribute="data-theme"
        forcedTheme={document.documentElement.dataset.theme ?? "light"}
      >
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full chrome. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: en.nav.home })).toHaveAttribute(
      "href",
      "/",
    );
    await expect(
      canvas.getByRole("button", { name: en.common.changeLanguage }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: en.common.switchTheme }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: en.nav.signIn })).toBeInTheDocument();
  },
};

/** Minimal chrome — no nav items, no locale switcher, no theme toggle. */
export const Minimal: Story = {
  args: { items: [], showLocaleSwitcher: false, showThemeToggle: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("button", { name: en.nav.openMenu })).toBeNull();
    await expect(
      canvas.queryByRole("button", { name: en.common.switchTheme }),
    ).toBeNull();
  },
};

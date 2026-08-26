import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, within } from "storybook/test";
import { Header } from "./Header";
import { ThemeProvider } from "./ThemeProvider";

/**
 * Production site header. Exercises the next-intl mock (`nav.home`, plus
 * `LocaleSwitcher`/`ThemeToggle`/`AuthMenu`'s own namespaces), the Clerk mock
 * (via `AuthMenu`), and `@/i18n/routing`'s mocked `Link`. Wrapped in the real
 * `ThemeProvider` so `ThemeToggle`'s `useTheme` has a context.
 */
const meta = {
  title: "Website/Layout/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    name: "Indiecrafts",
    items: [
      {
        kind: "external",
        href: "https://example.com/pricing",
        label: "Pricing",
        newTab: false,
      },
      {
        kind: "group",
        label: "Product",
        children: [
          {
            kind: "external",
            href: "https://example.com/features",
            label: "Features",
            newTab: false,
            description: "What's included",
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
      <ThemeProvider attribute="data-theme" defaultTheme="system">
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Indiecrafts")).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Pricing" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Switch theme" })).toBeVisible();
  },
};

/** Opening the "Product" dropdown reveals its rich links. */
export const OpensDropdown: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Product" }));
    await expect(await screen.findByRole("link", { name: /Features/ })).toBeVisible();
  },
};

/** Minimal chrome — no nav items, no locale switcher, no theme toggle. */
export const Minimal: Story = {
  args: { items: [], showLocaleSwitcher: false, showThemeToggle: false },
};

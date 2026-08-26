import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, within } from "storybook/test";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeProvider } from "./ThemeProvider";

/**
 * Light/dark theme dropdown. `useTheme` (next-themes) needs a provider in the
 * tree, so every story wraps in the real `ThemeProvider` (not mocked — a thin
 * client wrapper, safe to mount). Exercises the next-intl mock (`common.switchTheme`
 * / `themeLight` / `themeDark`).
 */
const meta = {
  title: "Website/Shared/ThemeToggle",
  component: ThemeToggle,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { modes: ["light", "dark"] },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="data-theme" defaultTheme="system">
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Trigger button — the aria-label comes from the next-intl mock. */
export const Trigger: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Switch theme" })).toBeVisible();
  },
};

/** Opened — lists the configured modes. */
export const Opened: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Switch theme" }));
    await expect(
      await screen.findByRole("menuitemradio", { name: "Light" }),
    ).toBeVisible();
    await expect(screen.getByRole("menuitemradio", { name: "Dark" })).toBeVisible();
  },
};

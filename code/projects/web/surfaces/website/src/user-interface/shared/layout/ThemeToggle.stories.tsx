import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, within } from "storybook/test";
import en from "../../../../messages/en.json";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Light/dark theme dropdown. `useTheme` needs the real `ThemeProvider` above it; the theme
 * is forced to the toolbar's `data-theme`, so picking a mode here does not repaint.
 */
const meta = {
  title: "Layout/ThemeToggle",
  component: ThemeToggle,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { modes: ["light", "dark"] },
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
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The trigger button. */
export const Trigger: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: en.common.switchTheme }),
    ).toBeVisible();
  },
};

/** Opened — one radio item per configured mode. */
export const Opened: Story = {
  parameters: {
    // @debt ACCESSIBILITY - Radix hides the page behind an open modal menu (aria-hidden) while the trigger stays focusable — upstream behavior.
    a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: en.common.switchTheme }));
    await expect(
      await screen.findByRole("menuitemradio", { name: en.common.themeLight }),
    ).toBeVisible();
    await expect(
      screen.getByRole("menuitemradio", { name: en.common.themeDark }),
    ).toBeVisible();
  },
};

/** A single offered mode (a site that ships light only). */
export const SingleMode: Story = {
  args: { modes: ["light"] },
};

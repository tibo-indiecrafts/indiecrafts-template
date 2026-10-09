import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, within } from "storybook/test";
import en from "../../../../messages/en.json";
import { locales } from "@/config";
import { LocaleSwitcher } from "./LocaleSwitcher";

/**
 * Locale switcher dropdown. Lists the configured `locales` from `@/config`. Switching is
 * inert here: the `next-intl/navigation` mock has no router.
 */
const meta = {
  title: "Layout/LocaleSwitcher",
  component: LocaleSwitcher,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof LocaleSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Globe icon trigger (the header default). */
export const Icon: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: en.common.changeLanguage }),
    ).toBeVisible();
  },
};

/** The current locale's code as the trigger (e.g. "EN"). */
export const Code: Story = {
  args: { shape: "code" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: en.common.changeLanguage }),
    ).toHaveTextContent("EN");
  },
};

/** Opened — one radio item per configured locale, the current one checked. */
export const Opened: Story = {
  parameters: {
    // @debt ACCESSIBILITY - Radix hides the page behind an open modal menu (aria-hidden) while the trigger stays focusable — upstream behavior.
    a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: en.common.changeLanguage }));
    const items = await screen.findAllByRole("menuitemradio");
    await expect(items).toHaveLength(locales.length);
    await expect(screen.getByRole("menuitemradio", { checked: true })).toHaveTextContent(
      "EN",
    );
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { LocaleSwitcher } from "./LocaleSwitcher";

/**
 * Locale switcher dropdown. Exercises the **next-intl** mock (`useTranslations`,
 * `useLocale`) and the `@indiecrafts/packages-web-i18n` navigation shim (which
 * builds its hooks from the aliased `next-intl/navigation.createNavigation`).
 * Reads `locales` / `localeMap` from `@/config` via the `@/` alias.
 */
const meta = {
  title: "Website/Shared/LocaleSwitcher",
  component: LocaleSwitcher,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof LocaleSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Icon trigger. The aria-label comes from the next-intl mock. */
export const Icon: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Proves the next-intl mock resolved: t("changeLanguage") → "Change language".
    await expect(canvas.getByRole("button", { name: "Change language" })).toBeVisible();
  },
};

/** Current-locale code trigger (e.g. "EN"). */
export const Code: Story = {
  args: { shape: "code" },
};

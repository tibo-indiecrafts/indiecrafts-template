import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ShellOverlays } from "./ShellOverlays";

/**
 * All the mobile shell overlays — offline strip, announcements, consent, legal
 * re-acceptance, version, locale-suggest. `features.requireConsent` is off (`@/config`),
 * so the cookie-consent banner never shows; but there's no stored legal-acceptance
 * record (the `AsyncStorage` mock starts empty), so `needsReacceptance` is `true` and
 * the re-acceptance prompt DOES render by default. `EXPO_PUBLIC_WEBSITE_URL` is bound
 * to `""`, so the version banner never mounts (no network call).
 */
const meta = {
  title: "Mobile/ShellOverlays",
  component: ShellOverlays,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { locale: "en", chooseLocale: () => {}, hasChoice: true },
} satisfies Meta<typeof ShellOverlays>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fresh visitor: no legal-acceptance record yet → the re-acceptance prompt shows. */
export const FreshVisitor: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByRole("alert")).toBeVisible();
    await expect(canvas.getByText("Our policies changed")).toBeVisible();
  },
};

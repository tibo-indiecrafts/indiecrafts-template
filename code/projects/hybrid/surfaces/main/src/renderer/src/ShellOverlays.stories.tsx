import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ShellOverlays } from "./shell";

/**
 * All the shell overlays — announcements, consent, legal re-acceptance, version,
 * locale-suggest. `features.requireConsent` is off (`@/config`), so the cookie-consent
 * banner never shows; but there's no stored legal-acceptance record (a fresh
 * `localStorage`), so `needsReacceptance` is `true` and the re-acceptance prompt DOES
 * render by default. `VITE_WEBSITE_URL` is bound to `""`, so the version banner never
 * mounts (no network call).
 */
const meta = {
  title: "Hybrid/ShellOverlays",
  component: ShellOverlays,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => {
      localStorage.clear();
      return <Story />;
    },
  ],
} satisfies Meta<typeof ShellOverlays>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fresh visitor: no legal-acceptance record yet → the re-acceptance prompt shows. */
export const FreshVisitor: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("dialog", { name: "Our policies changed" }),
    ).toBeVisible();
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ShellOverlays } from "./ShellOverlays";

/**
 * Compliance + version overlays for the app shell. Exercises the **next-intl**
 * mock and the `localStorage`-backed consent/legal stores (real `localStorage`
 * in the browser test env — no mock needed). The app's `features.requireConsent`
 * is off by default (`@/config`), so the cookie-consent banner never shows; but
 * `needsReacceptance` is `true` for a visitor with no stored legal-acceptance
 * record, so the legal re-acceptance prompt DOES render by default. Each story
 * clears `localStorage` first so the "fresh visitor" state is deterministic.
 */
const meta = {
  title: "App/ShellOverlays",
  component: ShellOverlays,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { commit: "", mode: "none", gpcSignal: false },
  decorators: [
    (Story) => {
      localStorage.clear();
      return <Story />;
    },
  ],
} satisfies Meta<typeof ShellOverlays>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fresh visitor: no consent record needed (requireConsent is off), but no
 * legal-acceptance record yet → the re-acceptance prompt shows. */
export const FreshVisitor: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("dialog", { name: "Our legal documents changed" }),
    ).toBeVisible();
  },
};

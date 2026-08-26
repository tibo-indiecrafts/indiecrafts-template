import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { OfflineBanner } from "./OfflineBanner";

/**
 * Slim connectivity banner, shown only while `navigator.onLine` is false.
 * Message is resolved server-side and passed in — no i18n mock needed.
 * The `useOnlineStatus` hook reads `navigator.onLine` (true in the test
 * browser), so the default render is the "online" (hidden) state; a second
 * story forces `navigator.onLine = false` to show the banner.
 */
const meta = {
  title: "Website/Shared/OfflineBanner",
  component: OfflineBanner,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { message: "You're offline — some features may be unavailable." },
} satisfies Meta<typeof OfflineBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Online (the default in a real browser) — renders nothing. */
export const Online: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("status")).not.toBeInTheDocument();
  },
};

/** Offline — the banner shows, announced via `aria-live="polite"`. */
export const Offline: Story = {
  play: async ({ canvasElement }) => {
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: false,
    });
    window.dispatchEvent(new Event("offline"));
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByText("You're offline — some features may be unavailable."),
    ).toBeVisible();
    // Restore, so this story doesn't leak state into the next test.
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    });
    window.dispatchEvent(new Event("online"));
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { LegalLinks } from "./shell";

/**
 * The legal link-out list (a Home section) — each button opens a website legal page
 * externally via `window.desktop.openExternal` (stubbed in `.storybook-hybrid/preview.tsx`).
 * `VITE_WEBSITE_URL` is bound to `""`, so every button renders disabled (no page to
 * link to) — matches production with no website URL configured.
 */
const meta = {
  title: "Hybrid/LegalLinks",
  component: LegalLinks,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof LegalLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Privacy policy" })).toBeDisabled();
  },
};

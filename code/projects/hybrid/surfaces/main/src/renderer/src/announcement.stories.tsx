import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { AnnouncementChrome } from "./announcement";

/**
 * Logged-in-only announcement chrome (banner + toast), fed by the shared api Worker.
 * Exercises the `@clerk/clerk-react` mock (signed in by default — see
 * `.storybook/clerk-react-mock.tsx`). `VITE_API_URL` is stubbed to `""` in
 * `.storybook-hybrid/main.ts`, so `fetchAnnouncements` short-circuits before ever
 * calling `fetch` — no network on render, no live announcement data, so the component
 * renders nothing (the same as production with no live content).
 */
const meta = {
  title: "Hybrid/AnnouncementChrome",
  component: AnnouncementChrome,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AnnouncementChrome>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No live announcement data (no API URL configured) → renders nothing, no crash. */
export const NoAnnouncement: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("region")).not.toBeInTheDocument();
  },
};

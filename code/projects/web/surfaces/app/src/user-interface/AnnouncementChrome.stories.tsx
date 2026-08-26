import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { AnnouncementChrome } from "./AnnouncementChrome";

/**
 * Logged-in-only announcement chrome. Exercises the **Clerk** mock (signed in
 * by default) and **next-intl** mock. `NEXT_PUBLIC_API_URL` is stubbed to `""`
 * in `.storybook-app/main.ts`, so `fetchAnnouncements` short-circuits before
 * ever calling `fetch` — no network on render, no live announcement data, so
 * the component renders nothing (the same as production with no live content).
 */
const meta = {
  title: "App/AnnouncementChrome",
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

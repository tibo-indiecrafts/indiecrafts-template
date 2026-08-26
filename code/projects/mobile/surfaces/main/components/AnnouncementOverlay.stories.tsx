import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { AnnouncementOverlay } from "./AnnouncementOverlay";

/**
 * Logged-in-only announcement chrome (banner + toast) for the mobile shell. Exercises
 * the `@clerk/clerk-expo` mock (signed in by default — see `.storybook/clerk-expo-mock.tsx`)
 * and the online `@react-native-community/netinfo` mock. `EXPO_PUBLIC_API_URL` is bound
 * to `""` in `.storybook-mobile/main.ts`, so `getAnnouncements` short-circuits before
 * ever calling `fetch` — no network on render, no live announcement data, so the
 * component renders nothing (the same as production with no live content).
 */
const meta = {
  title: "Mobile/AnnouncementOverlay",
  component: AnnouncementOverlay,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { locale: "en" },
} satisfies Meta<typeof AnnouncementOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No live announcement data (no API URL configured) → renders nothing, no crash. */
export const NoAnnouncement: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("link")).not.toBeInTheDocument();
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { App } from "./App";

/**
 * The renderer's root screen: theme toggle + `AuthPanel` (Clerk-mocked, signed in by
 * default) + `LegalLinks`, wrapped by the error boundary and the shell overlays.
 * `VITE_WEBSITE_URL`/`VITE_API_URL` are stubbed to `""` in `.storybook-hybrid/main.ts`,
 * so no story hits the network (legal link-out buttons stay disabled; announcements
 * and the version check no-op). No stored legal-acceptance record → the re-acceptance
 * prompt renders on top by default (same as the app/mobile shells).
 */
const meta = {
  title: "Hybrid/App",
  component: App,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => {
      localStorage.clear();
      return <Story />;
    },
  ],
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fresh visitor: home content + signed-in auth panel + the legal re-acceptance prompt. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("indiecrafts")).toBeVisible();
    await expect(canvas.getByText("You are signed in.")).toBeVisible();
    await expect(
      canvas.getByRole("dialog", { name: "Our policies changed" }),
    ).toBeVisible();
  },
};

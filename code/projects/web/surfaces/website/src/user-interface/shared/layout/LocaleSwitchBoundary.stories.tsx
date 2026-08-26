import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { LocaleSwitchBoundary } from "./LocaleSwitchBoundary";

/**
 * Client boundary that injects the app's content-route resolver
 * (`resolveTranslatedPath`) into the shared `LocaleSwitchProvider`
 * (`@indiecrafts/packages-web-i18n`, real — not mocked, a plain context provider).
 * The resolver itself only runs on a locale switch (a `fetch` to
 * `/api/i18n/translated-slug`), never at render, so mounting it here doesn't
 * touch the network.
 */
const meta = {
  title: "Website/Shared/LocaleSwitchBoundary",
  component: LocaleSwitchBoundary,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { children: <p>Page content</p> },
} satisfies Meta<typeof LocaleSwitchBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Page content")).toBeVisible();
  },
};

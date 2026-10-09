import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import en from "../../../../messages/en.json";
import { LocaleSwitchBoundary } from "./LocaleSwitchBoundary";
import { LocaleSwitcher } from "./LocaleSwitcher";

/**
 * Client boundary that injects the app's content-route resolver into the shared locale
 * switcher. The resolver runs only on a switch, never at render, so nothing hits the
 * network here.
 */
const meta = {
  title: "Layout/LocaleSwitchBoundary",
  component: LocaleSwitchBoundary,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { children: <LocaleSwitcher /> },
} satisfies Meta<typeof LocaleSwitchBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Wraps the locale switcher it serves. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: en.common.changeLanguage }),
    ).toBeVisible();
  },
};

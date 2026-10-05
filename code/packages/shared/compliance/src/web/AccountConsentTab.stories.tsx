import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AccountConsentTab } from "./AccountConsentTab";

/**
 * The account widget's "Privacy & consent" page body: re-open the cookie choices. It
 * writes the same `localStorage` record as the banner and hands the saved choices +
 * version to the surface (`onSaved`), which logs and applies them.
 */
const meta = {
  title: "Compliance/AccountConsentTab",
  component: AccountConsentTab,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    storageKey: "storybook.cookie-consent",
    version: "1",
    categories: [
      {
        key: "necessary",
        title: "Necessary",
        description: "Required for the site to work. Always on.",
        required: true,
      },
      {
        key: "analytics",
        title: "Analytics",
        description: "Help us understand how the site is used.",
      },
      {
        key: "marketing",
        title: "Marketing",
        description: "Used to measure ad campaigns.",
      },
    ],
    title: "Cookie preferences",
    saveLabel: "Save",
    onSaved: fn(),
  },
  beforeEach: () => localStorage.removeItem("storybook.cookie-consent"),
} satisfies Meta<typeof AccountConsentTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Behavior: turning Analytics on and saving hands the choices + version to the surface. */
export const SavesChoices: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("switch", { name: /analytics/i }));
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(args.onSaved).toHaveBeenCalledWith(
      { analytics: true, marketing: false },
      "1",
    );
  },
};

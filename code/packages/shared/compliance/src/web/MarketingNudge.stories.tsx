import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { MarketingNudge } from "./MarketingNudge";

const SNOOZE = "storybook.marketing-nudge";

/**
 * The one-time sign-in prompt for the commercial-email opt-in. It shows only when the
 * user has no decision on record (`read()` → null); Yes/No record one, × snoozes on
 * this device.
 */
const meta = {
  title: "Compliance/MarketingNudge",
  component: MarketingNudge,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    read: async () => null,
    write: fn(async () => {}),
    snoozeKey: SNOOZE,
    copy: {
      title: "Want occasional emails from us and our partners?",
      yes: "Yes, please",
      no: "No thanks",
      dismiss: "Not now",
    },
  },
  beforeEach: () => localStorage.removeItem(SNOOZE),
} satisfies Meta<typeof MarketingNudge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Behavior: "Yes" records the opt-in. */
export const RecordsYes: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole("button", { name: "Yes, please" }),
    );
    await expect(args.write).toHaveBeenCalledWith(true);
  },
};

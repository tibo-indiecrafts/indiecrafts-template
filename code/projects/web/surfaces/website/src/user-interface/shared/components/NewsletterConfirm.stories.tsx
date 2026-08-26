import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { NewsletterConfirm, type NewsletterConfirmLabels } from "./NewsletterConfirm";

/**
 * Double opt-in confirm — the interactive half of the newsletter confirm page.
 * Copy is resolved server-side and passed in, so no i18n mock is needed. A
 * missing `token` starts in the "invalid" state without any fetch — the only
 * state safely reachable without a network call in a story (clicking "Confirm"
 * would POST to `/api/newsletter/confirm`, so the idle state's button is not
 * exercised in `play`).
 */
const LABELS: NewsletterConfirmLabels = {
  heading: "Confirm your subscription",
  body: "One more step — click below to confirm you'd like to receive the newsletter.",
  button: "Confirm subscription",
  confirmedHeading: "You're subscribed",
  confirmedBody: "Thanks for confirming — the first issue lands soon.",
  invalidHeading: "This link isn't valid",
  invalidBody: "The confirmation link is missing or has expired. Try subscribing again.",
  homeCta: "Back to home",
};

const meta = {
  title: "Website/Shared/NewsletterConfirm",
  component: NewsletterConfirm,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { labels: LABELS },
} satisfies Meta<typeof NewsletterConfirm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A valid token — shows the "confirm" prompt (idle state, no fetch triggered). */
export const Idle: Story = {
  args: { token: "demo-token" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Confirm your subscription")).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Confirm subscription" }),
    ).toBeVisible();
  },
};

/** No token → invalid immediately, no fetch. */
export const Invalid: Story = {
  args: { token: "" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("This link isn't valid")).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Back to home" })).toBeVisible();
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { ErasureRequestForm } from "./ErasureRequestForm";

/**
 * Anonymous branded erasure-request form. Posts to the public worker route
 * via `submitErasureRequest` — not exercised in `play`. `TurnstileWidget`
 * renders nothing here (no public Turnstile site key bound in Storybook), so
 * the submit button is enabled once an email is typed.
 */
const meta = {
  title: "Website/Erasure/ErasureRequestForm",
  component: ErasureRequestForm,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      heading: "Request data erasure",
      body: "Enter your email — we'll send you a link to confirm the erasure.",
      emailLabel: "Your email",
      emailPlaceholder: "you@example.com",
      submitButton: "Request erasure",
      pending: "Sending…",
      sent: "If that email is on file, a confirmation link is on its way.",
      turnstile: "Please complete the challenge and try again.",
      error: "Something went wrong. Please try again.",
    },
  },
} satisfies Meta<typeof ErasureRequestForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Request data erasure")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Request erasure" })).toBeDisabled();
  },
};

/** Typing an email enables the submit button (Turnstile is inactive in Storybook). */
export const EmailEntered: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Your email"), "you@example.com");
    await expect(canvas.getByRole("button", { name: "Request erasure" })).toBeEnabled();
  },
};

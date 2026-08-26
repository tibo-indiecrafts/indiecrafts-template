import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { ErasureConfirmForm } from "./ErasureConfirmForm";

/**
 * Anonymous branded erasure-confirm form. Posts to the public worker route
 * via `submitErasureConfirm` — not exercised in `play` (no real network calls
 * in stories); these stories cover the idle form render + typing.
 */
const meta = {
  title: "Website/Erasure/ErasureConfirmForm",
  component: ErasureConfirmForm,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    token: "demo-token",
    copy: {
      heading: "Confirm data erasure",
      body: "Type your email to confirm you'd like your data erased.",
      emailLabel: "Your email",
      emailPlaceholder: "you@example.com",
      submitButton: "Confirm erasure",
      pending: "Confirming…",
      success: "Your data has been erased.",
      partial: "Most of your data was erased; some needs manual follow-up.",
      mismatch: "That email doesn't match the request.",
      expired: "This link has expired. Request erasure again.",
      error: "Something went wrong. Please try again.",
    },
  },
} satisfies Meta<typeof ErasureConfirmForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Confirm data erasure")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Confirm erasure" })).toBeDisabled();
  },
};

/** Typing an email enables the submit button. */
export const EmailEntered: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Your email"), "you@example.com");
    await expect(canvas.getByRole("button", { name: "Confirm erasure" })).toBeEnabled();
  },
};

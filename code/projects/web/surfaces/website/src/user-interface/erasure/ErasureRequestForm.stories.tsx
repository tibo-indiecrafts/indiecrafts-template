import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import en from "../../../messages/en.json";
import { ErasureRequestForm } from "./ErasureRequestForm";

const copy = en.legal.erasure.request;

/**
 * Anonymous erasure-request form: a signed-out visitor submits their email (plus a
 * Turnstile challenge) to start data erasure. No Turnstile site key is bound in Storybook,
 * so the widget is inactive. Submitting POSTs to the shared api, so no story submits.
 */
const meta = {
  title: "Erasure/ErasureRequestForm",
  component: ErasureRequestForm,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy },
} satisfies Meta<typeof ErasureRequestForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Empty form — submit stays disabled until an email is typed. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: copy.heading })).toBeVisible();
    await expect(canvas.getByRole("button", { name: copy.submitButton })).toBeDisabled();
  },
};

/** Typing an email enables submit. */
export const EmailEntered: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(copy.emailLabel), "ada@example.com");
    await expect(canvas.getByRole("button", { name: copy.submitButton })).toBeEnabled();
  },
};

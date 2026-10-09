import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import en from "../../../messages/en.json";
import { ErasureConfirmForm } from "./ErasureConfirmForm";

const copy = en.legal.erasure.confirm;

/**
 * Anonymous erasure-confirm form: the visitor opened the emailed link and types their email
 * to confirm. The token is opaque and never rendered. Submitting POSTs to the shared api,
 * so no story submits.
 */
const meta = {
  title: "Erasure/ErasureConfirmForm",
  component: ErasureConfirmForm,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy, token: "demo-token" },
} satisfies Meta<typeof ErasureConfirmForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Empty form — submit stays disabled until an email is typed. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: copy.heading })).toBeVisible();
    await expect(canvas.getByRole("button", { name: copy.submitButton })).toBeDisabled();
    await expect(canvas.queryByText("demo-token")).toBeNull();
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

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { DataRequestForm } from "./DataRequestForm";
import docs from "./DataRequestForm.md?raw";

/**
 * The GDPR data-subject request form. Posts to `/api/data-request` (inert in
 * Storybook). All copy is passed in — resolved server-side from `messages`.
 */
const meta = {
  title: "Web/UI Components/DataRequestForm",
  component: DataRequestForm,
  tags: ["autodocs"],
  parameters: { layout: "padded", docs: { description: { component: docs } } },
  args: {
    heading: "Exercise your data rights",
    body: "Choose a right and we'll respond within one month.",
    legend: "Which right do you want to exercise?",
    options: [
      { value: "access", label: "Access my data" },
      { value: "rectification", label: "Correct my data" },
      { value: "erasure", label: "Erase my data" },
      { value: "portability", label: "Export my data" },
      { value: "objection", label: "Object to processing" },
      { value: "restriction", label: "Restrict processing" },
      { value: "withdraw-consent", label: "Withdraw consent" },
    ],
    emailLabel: "Your email",
    emailPlaceholder: "you@example.com",
    messageLabel: "Message (optional)",
    messagePlaceholder: "Add any detail that helps us handle your request.",
    consentText: "I agree that this email is used only to handle my request.",
    submitLabel: "Send request",
    successMessage:
      "Thanks — we've received your request and will reply within one month.",
    errorMessage: "Something went wrong. Please try again.",
    locale: "en",
  },
} satisfies Meta<typeof DataRequestForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoBody: Story = {
  args: { heading: "Data request", body: undefined },
};

/** Behavior: picking a right checks its radio. */
export const SelectsRight: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const erase = canvas.getByRole("radio", { name: "Erase my data" });
    await expect(erase).not.toBeChecked();
    await userEvent.click(erase);
    await expect(erase).toBeChecked();
  },
};

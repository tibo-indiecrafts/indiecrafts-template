import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, spyOn, userEvent, waitFor, within } from "storybook/test";
import { DeleteAccountSection } from "./DeleteAccountSection";
import docs from "./DeleteAccountSection.md?raw";

/**
 * The GDPR self-service "Delete my account" panel. Posts to
 * `${apiUrl}/v1/erasure/self` via `submitAccountErasure` — stubbed in Storybook.
 * Clerk-free; `getToken` and `apiUrl` are injected by the surface.
 */
const meta = {
  title: "Compliance/DeleteAccountSection",
  component: DeleteAccountSection,
  tags: ["autodocs"],
  parameters: { layout: "padded", docs: { description: { component: docs } } },
  args: {
    copy: {
      heading: "Delete my account",
      body: "This permanently erases your account and its data. Type your email to confirm.",
      emailLabel: "Your email",
      emailPlaceholder: "you@example.com",
      confirmButton: "Delete my account",
      pending: "Deleting…",
      success: "Your account has been deleted.",
      partial: "Most of your data was erased; some needs manual follow-up.",
      error: "Something went wrong. Please try again.",
      mismatch: "That email doesn't match your account.",
      survey: {
        legend: "Before you go, help us improve (optional)",
        reasonLabel: "What's the main reason you're leaving?",
        reasons: {
          too_expensive: "Too expensive",
          not_using: "Not using it enough",
          missing_feature: "Missing a feature I need",
          found_alternative: "Found a better alternative",
          too_hard: "Too hard to use",
          privacy: "Privacy concerns",
          other: "Other",
        },
        feedbackLabel: "Anything else you'd like to tell us?",
        feedbackPlaceholder: "Your feedback helps us improve…",
        competitorLabel: "Who are you switching to?",
        competitorPlaceholder: "e.g. Acme",
      },
    },
    apiUrl: "https://api.example.test",
    getToken: async () => "stub-token",
    onDeleted: fn(),
  },
} satisfies Meta<typeof DeleteAccountSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Behavior: typing an email and confirming posts the erasure request and fires `onDeleted`. */
export const DeletesAccount: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    await userEvent.type(
      canvas.getByLabelText("Your email"),
      "you@example.com",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Delete my account" }),
    );

    await waitFor(() => expect(args.onDeleted).toHaveBeenCalled());
    fetchSpy.mockRestore();
  },
};

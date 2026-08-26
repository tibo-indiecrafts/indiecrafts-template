import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, spyOn, userEvent, waitFor, within } from "storybook/test";
import { AccountDeletePanel } from "./AccountDeletePanel";

/**
 * Wraps the shared `DeleteAccountSection` + `ExportSection` with Clerk's
 * `getToken`/`signOut` (the **Clerk** mock) and the app's `useRouter`. Network
 * (`/v1/erasure/self`, `/v1/export`) only happens on a user action (submit /
 * click), never on render — the default story hits no network.
 */
const meta = {
  title: "App/Account/AccountDeletePanel",
  component: AccountDeletePanel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
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
    },
    exportCopy: {
      heading: "Download my data",
      body: "Get a copy of your account data.",
      button: "Download my data",
      pending: "Preparing…",
      success: "Your export is ready.",
      error: "Something went wrong. Please try again.",
    },
    showExport: true,
  },
} satisfies Meta<typeof AccountDeletePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Behavior: typing an email and confirming posts the erasure request. */
export const DeletesAccount: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    await userEvent.type(canvas.getByLabelText("Your email"), "you@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Delete my account" }));

    await waitFor(() =>
      expect(canvas.getByText("Your account has been deleted.")).toBeVisible(),
    );
    fetchSpy.mockRestore();
  },
};

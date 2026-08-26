import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { AccountDeletePanel } from "./AccountDeletePanel";

/**
 * Client wrapper around the shared `DeleteAccountSection` + `ExportSection`,
 * wiring Clerk's `getToken`/`signOut` (mocked — see `.storybook/clerk-mock.tsx`)
 * and routing home after deletion (`@/i18n/routing`'s mocked `useRouter`).
 * Copy matches `DeleteAccountSection.stories.tsx` / `ExportSection`'s shape.
 */
const meta = {
  title: "Website/Account/AccountDeletePanel",
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
      body: "Get a copy of your account data as a JSON file.",
      button: "Download my data",
      pending: "Preparing…",
      success: "Download ready.",
      error: "Something went wrong. Please try again.",
    },
    showExport: true,
  },
} satisfies Meta<typeof AccountDeletePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Both sections shown — export + delete. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Download my data" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Delete my account" })).toBeVisible();
  },
};

/** Export gated off (e.g. plan without data export). */
export const NoExport: Story = {
  args: { showExport: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole("button", { name: "Download my data" }),
    ).not.toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Delete my account" })).toBeVisible();
  },
};

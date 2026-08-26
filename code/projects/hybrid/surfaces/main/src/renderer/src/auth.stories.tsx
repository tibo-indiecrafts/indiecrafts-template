import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { AuthPanel, HybridSessionLogger } from "./auth";

/**
 * The sign-in surface. Exercises the `@clerk/clerk-react` mock (signed in by default —
 * see `.storybook/clerk-react-mock.tsx`), so this renders the signed-in branch
 * (`SignedInView`). `VITE_API_URL` is bound to `""`, so the export/delete account
 * sections (which need a real API to call) don't mount.
 */
const meta = {
  title: "Hybrid/AuthPanel",
  component: AuthPanel,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AuthPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Signed-in (the mock's default): shows the "you're signed in" state + sign-out. */
export const SignedInState: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("You are signed in.")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Sign out" })).toBeVisible();
  },
};

/**
 * `HybridSessionLogger` — a non-visual side effect (logs the sign-in to the audit
 * store via `window.desktop.logSignIn`, deduped per session). Renders nothing; this
 * story just proves it mounts under the Clerk mock without crashing.
 */
export const SessionLoggerNoOp: Story = {
  render: () => <HybridSessionLogger />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
  },
};
